"use client";

import { Box, Grid, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import Conversation from "./Conversation";
import { IConversation } from "@/interfaces/Conversation";
import { useEffect } from "react";
import { getConversations } from "@/api";
import { ACCESS_TOKEN } from "@/constants/literals";
import { socket } from "@/libs/socket";

const Chats = ({
  selectedConversation,
  setSelectedConversation,
  conversationsList,
}: {
  selectedConversation: string;
  setSelectedConversation: Function;
  conversationsList: IConversation[];
}) => {
  const handleConversationClick = (id: string) => {
    socket.emit("join", id);
    setSelectedConversation(id);
  };

  return (
    <Box>
      <Typography
        sx={{
          fontWeight: "bold",
          color: "#000000",
          fontSize: "2rem",
          mt: "1.2rem",
          ml: "1.75rem",
        }}
      >
        Chats
      </Typography>
      <Box
        sx={{
          color: "#709ce6",
          display: "flex",
          flexDirection: "row",
          width: "86%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#EAF2FE",
          m: "auto",
          padding: "1rem 1.5rem",
          borderRadius: "1.4rem",
          mt: "1.5rem",
        }}
      >
        <SearchIcon sx={{ mr: "0.6rem", fill: "#709CE6" }} />
        <input
          placeholder="Search"
          style={{
            outline: "none",
            border: "none",
            background: "transparent",
            color: "#696969",
            fontSize: "1rem",
          }}
        ></input>
        <FilterListIcon
          sx={{
            marginLeft: "auto",
            fill: "#709CE6",
            cursor: "pointer",
          }}
        />
      </Box>
      <Box sx={{ width: "86%", m: "auto", mt: "1.5rem", overflowY: "auto" }}>
        {conversationsList.map((conversation) => (
          <Conversation
            conversation={conversation}
            isSelected={selectedConversation === conversation.id}
            handleConversationClick={() =>
              handleConversationClick(conversation.id)
            }
            key={conversation.id}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Chats;
