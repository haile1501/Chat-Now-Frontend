import { IConversation } from "@/interfaces/Conversation";
import { Avatar, Box } from "@mui/material";

const SearchResult = ({
  conversation,
  setSelectedConversation,
  setSearchInput,
  setIsSearching,
}: {
  conversation: IConversation;
  setSelectedConversation: Function;
  setSearchInput: Function;
  setIsSearching: Function;
}) => {
  const handleClick = (event: any, id: string) => {
    setSelectedConversation(id);
    setSearchInput("");
    setIsSearching(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={(event) => handleClick(event, conversation.id)}
    >
      <Avatar src={conversation.avatar}></Avatar>
      <Box>{conversation.conversationName}</Box>
    </Box>
  );
};

const SearchTab = ({
  setSelectedConversation,
  conversationsList,
  searchInput,
  setSearchInput,
  setIsSearching,
}: {
  setSelectedConversation: Function;
  conversationsList: IConversation[];
  searchInput: string;
  setSearchInput: Function;
  setIsSearching: Function;
}) => {
  return (
    <Box sx={{ color: "black" }}>
      {conversationsList.map((conversation, index) => {
        if (
          conversation.conversationName
            .toLowerCase()
            .includes(searchInput.toLowerCase())
        ) {
          return (
            <SearchResult
              setSelectedConversation={setSelectedConversation}
              conversation={conversation}
              key={index}
              setSearchInput={setSearchInput}
              setIsSearching={setIsSearching}
            />
          );
        }
      })}
    </Box>
  );
};

export default SearchTab;
