import { findAllUser } from "@/api/user";
import { ACCESS_TOKEN } from "@/constants/literals";
import { User } from "@/interfaces/User";
import {
  Modal,
  Box,
  Typography,
  Autocomplete,
  Avatar,
  Chip,
  TextField,
} from "@mui/material";
import { useState } from "react";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { Socket } from "socket.io-client";

const AddMember = ({
  open,
  handleClose,
  socket,
  members,
}: {
  open: boolean;
  handleClose: any;
  socket: Socket | undefined;
  members: User[];
}) => {
  const [groupUsers, setGroupUsers] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [groupUserSearch, setGroupUserSearch] = useState("");

  const handleGrUsrSearchChange = (event: any, newInputValue: string) => {
    setGroupUserSearch(newInputValue);

    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (newInputValue.trim() !== "" && accessToken) {
      findAllUser(newInputValue, accessToken)
        .then((usersData) => {
          if (usersData) {
            const usersNotInGroup = usersData.filter(
              (userData) => !members.find((member) => member.id === userData.id)
            );
            setUsers(usersNotInGroup);
          }
        })
        .catch((err) => console.log(err));
    } else if (newInputValue.trim() === "") {
      setUsers([]);
    }
  };

  const checkIsValidInput = () => {
    return groupUsers.length > 0;
  };

  const handleAddUsers = () => {};

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
          <Typography fontWeight="bold" fontSize="2rem">
            Add new members
          </Typography>
          <CancelRoundedIcon
            onClick={handleClose}
            sx={{ fill: "#757575", cursor: "pointer" }}
          />
        </Box>
        <Box sx={{ width: "95%", alignSelf: "center" }}>
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
            renderInput={(params) => <TextField {...params} label="Members" />}
            inputValue={groupUserSearch}
            onInputChange={handleGrUsrSearchChange}
            value={groupUsers}
            onChange={(event: any, newValue: User[]) => {
              setGroupUsers(newValue);
            }}
            noOptionsText=""
          />
        </Box>
        <Box
          sx={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleAddUsers}
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
            Add
          </button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddMember;
