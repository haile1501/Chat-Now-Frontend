import { Box } from "@mui/material";
import React from "react";

const SideBarItem = ({
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
        padding: "1rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        borderRadius: "10%",
        backgroundColor: isSelected ? "#5b96f7" : "",
        ":hover": {
          backgroundColor: isSelected ? " " : "#d2d4d9",
        },
      }}
    >
      {children}
    </Box>
  );
};

export default SideBarItem;
