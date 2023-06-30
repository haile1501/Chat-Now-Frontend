"use client";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import { User } from "@/interfaces/User";
import UserAvatar from "@/components/UserAvatar";
import { getFriends } from "@/api/friends";
import { ACCESS_TOKEN } from "@/constants/literals";

const Friends = ({ socket }: { socket: Socket | undefined }) => {
  const [friends, setFriends] = useState<User[]>([]);
  const [openFriends, setOpenFriends] = useState(false);
  const handleOpenFriends = () => {
    setOpenFriends(!openFriends);
  };

  const [openRequests, setOpenRequests] = useState(false);
  const handleOpenRequests = () => {
    setOpenRequests(!openRequests);
  };

  const [openSent, setOpenSent] = useState(false);
  const handleToggleSent = () => {
    setOpenSent(!openSent);
  };

  const [openReceived, setOpenReceived] = useState(false);
  const handleToggleReceived = () => {
    setOpenReceived(!openReceived);
  };

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      getFriends(accessToken).then((friendsData: User[] | undefined) => {
        if (friendsData) {
          setFriends(friendsData);
        }
      });
    }
  }, [setFriends]);

  return (
    <Box sx={{ height: "100%", color: "black" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "80%",
          m: "auto",
          mt: "7.5%",
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            color: "#000000",
            fontSize: "2rem",
          }}
        >
          Friends
        </Typography>
      </Box>
      <Box>
        <ListItemButton
          onClick={handleOpenFriends}
          sx={{ cursor: "pointer", display: "flex", gap: "0.5rem" }}
        >
          <HowToRegIcon />
          <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
            Your friends
          </Typography>
          <Box sx={{ ml: "auto" }}>
            {openFriends ? <ExpandLess /> : <ExpandMore />}
          </Box>
        </ListItemButton>
        <Collapse
          in={openFriends}
          timeout="auto"
          unmountOnExit
          sx={{ mt: "0.5rem" }}
        >
          <List component="div" disablePadding>
            {friends.map((friend, index) => (
              <ListItem key={index}>
                <Box sx={{ display: "flex", gap: "0.75rem" }}>
                  <UserAvatar src={friend.avatar}></UserAvatar>
                  <Typography>{`${friend.firstName} ${friend.lastName}`}</Typography>
                </Box>
              </ListItem>
            ))}
          </List>
        </Collapse>
      </Box>
      <Box>
        <ListItemButton
          onClick={handleOpenRequests}
          sx={{ cursor: "pointer", display: "flex", gap: "0.5rem" }}
        >
          <PersonAddAltRoundedIcon />
          <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
            Friends request
          </Typography>
          <Box sx={{ ml: "auto" }}>
            {openRequests ? <ExpandLess /> : <ExpandMore />}
          </Box>
        </ListItemButton>
        <Collapse
          in={openRequests}
          timeout="auto"
          unmountOnExit
          sx={{ mt: "0.5rem" }}
        >
          <ListItemButton onClick={handleToggleReceived}>
            <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              Requests received
            </Typography>
            <Box sx={{ ml: "auto" }}>
              {openReceived ? <ExpandLess /> : <ExpandMore />}
            </Box>
          </ListItemButton>
          <Collapse in={openSent} timeout="auto" unmountOnExit>
            <List component="div" disablePadding></List>
          </Collapse>
          <ListItemButton onClick={handleToggleSent}>
            <Typography sx={{ fontWeight: "bold", fontSize: "1.1rem" }}>
              Requests sent
            </Typography>
            <Box sx={{ ml: "auto" }}>
              {openSent ? <ExpandLess /> : <ExpandMore />}
            </Box>
          </ListItemButton>
          <Collapse in={openReceived} timeout="auto" unmountOnExit>
            <List component="div" disablePadding></List>
          </Collapse>
        </Collapse>
      </Box>
    </Box>
  );
};

export default Friends;
