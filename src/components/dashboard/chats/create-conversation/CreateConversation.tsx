"use client";
import { Box, Modal, Typography } from "@mui/material";
import { useState } from "react";

const Option = ({
  children,
  isSelected,
  handleClick,
}: {
  children: any;
  isSelected: boolean;
  handleClick: any;
}) => {
  return (
    <Box
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        textAlign: "center",
        backgroundColor: isSelected ? "#5b96f7" : "#f0f4fa",
      }}
    >
      {children}
    </Box>
  );
};

const CreateConversation = ({
  open,
  handleClose,
}: {
  open: boolean;
  handleClose: any;
}) => {
  const [currentTab, setCurrentTab] = useState("private");

  const handleClick = (value: string) => {
    setCurrentTab(value);
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
          width: 400,
          bgcolor: "background.paper",
          //   border: "2px solid #000",
          //   boxShadow: 24,
          borderRadius: "2rem",
          p: 4,
          color: "black",
        }}
      >
        <Typography>New Conversation</Typography>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
          <Option
            handleClick={() => handleClick("private")}
            isSelected={currentTab === "private"}
          >
            Private
          </Option>
          <Option
            handleClick={() => handleClick("public")}
            isSelected={currentTab === "public"}
          >
            Public
          </Option>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateConversation;
