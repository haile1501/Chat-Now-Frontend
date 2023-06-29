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
import { useState } from "react";
import { Socket } from "socket.io-client";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import { User } from "@/interfaces/User";
import UserAvatar from "@/components/UserAvatar";

const Friends = ({ socket }: { socket: Socket | undefined }) => {
  const [friends, setFriends] = useState<User[]>([]);
  const [openFriends, setOpenFriends] = useState(false);
  const handleOpenFriends = () => {
    setOpenFriends(true);
  };

  return (
    <Box sx={{ height: "100%" }}>
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
            Members
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
    </Box>
  );
};

export default Friends;
