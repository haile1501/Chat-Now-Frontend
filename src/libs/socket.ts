import { io } from "socket.io-client";

const URL = "http://localhost:3001";

export const chatSocket = io(`${URL}/chat`);
export const notiSocket = io(`${URL}/noti`);
