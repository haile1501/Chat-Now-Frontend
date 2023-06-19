"use client";
import { IMessage } from "@/interfaces/Message";
import { Avatar, Box, Typography } from "@mui/material";

const commonMessageStyle = {
  padding: "0.5rem 1rem",
  width: "fit-content",
  borderRadius: "0.8rem",
  mt: "0.9rem",
  maxWidth: "38rem",
  wordWrap: "break-word",
};

const commonTextStyle = {
  fontSize: "0.9rem",
};

const Container = ({ children, style }: { children: any; style: any }) => {
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        p: 0,
        ...style,
      }}
    >
      {children}
    </Box>
  );
};

const Message = ({ message }: { message: IMessage }) => {
  if (message.isMine) {
    return (
      <Container style={{ justifyContent: "flex-end", paddingRight: "1.5rem" }}>
        <Box
          sx={{
            backgroundColor: "#5B96F7",
            ...commonMessageStyle,
          }}
        >
          <Typography sx={{ color: "#FFFFFF", ...commonTextStyle }}>
            {message.content}
          </Typography>
        </Box>
      </Container>
    );
  } else {
    return (
      <Container
        style={{
          paddingLeft: "1.5rem",
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
          gap: "0.75rem",
        }}
      >
        <Avatar
          src={message.avatar ? message.avatar : " "}
          sx={{ width: "2.25rem", height: "2.25rem" }}
        ></Avatar>
        <Box
          sx={{
            backgroundColor: "#FFFFFF",
            ...commonMessageStyle,
          }}
        >
          <Typography sx={{ color: "#696969", ...commonTextStyle }}>
            {message.content}
          </Typography>
        </Box>
      </Container>
    );
  }
};

export default Message;
