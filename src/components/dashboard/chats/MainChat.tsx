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

const MainChat = ({
  conversation,
  socket,
}: {
  conversation: IConversation;
  socket: Socket | undefined;
}) => {
  const [messageText, setMessageText] = useState("");
  const [messagesList, setMessagesList] = useState<IMessage[]>([]);
  const containerRef = useRef<HTMLElement>(null);

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

  const sendMessage = () => {
    if (messageText !== "") {
      const message: IMessage = {
        content: messageText,
        isMine: true,
        lastName: null,
        firstName: null,
        avatar: "",
      };

      socket?.emit("send", {
        conversationId: conversation.id,
        content: messageText,
      });
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
        height: "100%",
        backgroundColor: "#f0f4fa",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100%",
          backgroundColor: "#f8faff",
          height: "5rem",
          borderLeft: "1px solid #e3e4e9",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Avatar
          src={conversation.avatar}
          sx={{ width: "3.15rem", height: "3.15rem", ml: "2.25rem" }}
        ></Avatar>
        <Box
          sx={{
            height: "3rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
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
            Online
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
          <VideocamOutlinedIcon
            sx={{ fill: "#4B4B4B", fontSize: "2rem", cursor: "pointer" }}
          />
          <CallOutlinedIcon
            sx={{ fill: "#4B4B4B", fontSize: "1.75rem", cursor: "pointer" }}
          />
          <SearchOutlinedIcon
            sx={{ fill: "#4B4B4B", fontSize: "1.75rem", cursor: "pointer" }}
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
      <Box sx={{ overflowY: "auto", height: "46rem" }} ref={containerRef}>
        {messagesList.map((message, index) => (
          <Message message={message} key={index} />
        ))}
      </Box>
      <Box
        sx={{
          width: "100%",
          position: "absolute",
          bottom: 0,
          border: "1px solid #e3e4e9",
          backgroundColor: "#f8faff",
          padding: "1.25rem 1.5rem",
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
                padding: "1rem 1.5rem",
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
              padding: "0.6rem 0.75rem",
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
