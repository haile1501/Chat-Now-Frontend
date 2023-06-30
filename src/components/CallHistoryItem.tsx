import React from "react";
import { Typography, Box } from "@mui/material";
import { CallRecord } from "@/interfaces/CallRecord";

interface CallHistoryItemProps {
  record: CallRecord;
}

const CallHistoryItem: React.FC<CallHistoryItemProps> = ({ record }) => {
  return (
    <Box>
      <Typography>{record.caller}</Typography>
      {/* Render other information from the record */}
    </Box>
  );
};

export default CallHistoryItem;
