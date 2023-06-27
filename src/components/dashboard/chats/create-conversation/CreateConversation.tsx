"use client";
import { User } from "@/interfaces/User";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { findAllUser } from "@/api/user";
import { ACCESS_TOKEN } from "@/constants/literals";
import { createFilterOptions } from "@mui/material";
import { createConversation } from "@/api/chat";
import { IConversation } from "@/interfaces/Conversation";
import { Socket } from "socket.io-client";

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
  conversationsList,
  setConversationsList,
  setSelectedConversation,
  socket,
}: {
  open: boolean;
  handleClose: any;
  conversationsList: IConversation[];
  setConversationsList: Function;
  setSelectedConversation: Function;
  socket: Socket | undefined;
}) => {
  const [currentTab, setCurrentTab] = useState("private");
  const [privateUser, setPrivateUser] = useState<User | null>(null);
  const [groupUsers, setGroupUsers] = useState<User[]>([]);
  const [groupNameInput, setGroupNameInput] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [groupUserSearch, setGroupUserSearch] = useState("");
  const [privateUserSearch, setPrivateUserSearch] = useState("");

  const handleClick = (value: string) => {
    setUsers([]);
    setCurrentTab(value);
  };

  const handleGroupNameChange = (event: any) => {
    setGroupNameInput(event.target.value);
  };

  const handleGrUsrSearchChange = (event: any, newInputValue: string) => {
    setGroupUserSearch(newInputValue);

    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (newInputValue.trim() !== "" && accessToken) {
      findAllUser(newInputValue, accessToken)
        .then((users) => {
          if (users) {
            setUsers(users);
          }
        })
        .catch((err) => console.log(err));
    } else if (newInputValue.trim() === "") {
      setUsers([]);
    }
  };

  const checkIsValidInput = () => {
    if (currentTab === "private" && privateUser !== null) {
      return true;
    } else if (currentTab === "group" && groupUsers.length) {
      return true;
    }

    return false;
  };

  const handleCreate = () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (checkIsValidInput() && accessToken) {
      let userIds: number[] = [];
      let type = "private";
      let groupName = null;
      if (currentTab === "private" && privateUser) {
        userIds = [privateUser.id];
        type = "private";
        groupName = null;
        setPrivateUser(null);
      } else if (currentTab === "group") {
        userIds = groupUsers.map((user) => user.id);
        type = "group";
        groupName = groupNameInput;
        setGroupUsers([]);
      }

      createConversation(accessToken, userIds, type, groupName)
        .then((conversationData: IConversation | undefined) => {
          if (conversationData) {
            if (
              conversationsList.some(
                (conversation) => conversation.id === conversationData.id
              )
            ) {
              setSelectedConversation(conversationData.id);
              handleClose();
            } else {
              setConversationsList((prev: IConversation[]) => [
                conversationData,
                ...prev,
              ]);
              setSelectedConversation(conversationData.id);
              if (conversationData.type === "group") {
                socket?.emit("noti:group-created", conversationData);
              }
              handleClose();
            }
          }
        })
        .catch((err) => console.log(err));
    }
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
          width: "27vw",
          height: "25vw",
          bgcolor: "white",
          //   border: "2px solid #000",
          //   boxShadow: 24,
          borderRadius: "5%",
          p: 4,
          color: "black",
          display: "flex",
          flexDirection: "column",
          outline: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            New Conversation
          </Typography>
          <CancelRoundedIcon
            onClick={handleClose}
            sx={{ fill: "#757575", cursor: "pointer" }}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row", gap: "2rem" }}>
          <Option
            handleClick={() => handleClick("private")}
            isSelected={currentTab === "private"}
          >
            Private
          </Option>
          <Option
            handleClick={() => handleClick("group")}
            isSelected={currentTab === "group"}
          >
            Group
          </Option>
        </Box>
        {currentTab === "private" && (
          <Box>
            <Autocomplete
              sx={{ mt: "2rem" }}
              id="private"
              options={users}
              getOptionLabel={(option) =>
                `${option.firstName} ${option.lastName}`
              }
              isOptionEqualToValue={(option: User, value: User) =>
                `${option.firstName} ${option.lastName}` ===
                `${value.firstName} ${value.lastName}`
              }
              renderOption={(props, option: User, state) => (
                <li {...props} key={option.id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Avatar
                      src={option.avatar}
                      sx={{ width: "2rem", height: "2rem" }}
                    ></Avatar>
                    <Box>{`${option.firstName} ${option.lastName}`}</Box>
                  </Box>
                </li>
              )}
              renderTags={(value, getTagProps, ownerState) => {
                return (
                  <>
                    {value.map((option, index) => (
                      <Chip
                        avatar={<Avatar alt="Avatar" src={option.avatar} />}
                        variant="outlined"
                        {...getTagProps({ index })}
                        key={option.id}
                        label={`${option.firstName} ${option.lastName}`}
                      />
                    ))}
                  </>
                );
              }}
              filterSelectedOptions={true}
              renderInput={(params) => <TextField {...params} label="Member" />}
              inputValue={groupUserSearch}
              onInputChange={handleGrUsrSearchChange}
              value={privateUser}
              onChange={(event: any, newValue: User | null) => {
                setPrivateUser(newValue);
              }}
              noOptionsText=""
            />
          </Box>
        )}
        {currentTab === "group" && (
          <Box sx={{ width: "95%", alignSelf: "center" }}>
            <TextField
              id="group-name"
              label="Group name"
              sx={{ width: "100%", mt: "2rem" }}
              value={groupNameInput}
              onChange={handleGroupNameChange}
            />
            <Autocomplete
              sx={{ mt: "2rem" }}
              multiple
              id="tags-outlined"
              options={users}
              getOptionLabel={(option) =>
                `${option.firstName} ${option.lastName}`
              }
              isOptionEqualToValue={(option: User, value: User) =>
                `${option.firstName} ${option.lastName}` ===
                `${value.firstName} ${value.lastName}`
              }
              renderOption={(props, option: User, state) => (
                <li {...props} key={option.id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Avatar
                      src={option.avatar}
                      sx={{ width: "2rem", height: "2rem" }}
                    ></Avatar>
                    <Box>{`${option.firstName} ${option.lastName}`}</Box>
                  </Box>
                </li>
              )}
              renderTags={(value, getTagProps, ownerState) => {
                return (
                  <>
                    {value.map((option, index) => (
                      <Chip
                        avatar={<Avatar alt="Avatar" src={option.avatar} />}
                        variant="outlined"
                        {...getTagProps({ index })}
                        key={option.id}
                        label={`${option.firstName} ${option.lastName}`}
                      />
                    ))}
                  </>
                );
              }}
              filterSelectedOptions={true}
              renderInput={(params) => (
                <TextField {...params} label="Members" />
              )}
              inputValue={groupUserSearch}
              onInputChange={handleGrUsrSearchChange}
              value={groupUsers}
              onChange={(event: any, newValue: User[]) => {
                setGroupUsers(newValue);
              }}
              noOptionsText=""
            />
          </Box>
        )}
        <Box
          sx={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleCreate}
            style={{
              backgroundColor: checkIsValidInput() ? "#3366ff" : "gray",
              color: "white",
              cursor: "pointer",
              border: "none",
              fontSize: "0.9rem",
              padding: "0.8rem 1.9rem",
              borderRadius: "0.5rem",
              marginTop: "auto",
              boxShadow: "0px 8px 16px 0px #3366FF3D",
            }}
          >
            Create
          </button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateConversation;
