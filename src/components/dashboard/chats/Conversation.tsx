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
        mb: "6%",
        borderRadius: "1.25rem",
        padding: "6%",
        cursor: "pointer",
      }}
    >
      <Avatar
        src={conversation.avatar}
        sx={{ width: "3rem", height: "3rem" }}
      ></Avatar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          ml: "0.75rem",
          width: "60%",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.1rem",
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
