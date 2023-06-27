"use client";

import { ACCESS_TOKEN } from "@/constants/literals";
import { BASE_API_URL } from "@/utils/constant";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import io, { Socket } from "socket.io-client";

const Call = dynamic(() => import("../../components/dashboard/calls/Call"), {
  ssr: false,
});

const CallPage = () => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      const socketInstance = io(BASE_API_URL, {
        extraHeaders: {
          token: accessToken,
        },
      });

      setSocket(socketInstance);
    }
  }, []);

  return (
    <div>
      <Call socket={socket} />
    </div>
  );
};

export default CallPage;
