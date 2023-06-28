"use client";
import { IConversation } from "@/interfaces/Conversation";
import { Avatar, Box, Typography } from "@mui/material";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { useEffect, useRef, useState } from "react";
import telegram from "../../../../public/TelegramLogo.svg";
import { IMessage } from "@/interfaces/Message";
import Message from "./Message";
import { Socket } from "socket.io-client";
import { getMessagesList } from "@/api/chat";
import CircleIcon from "@mui/icons-material/Circle";
import { CALL_TYPE, USER_STATUS } from "@/utils/constant";
import VideocamIcon from "@mui/icons-material/Videocam";
import CallIcon from "@mui/icons-material/Call";
import React from "react";
import SearchMessage from "./SearchMessage";

const UserStatus = ({ userStatus }: { userStatus: USER_STATUS }) => {
  let text;
  let color;
  switch (userStatus) {
    case USER_STATUS.ON:
      text = "Online";
      color = "#31a24c";
      break;
    case USER_STATUS.OFF:
      text = "Offline";
      color = "#848689";
      break;
    case USER_STATUS.CALL:
      text = "In a call";
      color = "#d02d4d";
      break;
  }

  return (
    <span>
      {text}{" "}
      <span>
        <CircleIcon sx={{ fill: color, fontSize: "0.75rem" }} />
      </span>
    </span>
  );
};

