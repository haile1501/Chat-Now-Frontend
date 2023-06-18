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

const DashBoard = () => {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState("chat");
  // useEffect(() => {
  //   if (localStorage.getItem(ACCESS_TOKEN)) {
  //   } else {
  //     router.push("/auth/signin");
  //   }
  // }, []);

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
      <Grid item md={2.5} sx={{ backgroundColor: "#f8faff", color: "red" }}>
        {selectedItem === "chat" && <Chats />}
        {selectedItem === "friend" && <Friends />}
        {selectedItem === "call" && <Calls />}
        {selectedItem === "noti" && <Notification />}
      </Grid>
      <Grid item md={8.7}></Grid>
    </Grid>
  );
};

export default DashBoard;
