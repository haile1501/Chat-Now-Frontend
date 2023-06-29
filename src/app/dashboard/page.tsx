"use client";
import { ACCESS_TOKEN } from "@/constants/literals";
import { Avatar, Box, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import chatnow from "../../../public/chatnow.png";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SideBarItem from "@/components/dashboard/sidebar/SideBarItem";

import { useEffect, useState } from "react";
import Chats from "@/components/dashboard/chats/Chats";
import Notification from "@/components/dashboard/noti/Notification";
import CallsHistory from "@/components/dashboard/calls/CallsHistory";
import Friends from "@/components/dashboard/friends/Friends";
import MainChat from "@/components/dashboard/chats/MainChat";
import { IConversation } from "@/interfaces/Conversation";
import { getConversations } from "@/api/chat";
import NoConversation from "@/components/dashboard/chats/NoConversation";
import io, { Socket } from "socket.io-client";
import { BASE_API_URL, CALL_TYPE } from "@/utils/constant";
import CallingNoti from "@/components/dashboard/calls/CallingNoti";
import { User } from "@/interfaces/User";
import Info from "@/components/dashboard/chats/Info";

const DashBoard = () => {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState("chat");
  const [selectedConversation, setSelectedConversation] = useState("");
  const [conversationsList, setConversationsList] = useState<IConversation[]>(
    []
  );
  const [socket, setSocket] = useState<Socket>();
  const [open, setOpen] = useState(false);
  const [caller, setCaller] = useState<User>();
  const [callType, setCallType] = useState<CALL_TYPE>(CALL_TYPE.VOICE);
  const [conversationId, setConversationId] = useState<string>("");
  const [openInfo, setOpenInfo] = useState(false);

  const handleClose = () => setOpen(false);

  useEffect(() => {
    if (localStorage.getItem(ACCESS_TOKEN)) {
    } else {
      router.push("/auth/signin");
    }
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      const socketInstance = io(BASE_API_URL, {
        extraHeaders: {
          token: accessToken,
        },
      });

      setSocket(socketInstance);

      getConversations(accessToken)
        .then((res) => {
          if (res?.length) {
            socketInstance.emit("join", { conversationId: res[0].id });
            setSelectedConversation(res[0].id);
            setConversationsList(res);
          }
        })
        .catch((err) => console.log(err));
    }
  }, []);

  useEffect(() => {
    const handleCalling = (data: any) => {
      const { caller, conversationId, type } = data;
      const userCaller: User = {
        firstName: caller.firstName,
        lastName: caller.lastName,
        id: caller.userId,
        avatar: caller.avatar,
      };
      setOpen(true);
      setCaller(userCaller);
      setCallType(type);
      setConversationId(conversationId);
      setConversationsList((prev: IConversation[]) => {
        const newConversationsList = prev.map((conversation) => {
          const newConversation = { ...conversation };
          if (conversation.id === conversationId) {
            newConversation.callType = type;
          }
          return newConversation;
        });

        return newConversationsList;
      });
    };

    const handleEndCall = (data: any) => {
      const { conversationId } = data;
      setConversationsList((prev: IConversation[]) => {
        const newConversationsList = prev.map((conversation) => {
          const newConversation = { ...conversation };
          if (conversation.id === conversationId) {
            newConversation.callType = CALL_TYPE.NO;
          }
          return newConversation;
        });

        return newConversationsList;
      });
    };

    socket?.on("noti:calling", handleCalling);
    socket?.on("noti:end-call", handleEndCall);

    return () => {
      socket?.off("noti:calling", handleCalling);
      socket?.off("noti:end-call", handleEndCall);
    };
  }, [socket]);

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
  };

  return (
    <Box sx={{ height: "100vh", width: "100vw", display: "flex" }}>
      <Grid container sx={{ height: "100vh", overflow: "hidden" }}>
        <CallingNoti
          open={open}
          handleClose={handleClose}
          caller={caller}
          type={callType}
          conversationId={conversationId}
          socket={socket}
        />
        <Grid
          md={0.8}
          sx={{ backgroundColor: "#f0f4fa", borderRight: "1px solid #e4e6ea" }}
          container
          direction="column"
          alignItems="center"
          height="100vh"
          item
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                backgroundImage: `url(${chatnow.src})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "center",
                width: "70%",
                height: "7.25%",
                mt: "25%",
              }}
            ></Box>
            <Box
              sx={{
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
                flexDirection: "column",
                mt: "50%",
                display: "flex",
                gap: "1rem",
              }}
            >
              <SideBarItem
                isSelected={selectedItem === "chat"}
                handleClick={() => handleItemClick("chat")}
              >
                <SmsOutlinedIcon
                  style={{
                    fill: selectedItem === "chat" ? "#ffffff" : "#080707",
                  }}
                />
              </SideBarItem>
              <SideBarItem
                isSelected={selectedItem === "friend"}
                handleClick={() => handleItemClick("friend")}
              >
                <PeopleAltOutlinedIcon
                  style={{
                    fill: selectedItem === "friend" ? "#ffffff" : "#080707",
                  }}
                />
              </SideBarItem>
              <SideBarItem
                isSelected={selectedItem === "call"}
                handleClick={() => handleItemClick("call")}
              >
                <CallOutlinedIcon
                  style={{
                    fill: selectedItem === "call" ? "#ffffff" : "#080707",
                  }}
                />
              </SideBarItem>
              <SideBarItem
                isSelected={selectedItem === "noti"}
                handleClick={() => handleItemClick("noti")}
              >
                <NotificationsNoneOutlinedIcon
                  style={{
                    fill: selectedItem === "noti" ? "#ffffff" : "#080707",
                  }}
                />
              </SideBarItem>
            </Box>
            <Box sx={{ mt: "auto", cursor: "pointer", mb: "35%" }}>
              <Avatar
                alt="avatar"
                src={chatnow.src}
                sx={{
                  width: "3.5rem",
                  height: "3.5rem",
                  border: "2px solid #b5b6ba",
                }}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item md={2.5} sx={{ backgroundColor: "#f8faff" }} height="100vh">
          {selectedItem === "chat" && (
            <Chats
              setSelectedConversation={setSelectedConversation}
              selectedConversation={selectedConversation}
              conversationsList={conversationsList}
              setConversationsList={setConversationsList}
              socket={socket}
            />
          )}
          {selectedItem === "friend" && <Friends />}
          {selectedItem === "call" && <CallsHistory />}
          {selectedItem === "noti" && <Notification />}
        </Grid>
        <Grid item md={8.7} height="100vh">
          {conversationsList.map((conversation) => {
            if (conversation.id === selectedConversation) {
              return (
                <MainChat
                  setConversationsList={setConversationsList}
                  conversation={conversation}
                  key={conversation.id}
                  socket={socket}
                  setOpenInfo={setOpenInfo}
                />
              );
            }
          })}
          {conversationsList.length === 0 && <NoConversation />}
        </Grid>
      </Grid>
      {openInfo && (
        <>
          {conversationsList.map((conversation) => {
            if (conversation.id === selectedConversation) {
              return (
                <Info
                  conversation={conversation}
                  key={conversation.id}
                  conversationsList={conversationsList}
                  setSelectedConversation={setSelectedConversation}
                  setConversationsList={setConversationsList}
                  socket={socket}
                />
              );
            }
          })}
        </>
      )}
    </Box>
  );
};

export default DashBoard;