const MainChat = ({
  setConversationsList,
  conversation,
  socket,
}: {
  conversation: IConversation;
  setConversationsList: Function;
  socket: Socket | undefined;
}) => {
  const [messageText, setMessageText] = useState("");
  const [messagesList, setMessagesList] = useState<IMessage[]>([]);
  const containerRef = useRef<HTMLElement>(null);

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? conversation.id : undefined;

  const handleMessageChange = (event: any) => {
    setMessageText(event.target.value);
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const handleSendClick = () => {
    sendMessage();
  };

  const handleCall = (type: string) => {
    setConversationsList((prev: IConversation[]) => {
      const newConversationsList = prev.map((conversation) => {
        const newConversation = { ...conversation };
        if (conversation.id === conversation.id) {
          newConversation.callType = type as CALL_TYPE;
        }
        return newConversation;
      });

      return newConversationsList;
    });
    socket?.emit("call", { type, conversationId: conversation.id }, () => {
      window.open(
        `${window.location.origin}/call?conversationId=${conversation.id}&type=${type}`,
        "Popup",
        "location,status,scrollbars,resizable,width=600, height=600"
      );
    });
  };

  const handleJoinCall = (type: string) => {
    socket?.emit("join-call", { conversationId: conversation.id }, () => {
      window.open(
        `${window.location.origin}/call?conversationId=${conversation.id}&type=${type}`,
        "Popup",
        "location,status,scrollbars,resizable,width=600, height=600"
      );
    });
  };

  const sendMessage = () => {
    if (messageText !== "") {
      let messageId = -1;
      socket?.emit(
        "send",
        {
          conversationId: conversation.id,
          content: messageText,
        },
        (id: number) => {
          messageId = id;
        }
      );

      const message: IMessage = {
        messageId,
        content: messageText,
        isMine: true,
        lastName: null,
        firstName: null,
        avatar: "",
      };

      setMessagesList((prevMessagesList) => [...prevMessagesList, message]);
      setMessageText("");
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      getMessagesList(conversation.id, accessToken)
        .then((messagesList) => {
          if (messagesList?.length) {
            setMessagesList(messagesList);
          }
        })
        .catch((err) => console.log(err));
    }
  }, [getMessagesList]);

  useEffect(() => {
    function handleMessageReceive(messageData: any) {
      if (messageData.conversation.conversationId === conversation.id) {
        const message: IMessage = {
          messageId: messageData.messageId,
          content: messageData.content,
          firstName: messageData.user.firstName,
          lastName: messageData.user.lastName,
          avatar: messageData.user.avatar,
          isMine: false,
        };
        setMessagesList((prevMessagesList) => [...prevMessagesList, message]);
      }
    }

    socket?.on("receive", handleMessageReceive);

    return () => {
      socket?.off("receive", handleMessageReceive);
    };
  }, [setMessagesList, socket]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messagesList]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#f0f4fa",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#f8faff",
          height: "7%",
          borderLeft: "1px solid #e3e4e9",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          p: "2.5% 0",
        }}
      >
        <Avatar
          src={conversation.avatar}
          sx={{ width: "10", height: "10", ml: "2.25rem" }}
        ></Avatar>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            ml: "0.8rem",
            color: "black",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.15rem",
              fontWeight: "bold",
            }}
          >
            {conversation.conversationName}
          </Typography>
          <Typography
            sx={{
              fontSize: "1rem",
            }}
          >
            {conversation.type === "group" ? (
              ""
            ) : (
              <UserStatus userStatus={conversation.userStatus as USER_STATUS} />
            )}
          </Typography>
        </Box>
        <Box
          sx={{
            ml: "auto",
            display: "flex",
            alignItems: "center",
            gap: "2.5rem",
          }}
        >
          {conversation.callType === CALL_TYPE.NO && (
            <VideocamOutlinedIcon
              sx={{ fill: "#4B4B4B", fontSize: "2rem", cursor: "pointer" }}
              onClick={() => handleCall("video")}
            />
          )}
          {conversation.callType === CALL_TYPE.NO && (
            <CallOutlinedIcon
              sx={{ fill: "#4B4B4B", fontSize: "1.75rem", cursor: "pointer" }}
              onClick={() => handleCall("voice")}
            />
          )}
          {conversation.callType !== CALL_TYPE.NO &&
            conversation.type === "group" && (
              <Box
                onClick={() => handleJoinCall(conversation.callType)}
                sx={{
                  backgroundColor: "#45bd62",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  color: "white",
                  padding: "0.25rem 1.75rem",
                  gap: "0.5rem",
                  borderRadius: "0.7rem",
                  cursor: "pointer",
                }}
              >
                {conversation.callType === CALL_TYPE.VIDEO && (
                  <VideocamIcon sx={{ fill: "white", fontSize: "2rem" }} />
                )}
                {conversation.callType === CALL_TYPE.VOICE && (
                  <CallIcon sx={{ fill: "white", fontSize: "1.75rem" }} />
                )}

                <Typography sx={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                  Join call
                </Typography>
              </Box>
            )}
          <Box onClick={handleClick}>
            <SearchOutlinedIcon
              sx={{ fill: "#4B4B4B", fontSize: "1.75rem", cursor: "pointer" }}
            />
          </Box>
          <SearchMessage
            messagesList={messagesList}
            id={conversation.id}
            open={open}
            anchorEl={anchorEl}
            handleClose={handleClose}
          />

          <InfoOutlinedIcon
            sx={{
              fill: "#4B4B4B",
              fontSize: "1.75rem",
              borderLeft: "2px solid #c5c5c7",
              width: "7rem",
              cursor: "pointer",
            }}
          />
        </Box>
      </Box>
      <Box
        sx={{ overflowY: "auto", maxHeight: "77%", position: "relative" }}
        ref={containerRef}
        id="messages-container"
      >
        {messagesList.map((message, index) => (
          <Message
            message={message}
            key={index}
            isGroup={conversation.type === "group"}
          />
        ))}
      </Box>
      <Box
        sx={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          border: "1px solid #e3e4e9",
          backgroundColor: "#f8faff",
          padding: "1.3% 1.75%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Box
            sx={{
              backgroundColor: "#dfe8f5",
              borderRadius: "0.6rem",
              width: "100%",
            }}
          >
            <input
              type="text"
              placeholder="Write a message ..."
              style={{
                outline: "none",
                border: "none",
                background: "transparent",
                color: "black",
                fontSize: "1rem",
                padding: "1.5%",
                width: "100%",
              }}
              value={messageText}
              onChange={handleMessageChange}
              onKeyDown={handleKeyPress}
            />
          </Box>
          <Box
            onClick={handleSendClick}
            sx={{
              backgroundColor: "#5B96F7",
              ml: "1.5rem",
              padding: "0.9% 1%",
              borderRadius: "0.6rem",
              cursor: "pointer",
            }}
          >
            <img src={telegram.src} alt="" style={{ height: "1.75rem" }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default MainChat;
