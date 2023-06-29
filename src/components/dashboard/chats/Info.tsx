"use client";

import { IConversation } from "@/interfaces/Conversation";
import {
  Avatar,
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { UserInfo } from "@/interfaces/UserInfo";

import GroupAddIcon from "@mui/icons-material/GroupAdd";
import moment from "moment";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import HowToRegRoundedIcon from "@mui/icons-material/HowToRegRounded";
import GroupIcon from "@mui/icons-material/Group";
import { User } from "@/interfaces/User";
import { getConversationMembers, leaveGroup } from "@/api/chat";
import LogoutIcon from "@mui/icons-material/Logout";
import { ACCESS_TOKEN } from "@/constants/literals";
import AddMember from "./AddMember";
import { Socket } from "socket.io-client";
import { getUserProfile } from "@/api";
import { RELATIONSHIP } from "@/utils/constant";

const headerStyles = {
  height: "7.16%",
  borderBottom: "1px solid #d6dbe1",
  borderLeft: "1px solid #d6dbe1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const commonTextStyles = {
  color: "black",
};

const titleStyles = {
  fontWeight: "bold",
  fontSize: "1.3rem",
};

const Hr = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#d6dbe1",
        width: "90%",
        height: "2px",
        m: "auto",
      }}
    ></Box>
  );
};

