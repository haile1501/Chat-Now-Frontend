"use client";

import { User } from "@/interfaces/User";
import { Modal, Typography, Box } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import CallIcon from "@mui/icons-material/Call";
import CloseIcon from "@mui/icons-material/Close";
import { Socket } from "socket.io-client";
import UserAvatar from "@/components/UserAvatar";

const OptionButton = ({
  accept,
  children,
}: {
  children: any;
  accept: boolean;
}) => {
  const style = {
    padding: "0.75rem",
    backgroundColor: accept ? "#4ece23" : "#f03d26",
    width: "fit-content",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
  };

  return <Box sx={style}>{children}</Box>;
};

const CallingNoti = ({
  open,
  handleClose,
  caller,
  type,
  conversationId,
  socket,
}: {
  type: string;
  caller: User | undefined;
  open: boolean;
  handleClose: any;
  conversationId: string;
  socket: Socket | undefined;
}) => {
  const handleReply = () => {
    socket?.emit("join-call", { conversationId }, () => {
      window.open(
        `${window.location.origin}/call?conversationId=${conversationId}&type=${type}`,
        "Popup",
        "location,status,scrollbars,resizable,width=600, height=600"
      );
    });
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          //   border: "2px solid #000",
          //   boxShadow: 24,
          borderRadius: "5%",
          p: "2% 3%",
          color: "black",
          display: "flex",
          flexDirection: "column",
          outline: "none",
          alignItems: "center",
          gap: "1.5rem",
        }}
      >
        <UserAvatar
          src={caller?.avatar}
          styles={{ height: "3rem", width: "3rem" }}
        ></UserAvatar>
        <Typography sx={{ fontSize: "1.2rem" }}>
          <span
            style={{ fontWeight: "bold" }}
          >{`${caller?.firstName} ${caller?.lastName}`}</span>{" "}
          is calling you
        </Typography>
        <Box sx={{ display: "flex", gap: "2rem" }}>
          <Box onClick={handleReply}>
            {type === "video" && (
              <OptionButton accept={true}>
                <VideocamIcon sx={{ fill: "white" }} />
              </OptionButton>
            )}
            {type === "voice" && (
              <OptionButton accept={true}>
                <CallIcon sx={{ fill: "white" }} />
              </OptionButton>
            )}
          </Box>
          <Box onClick={handleClose}>
            <OptionButton accept={false}>
              <CloseIcon sx={{ fill: "white" }} />
            </OptionButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CallingNoti;
