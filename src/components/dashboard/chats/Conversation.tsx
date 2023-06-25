"use client";
import { IConversation } from "@/interfaces/Conversation";
import { Avatar, Box, Typography } from "@mui/material";

const Conversation = ({
  conversation,
  isSelected,
  handleConversationClick,
}: {
  conversation: IConversation;
  isSelected: boolean;
  handleConversationClick: any;
}) => {
  return (
    <Box
      onClick={handleConversationClick}
      sx={{
        backgroundColor: isSelected ? "#5B96F7" : "#f0f4fa",
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        mt: "1rem",
        borderRadius: "1.25rem",
        padding: "0.9rem 1.15rem",
        cursor: "pointer",
      }}
    >
      <Avatar
        src={conversation.avatar}
        sx={{ width: "3.15rem", height: "3.15rem" }}
      ></Avatar>
      <Box
        sx={{
          height: "3rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          ml: "0.75rem",
          width: "100%",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.15rem",
            fontWeight: "bold",
            color: isSelected ? "#ffffff" : "black",
          }}
        >
          {conversation.conversationName}
        </Typography>
        <Typography
          sx={{
            fontSize: "1rem",
            color: isSelected ? "#ffffff" : "black",
            width: "10rem",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {conversation.isMyLastMessage
            ? `You: ${conversation.lastMessage}`
            : conversation.lastMessage}
        </Typography>
      </Box>
      <Typography
        sx={{
          ml: "auto",
          fontSize: "0.85rem",
          color: isSelected ? "#ffffff" : "black",
        }}
      >
        {conversation.timeSend}
      </Typography>
    </Box>
  );
};

export default Conversation;