const Info = ({
  conversation,
  conversationsList,
  setSelectedConversation,
  setConversationsList,
  socket,
}: {
  conversation: IConversation;
  conversationsList: IConversation[];
  setSelectedConversation: Function;
  setConversationsList: Function;
  socket: Socket | undefined;
}) => {
  if (conversation.type === "private") {
    const [user, setUser] = useState<UserInfo | undefined>();

    useEffect(() => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      if (accessToken && conversation.privateUserId) {
        getUserProfile(accessToken, conversation.privateUserId)
          .then((userData) => setUser(userData))
          .catch((err) => console.log(err));
      }
    }, []);

    return (
      <Box sx={{ width: "24vw", height: "100vh", backgroundColor: "#f8faff" }}>
        <Box
          sx={{
            ...headerStyles,
          }}
        >
          <Typography sx={{ ...titleStyles, ...commonTextStyles }}>
            User Information
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            pt: "1.5rem",
            pb: "2rem",
          }}
        >
          <Avatar
            src={user?.avatar}
            sx={{ height: "3.5rem", width: "3.5rem" }}
          ></Avatar>
          <Typography
            sx={{
              ...commonTextStyles,
              fontWeight: "bold",
              fontSize: "1.25rem",
              mt: "0.75rem",
            }}
          >{`${user?.firstName} ${user?.lastName}`}</Typography>
          <Box
            sx={{
              backgroundColor:
                user?.status === RELATIONSHIP.FRIEND ? "#e4e6eb" : "#1b74e4",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "0.4rem 0.7rem",
              gap: "0.3rem",
              borderRadius: "0.5rem",
            }}
          >
            {user?.status === RELATIONSHIP.FRIEND ? (
              <HowToRegRoundedIcon
                style={{
                  fill:
                    user?.status === RELATIONSHIP.FRIEND ? "black" : "white",
                  fontSize: "1.15rem",
                }}
              />
            ) : (
              <PersonAddAltRoundedIcon
                style={{
                  fill:
                    user?.status === RELATIONSHIP.FRIEND ? "black" : "white",
                  fontSize: "1.15rem",
                }}
              />
            )}
            <Typography
              sx={{
                color: user?.status === RELATIONSHIP.FRIEND ? "black" : "white",
                fontWeight: "bold",
                fontSize: "0.9rem",
              }}
            >
              {user?.status === RELATIONSHIP.FRIEND ? "Friend" : "Add friend"}
            </Typography>
          </Box>
        </Box>
        <Hr />
        <Box
          sx={{
            ...commonTextStyles,
            p: "1rem 2.25rem",
            pb: "2.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          <Box>
            <Typography
              sx={{ display: "inline-block", width: "40%", color: "gray" }}
            >
              Email
            </Typography>
            <Typography sx={{ display: "inline-block", width: "40%" }}>
              {user?.email}
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{ display: "inline-block", width: "40%", color: "gray" }}
            >
              Gender
            </Typography>
            <Typography sx={{ display: "inline-block", width: "40%" }}>
              {user?.gender}
            </Typography>
          </Box>
          <Box>
            <Typography
              sx={{ display: "inline-block", width: "40%", color: "gray" }}
            >
              DoB
            </Typography>
            <Typography sx={{ display: "inline-block", width: "40%" }}>
              {moment(user?.dob).format("DD/MM/YYYY")}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ color: "gray" }}>About</Typography>
            <Typography sx={{ mt: "0.75rem" }}>{user?.about}</Typography>
          </Box>
        </Box>
        <Hr />
      </Box>
    );
  } else {
    const [open, setOpen] = useState(false);
    const [openAddUsers, setOpenAddUsers] = useState(false);

    const handleOpen = () => setOpenAddUsers(true);

    const handleClose = () => setOpenAddUsers(false);

    const handleToggle = () => {
      setOpen(!open);
    };

    const [members, setMembers] = useState<User[]>([]);

    const handleLeaveGroup = () => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      const conversationId = conversation.id;
      if (accessToken) {
        leaveGroup(accessToken, conversationId)
          .then((res) => {
            const newList = conversationsList.filter(
              (elem) => elem.id !== conversation.id
            );
            setConversationsList(newList);
            if (newList.length) {
              setSelectedConversation(newList[0].id);
            }
          })
          .catch((err) => console.log(err));
      }
    };

    useEffect(() => {
      const accessToken = localStorage.getItem(ACCESS_TOKEN);
      if (accessToken) {
        getConversationMembers(accessToken, conversation.id)
          .then((data) => {
            if (data) {
              setMembers(data);
            }
          })
          .catch((err) => console.log(err));
      }
    }, []);

    return (
      <Box
        sx={{
          width: "24vw",
          height: "100vh",
          backgroundColor: "#f8faff",
          color: "black",
        }}
      >
        <AddMember
          members={members}
          open={openAddUsers}
          handleClose={handleClose}
          socket={socket}
        />
        <Box
          sx={{
            ...headerStyles,
          }}
        >
          <Typography sx={{ ...commonTextStyles, ...titleStyles }}>
            Group Information
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
            pt: "1.5rem",
            pb: "2rem",
          }}
        >
          <Avatar
            src={conversation.avatar}
            sx={{ height: "3.5rem", width: "3.5rem" }}
          ></Avatar>
          <Typography
            sx={{
              ...commonTextStyles,
              fontWeight: "bold",
              fontSize: "1.25rem",
              mt: "0.75rem",
            }}
          >
            {conversation.conversationName}
          </Typography>
          <Box
            sx={{
              backgroundColor: "#1b74e4",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: "0.4rem 0.7rem",
              gap: "0.3rem",
              borderRadius: "0.5rem",
            }}
            onClick={handleOpen}
          >
            <GroupAddIcon
              style={{
                fill: "white",
                fontSize: "1.35rem",
              }}
            />
            <Typography
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "0.9rem",
              }}
            >
              Add member
            </Typography>
          </Box>
        </Box>
        <Hr />
        <Box sx={{ width: "90%", m: "auto" }}>
          <ListItemButton
            onClick={handleToggle}
            sx={{ cursor: "pointer", display: "flex", gap: "0.5rem" }}
          >
            <GroupIcon />
            <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              Members
            </Typography>
            <Box sx={{ ml: "auto" }}>
              {open ? <ExpandLess /> : <ExpandMore />}
            </Box>
          </ListItemButton>
          <Collapse
            in={open}
            timeout="auto"
            unmountOnExit
            sx={{ mt: "0.5rem" }}
          >
            <List component="div" disablePadding>
              {members.map((member, index) => (
                <ListItem key={index}>
                  <Box sx={{ display: "flex", gap: "0.75rem" }}>
                    <Avatar src={member.avatar}></Avatar>
                    <Typography>{`${member.firstName} ${member.lastName}`}</Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Collapse>
        </Box>
        <Hr />
        <Box
          sx={{
            display: "flex",
            color: "#dc3636",
            width: "90%",
            m: "auto",
            mt: "1rem",
            p: "0.5rem 0",
            pl: "1rem",
            gap: "0.5rem",
            cursor: "pointer",
            ":hover": {
              backgroundColor: "#f0f4fa",
            },
          }}
          onClick={handleLeaveGroup}
        >
          <LogoutIcon />
          <Typography>Leave group</Typography>
        </Box>
      </Box>
    );
  }
};

export default Info;
