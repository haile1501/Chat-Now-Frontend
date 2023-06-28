"use client";

import { IMessage } from "@/interfaces/Message";
import { Box, Popover, Typography } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";

const SearchMessage = ({
  id,
  open,
  anchorEl,
  handleClose,
  messagesList,
}: {
  id: string;
  open: boolean;
  anchorEl: any;
  handleClose: any;
  messagesList: IMessage[];
}) => {
  const [input, setInput] = useState("");
  const [findResults, setFindResults] = useState<IMessage[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);

  const handleChange = (event: any) => {
    setInput(event.target.value);
  };

  const handleFind = () => {
    if (input.trim() !== "") {
      const results = messagesList.filter((message) =>
        message.content.toLowerCase().includes(input.trim().toLowerCase())
      );
      setFindResults(results);

      if (results.length) {
        setCurrentResultIndex(0);
        scrollToResult(String(results[0].messageId));
      }
    }
  };

  const moveResults = (direction: string) => {
    if (direction === "up" && currentResultIndex > 0) {
      scrollToResult(String(findResults[currentResultIndex - 1].messageId));
      setCurrentResultIndex((prev) => prev - 1);
    } else if (
      direction === "down" &&
      currentResultIndex < findResults.length - 1
    ) {
      scrollToResult(String(findResults[currentResultIndex + 1].messageId));
      setCurrentResultIndex((prev) => prev + 1);
    }
  };

  const scrollToResult = (id: string) => {
    const firstResultElem = document.getElementById(String(id));
    const topPos = firstResultElem?.offsetTop;
    const messagesContainer = document.getElementById("messages-container");
    if (messagesContainer) {
      messagesContainer.scrollTop = topPos || 0;
    }
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          padding: "0.7rem 0.5rem",
          gap: "0.5rem",
          bgcolor: "#ffffff",
          width: "20vw",
        }}
      >
        <Box
          sx={{
            borderRadius: "5rem",
            backgroundColor: "#f0f2f5",
            display: "flex",
            justifyContent: "center",
            width: "70%",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={handleChange}
            style={{
              backgroundColor: "#f0f2f5",
              outline: "none",
              border: "none",
              color: "black",
              width: "90%",
              padding: "0.25rem 0",
              fontSize: "1rem",
            }}
          />
        </Box>

        <Typography
          onClick={handleFind}
          sx={{ fontWeight: "bold", cursor: "pointer", fontSize: "1rem" }}
        >
          Find
        </Typography>
        <KeyboardArrowUpIcon
          sx={{ cursor: "pointer" }}
          onClick={() => moveResults("up")}
        />
        <KeyboardArrowDownIcon
          sx={{ cursor: "pointer" }}
          onClick={() => moveResults("down")}
        />
      </Box>
    </Popover>
  );
};

export default SearchMessage;
