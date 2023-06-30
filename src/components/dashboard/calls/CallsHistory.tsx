import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { Socket } from "socket.io-client";
import { CallRecord } from "@/interfaces/CallRecord";
import CallHistoryItem from "@/components/CallHistoryItem"; 

interface CallsHistoryProps {
  socket: Socket | undefined;
}

const CallsHistory: React.FC<CallsHistoryProps> = ({ socket }) => {
  const [callRecords, setCallRecords] = useState<CallRecord[]>([]);

  useEffect(() => {
    if (socket) {
      // Emit an event to request call history from the server
      socket.emit("get-call-history", (history: CallRecord[]) => {
        setCallRecords(history);
      });

      // Listen for incoming call records
      socket.on("new-call-record", (record: CallRecord) => {
        setCallRecords((prevRecords) => [...prevRecords, record]);
      });
    }

    return () => {
      if (socket) {
        // Clean up socket event listener when component is unmounted
        socket.off("new-call-record");
      }
    };
  }, [socket]);

  return (
    <Box>
      <Typography variant="h4">Call History</Typography>
      {callRecords.length === 0 ? (
        <Typography>No call history available.</Typography>
      ) : (
        <Box sx={{ mt: 2 }}>
          {callRecords.map((record) => (
            <CallHistoryItem key={record.id} record={record} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default CallsHistory;
