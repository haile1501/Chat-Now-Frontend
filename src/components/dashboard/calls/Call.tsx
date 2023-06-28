"use client";
// same file as the videocall example
import React, { useEffect, useState } from "react";
import {
  AgoraVideoPlayer,
  createClient,
  ClientConfig,
  IAgoraRTCRemoteUser,
  createMicrophoneAndCameraTracks,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-react";
import { APP_ID } from "@/constants/agora";
import { genRTCToken } from "@/api/call";
import { ACCESS_TOKEN } from "@/constants/literals";
import { Socket } from "socket.io-client";

const config: ClientConfig = {
  mode: "rtc",
  codec: "vp8",
};

const appId: string = APP_ID; //ENTER APP ID HERE

const urlParams = new URLSearchParams(window.location.search);
const channelName = urlParams.get("conversationId") || "";

const Call = ({ socket }: { socket: Socket | undefined }) => {
  const [inCall, setInCall] = useState(true);

  return (
    <div>
      <h1 className="heading">Agora RTC NG SDK React Wrapper</h1>
      {inCall && (
        <VideoCall
          setInCall={setInCall}
          channelName={channelName}
          socket={socket}
        />
      )}
    </div>
  );
};

// the create methods in the wrapper return a hook
// the create method should be called outside the parent component
// this hook can be used the get the client/stream in any component
const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const VideoCall = (props: {
  setInCall: React.Dispatch<React.SetStateAction<boolean>>;
  channelName: string;
  socket: Socket | undefined;
}) => {
  const { setInCall, channelName, socket } = props;
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [start, setStart] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [uid, setUid] = useState<string | null>(null);
  // using the hook to get access to the client object
  const client = useClient();
  // ready is a state variable, which returns true when the local tracks are initialized, untill then tracks variable is null
  const { ready, tracks } = useMicrophoneAndCameraTracks();
  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      genRTCToken(accessToken, channelName)
        .then(({ token, uid }) => {
          setToken(token);
          setUid(uid);
        })
        .catch((err) => console.log(err));
    }

    // function to initialise the SDK
    let init = async (name: string) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user, type) => {
        if (type === "audio") {
          user.audioTrack?.stop();
        }
        if (type === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on("user-left", (user) => {
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });

      await client.join(appId, name, token, uid);
      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setStart(true);
    };

    if (ready && tracks) {
      init(channelName);
    }
  }, [channelName, client, ready, tracks]);

  return (
    <div className="App">
      {ready && tracks && (
        <Controls
          tracks={tracks}
          setStart={setStart}
          setInCall={setInCall}
          socket={socket}
        />
      )}
      {start && tracks && <Videos users={users} tracks={tracks} />}
    </div>
  );
};

const Videos = (props: {
  users: IAgoraRTCRemoteUser[];
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
}) => {
  const { users, tracks } = props;

  return (
    <div>
      <div id="videos">
        {/* AgoraVideoPlayer component takes in the video track to render the stream,
            you can pass in other props that get passed to the rendered div */}
        <AgoraVideoPlayer
          style={{ height: "95%", width: "95%" }}
          className="vid"
          videoTrack={tracks[1]}
        />
        {users.length > 0 &&
          users.map((user) => {
            if (user.videoTrack) {
              return (
                <AgoraVideoPlayer
                  style={{ height: "95%", width: "95%" }}
                  className="vid"
                  videoTrack={user.videoTrack}
                  key={user.uid}
                />
              );
            } else return null;
          })}
      </div>
    </div>
  );
};

export const Controls = (props: {
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
  setInCall: React.Dispatch<React.SetStateAction<boolean>>;
  socket: Socket | undefined;
}) => {
  const client = useClient();
  const { tracks, setStart, setInCall, socket } = props;
  const [trackState, setTrackState] = useState({ video: true, audio: true });

  const mute = async (type: "audio" | "video") => {
    if (type === "audio") {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === "video") {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  const leaveChannel = async () => {
    socket?.emit("leave-call", { conversationId: channelName }, async () => {
      await client.leave();
      client.removeAllListeners();
      // we close the tracks to perform cleanup
      tracks[0].close();
      tracks[1].close();
      setStart(false);
      setInCall(false);
      window.close();
    });
  };

  return (
    <div className="controls">
      <p className={trackState.audio ? "on" : ""} onClick={() => mute("audio")}>
        {trackState.audio ? "MuteAudio" : "UnmuteAudio"}
      </p>
      <p className={trackState.video ? "on" : ""} onClick={() => mute("video")}>
        {trackState.video ? "MuteVideo" : "UnmuteVideo"}
      </p>
      {<p onClick={() => leaveChannel()}>Leave</p>}
    </div>
  );
};

// const ChannelForm = (props: {
//   setInCall: React.Dispatch<React.SetStateAction<boolean>>;
//   setChannelName: React.Dispatch<React.SetStateAction<string>>;
// }) => {
//   const { setInCall, setChannelName } = props;

//   return (
//     <form className="join">
//       {appId === "" && (
//         <p style={{ color: "red" }}>
//           Please enter your Agora App ID in App.tsx and refresh the page
//         </p>
//       )}
//       <input
//         type="text"
//         placeholder="Enter Channel Name"
//         onChange={(e) => setChannelName(e.target.value)}
//       />
//       <button
//         onClick={(e) => {
//           e.preventDefault();
//           setInCall(true);
//         }}
//       >
//         Join
//       </button>
//     </form>
//   );
// };

export default Call;
