import { CallHistory } from "@/interfaces/CallHistory";
import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const CallsHistory = () => {
  const [calls, setCalls] = useState<CallHistory[]>([]);

  useEffect(() => {}, []);

  return (
    <Box sx={{ height: "100%", color: "black" }}>
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
          Call Logs
        </Typography>
      </Box>
    </Box>
  );
};

export default CallsHistory;
