"use client";
import { ACCESS_TOKEN } from "@/constants/literals";
import { Avatar, Box, Container, Grid, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import chatnow from "../../../public/chatnow.png";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import SideBarItem from "@/components/dashboard/sidebar/SideBarItem";

import { useEffect, useState } from "react";
import Chats from "@/components/dashboard/chats/Chats";
import Notification from "@/components/dashboard/noti/Notification";
import Calls from "@/components/dashboard/calls/Calls";
import Friends from "@/components/dashboard/friends/Friends";
import MainChat from "@/components/dashboard/chats/MainChat";
import { IConversation } from "@/interfaces/Conversation";
import { getConversations } from "@/api/chat";
import NoConversation from "@/components/dashboard/chats/NoConversation";
import io, { Socket } from "socket.io-client";

const DashBoard = () => {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState("chat");
  const [selectedConversation, setSelectedConversation] = useState("");
  const [conversationsList, setConversationsList] = useState<IConversation[]>(
    []
  );
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    if (localStorage.getItem(ACCESS_TOKEN)) {
    } else {
      router.push("/auth/signin");
    }
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      const socketInstance = io("http://localhost:3001", {
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

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
  };

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid
        md={0.8}
        sx={{ backgroundColor: "#f0f4fa", borderRight: "1px solid #e4e6ea" }}
        container
        direction="column"
        alignItems="center"
        item
      >
        <Grid
          sx={{
            backgroundImage: `url(${chatnow.src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "5rem",
            height: "4rem",
            mt: "1.5rem",
          }}
        ></Grid>
        <Grid
          container
          direction="column"
          alignItems="center"
          width="100%"
          gap="1rem"
          mt="35%"
          justifyContent="space-between"
        >
          <SideBarItem
            isSelected={selectedItem === "chat"}
            handleClick={() => handleItemClick("chat")}
          >
            <SmsOutlinedIcon
              style={{ fill: selectedItem === "chat" ? "#ffffff" : "#080707" }}
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
              style={{ fill: selectedItem === "call" ? "#ffffff" : "#080707" }}
            />
          </SideBarItem>
          <SideBarItem
            isSelected={selectedItem === "noti"}
            handleClick={() => handleItemClick("noti")}
          >
            <NotificationsNoneOutlinedIcon
              style={{ fill: selectedItem === "noti" ? "#ffffff" : "#080707" }}
            />
          </SideBarItem>
        </Grid>
        <Grid sx={{ mt: "auto", mb: "3rem", cursor: "pointer" }}>
          <Avatar
            alt="avatar"
            src={chatnow.src}
            sx={{
              width: "3.5rem",
              height: "3.5rem",
              border: "2px solid #b5b6ba",
            }}
          />
        </Grid>
      </Grid>
      <Grid item md={2.5} sx={{ backgroundColor: "#f8faff" }}>
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
        {selectedItem === "call" && <Calls />}
        {selectedItem === "noti" && <Notification />}
      </Grid>
      <Grid item md={8.7}>
        {conversationsList.map((conversation) => {
          if (conversation.id === selectedConversation) {
            return (
              <MainChat
                conversation={conversation}
                key={conversation.id}
                socket={socket}
              />
            );
          }
        })}
        {conversationsList.length === 0 && <NoConversation />}
      </Grid>
    </Grid>
  );
};

export default DashBoard;
