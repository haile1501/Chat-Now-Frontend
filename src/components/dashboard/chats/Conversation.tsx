"use client";
import UserAvatar from "@/components/UserAvatar";
import { IConversation } from "@/interfaces/Conversation";
import { Box, Typography } from "@mui/material";

const Conversation = ({
  id,
  conversation,
  isSelected,
  handleConversationClick,
}: {
  id: string;
  conversation: IConversation;
  isSelected: boolean;
  handleConversationClick: any;
}) => {
  return (
    <Box
      id={id}
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
      <UserAvatar
        src={conversation.avatar}
        styles={{ width: "3rem", height: "3rem" }}
      ></UserAvatar>
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
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
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
