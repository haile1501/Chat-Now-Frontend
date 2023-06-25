"use client";

import { Box, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import Conversation from "./Conversation";
import { IConversation } from "@/interfaces/Conversation";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchTab from "./SearchTab";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CreateConversation from "./create-conversation/CreateConversation";
import SearchBox from "../SearchBox";

const Chats = ({
  selectedConversation,
  setSelectedConversation,
  conversationsList,
  setConversationsList,
  socket,
}: {
  selectedConversation: string;
  setSelectedConversation: Function;
  conversationsList: IConversation[];
  setConversationsList: Function;
  socket: Socket | undefined;
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const handleConversationClick = (id: string) => {
    socket?.emit("join", { conversationId: id });

    setSelectedConversation(id);
  };

  const handleExitSearch = () => {
    setSearchInput("");
    setIsSearching(false);
  };

  const handleEnterSearch = () => {
    setIsSearching(true);
  };

  const handleInputChange = (event: any) => {
    const newInput = event.target.value;
    setSearchInput(newInput);
  };

  useEffect(() => {
    const handleMessageReceive = (conversationData: any) => {
      const conversation: IConversation = {
        id: conversationData.conversationId,
        type: conversationData.type,
        lastMessage: conversationData.lastMessage?.content,
        isMyLastMessage: conversationData.isMyLastMessage,
        timeSend: conversationData.lastMessage?.timeSend,
        senderId: conversationData.lastMessage?.user.userId,
        avatar: "",
        conversationName: conversationData.groupName,
        isOnline: false,
        privateUserId: null,
      };

      if (conversation.type === "private") {
        conversation.isOnline =
          conversationData.member[0].onlineStatus === "Online";
        conversation.privateUserId = conversationData.member[0].userId;
      }

      if (conversation.lastMessage && conversation.timeSend) {
        let time = new Date(conversation.timeSend);
        conversation.timeSend = time.getHours() + ":" + time.getMinutes();
      }

      setConversationsList((prev: IConversation[]) => {
        const newLists = prev.filter((item) => conversation.id !== item.id);
        newLists.unshift(conversation);
        return newLists;
      });
    };

    socket?.on("noti:receive", handleMessageReceive);

    return () => {
      socket?.off("receive", handleMessageReceive);
    };
  }, [socket]);

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "86%",
          m: "auto",
          mt: "1.2rem",
        }}
      >
        <Typography
          sx={{
            fontWeight: "bold",
            color: "#000000",
            fontSize: "2rem",
          }}
        >
          Chats
        </Typography>
        <AddCircleIcon
          onClick={handleOpen}
          sx={{
            fill: "#709ce6",
            ml: "auto",
            fontSize: "1.8rem",
            mt: "0.5rem",
            mr: "0.5rem",
            cursor: "pointer",
          }}
        />
      </Box>
      <CreateConversation
        open={open}
        handleClose={handleClose}
        conversationsList={conversationsList}
        setConversationsList={setConversationsList}
        setSelectedConversation={handleConversationClick}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          padding: "0 8%",
          m: "auto",
          mt: "1.5rem",
          gap: "1rem",
        }}
      >
        {isSearching && (
          <ArrowBackIcon
            onClick={handleExitSearch}
            sx={{ fill: "black", cursor: "pointer" }}
          />
        )}
        <SearchBox
          handleEnterSearch={handleEnterSearch}
          handleInputChange={handleInputChange}
          searchInput={searchInput}
        />
      </Box>

      <Box
        sx={{
          width: "100%",
          padding: "0 8%",
          m: "auto",
          mt: "1.5rem",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        {isSearching && (
          <SearchTab
            setSelectedConversation={setSelectedConversation}
            conversationsList={conversationsList}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            setIsSearching={setIsSearching}
          />
        )}
        {!isSearching &&
          conversationsList.map((conversation) => (
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
