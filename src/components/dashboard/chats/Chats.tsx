"use client";

import { Box, Typography } from "@mui/material";
import Conversation from "./Conversation";
import { IConversation } from "@/interfaces/Conversation";
import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchTab from "./SearchTab";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CreateConversation from "./create-conversation/CreateConversation";
import SearchBox from "../SearchBox";
import { USER_STATUS } from "@/utils/constant";

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
        userStatus: USER_STATUS.OFF,
        privateUserId: null,
        callType: conversationData.callType,
      };

      if (conversation.type === "private") {
        conversation.userStatus = conversationData.member[0].onlineStatus;
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

    const handleAddedToGroup = (conversation: IConversation) => {
      setConversationsList((prev: IConversation[]) => {
        const newLists = prev.filter((item) => conversation.id !== item.id);
        newLists.unshift(conversation);
        return newLists;
      });
    };

    const handleUserStatusChange = ({
      userId,
      status,
    }: {
      userId: number;
      status: string;
    }) => {
      setConversationsList((prev: IConversation[]) => {
        const newConversationsList = prev.map((conversation) => {
          const newConversation = { ...conversation };
          if (conversation.privateUserId === userId) {
            newConversation.userStatus = status as USER_STATUS;
          }
          return newConversation;
        });

        return newConversationsList;
      });
    };

    socket?.on("noti:receive", handleMessageReceive);
    socket?.on("noti:added-to-group", handleAddedToGroup);
    socket?.on("noti:user-status-change", handleUserStatusChange);

    return () => {
      socket?.off("noti:receive", handleMessageReceive);
      socket?.off("noti:added-to-group", handleAddedToGroup);
      socket?.off("noti:user-status-change", handleUserStatusChange);
    };
  }, [socket]);

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
        socket={socket}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          padding: "0 8%",
          m: "auto",
          mt: "5%",
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
        {!isSearching && (
          <Box sx={{ width: "100%", mt: "11%" }}>
            {conversationsList.map((conversation) => (
              <Conversation
                id={conversation.id}
                conversation={conversation}
                isSelected={selectedConversation === conversation.id}
                handleConversationClick={() =>
                  handleConversationClick(conversation.id)
                }
                key={conversation.id}
              />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Chats;
