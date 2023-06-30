"use client";
import { leaveGroup, getConversationMembers } from "@/api/chat";
import UserAvatar from "@/components/UserAvatar";
import { ACCESS_TOKEN } from "@/constants/literals";
import { IConversation } from "@/interfaces/Conversation";
import { User } from "@/interfaces/User";
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import AddMember from "./AddMember";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import GroupIcon from "@mui/icons-material/Group";
import LogoutIcon from "@mui/icons-material/Logout";

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

const GroupInfo = ({
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
            handleClose();
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
        conversation={conversation}
        conversationId={conversation.id}
        setMembers={setMembers}
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
        <UserAvatar
          src={conversation.avatar}
          styles={{ height: "3.5rem", width: "3.5rem" }}
        ></UserAvatar>
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
        <Collapse in={open} timeout="auto" unmountOnExit sx={{ mt: "0.5rem" }}>
          <List component="div" disablePadding>
            {members.map((member, index) => (
              <ListItem key={index}>
                <Box sx={{ display: "flex", gap: "0.75rem" }}>
                  <UserAvatar src={member.avatar}></UserAvatar>
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
};

export default GroupInfo;
