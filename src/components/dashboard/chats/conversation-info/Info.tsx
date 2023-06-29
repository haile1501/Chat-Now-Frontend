"use client";

import { IConversation } from "@/interfaces/Conversation";
import { Socket } from "socket.io-client";
import PrivateUserInfo from "./PrivateUserInfo";
import GroupInfo from "./GroupInfo";

const Info = ({
  conversation,
  conversationsList,
  setSelectedConversation,
  setConversationsList,
  socket,
}: {
  conversation: IConversation;
  conversationsList: IConversation[];
  setSelectedConversation: Function;
  setConversationsList: Function;
  socket: Socket | undefined;
}) => {
  if (conversation.type === "private") {
    return <PrivateUserInfo conversation={conversation} socket={socket} />;
  } else {
    return (
      <GroupInfo
        conversation={conversation}
        conversationsList={conversationsList}
        setSelectedConversation={setSelectedConversation}
        setConversationsList={setConversationsList}
        socket={socket}
      />
    );
  }
};

export default Info;
