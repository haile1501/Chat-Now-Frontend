import { getUserProfile } from "@/api";
import UserAvatar from "@/components/UserAvatar";
import { ACCESS_TOKEN } from "@/constants/literals";
import { IConversation } from "@/interfaces/Conversation";
import { RELATIONSHIP } from "@/utils/constant";
import { Box, Typography } from "@mui/material";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import HowToRegRoundedIcon from "@mui/icons-material/HowToRegRounded";
import { UserInfo } from "@/interfaces/UserInfo";

const headerStyles = {
  height: "7.16%",
  borderBottom: "1px solid #d6dbe1",
  borderLeft: "1px solid #d6dbe1",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const commonTextStyles = {
  color: "black",
};

const titleStyles = {
  fontWeight: "bold",
  fontSize: "1.3rem",
};

const Hr = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#d6dbe1",
        width: "90%",
        height: "2px",
        m: "auto",
      }}
    ></Box>
  );
};

const PrivateUserInfo = ({
  conversation,
  socket,
}: {
  conversation: IConversation;
  socket: Socket | undefined;
}) => {
  const [user, setUser] = useState<UserInfo | undefined>();

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken && conversation.privateUserId) {
      getUserProfile(accessToken, conversation.privateUserId)
        .then((userData) => setUser(userData))
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <Box sx={{ width: "24vw", height: "100vh", backgroundColor: "#f8faff" }}>
      <Box
        sx={{
          ...headerStyles,
        }}
      >
        <Typography sx={{ ...titleStyles, ...commonTextStyles }}>
          User Information
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.5rem",
          pt: "1.5rem",
          pb: "2rem",
        }}
      >
        <UserAvatar
          src={user?.avatar}
          styles={{ height: "3.5rem", width: "3.5rem" }}
        ></UserAvatar>
        <Typography
          sx={{
            ...commonTextStyles,
            fontWeight: "bold",
            fontSize: "1.25rem",
            mt: "0.75rem",
          }}
        >{`${user?.firstName} ${user?.lastName}`}</Typography>
        <Box
          sx={{
            backgroundColor:
              user?.status === RELATIONSHIP.FRIEND ? "#e4e6eb" : "#1b74e4",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            padding: "0.4rem 0.7rem",
            gap: "0.3rem",
            borderRadius: "0.5rem",
          }}
        >
          {user?.status === RELATIONSHIP.FRIEND ? (
            <HowToRegRoundedIcon
              style={{
                fill: user?.status === RELATIONSHIP.FRIEND ? "black" : "white",
                fontSize: "1.15rem",
              }}
            />
          ) : (
            <PersonAddAltRoundedIcon
              style={{
                fill: user?.status === RELATIONSHIP.FRIEND ? "black" : "white",
                fontSize: "1.15rem",
              }}
            />
          )}
          <Typography
            sx={{
              color: user?.status === RELATIONSHIP.FRIEND ? "black" : "white",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            {user?.status === RELATIONSHIP.FRIEND ? "Friend" : "Add friend"}
          </Typography>
        </Box>
      </Box>
      <Hr />
      <Box
        sx={{
          ...commonTextStyles,
          p: "1rem 2.25rem",
          pb: "2.75rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <Box>
          <Typography
            sx={{ display: "inline-block", width: "40%", color: "gray" }}
          >
            Email
          </Typography>
          <Typography sx={{ display: "inline-block", width: "40%" }}>
            {user?.email}
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{ display: "inline-block", width: "40%", color: "gray" }}
          >
            Gender
          </Typography>
          <Typography sx={{ display: "inline-block", width: "40%" }}>
            {user?.gender}
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{ display: "inline-block", width: "40%", color: "gray" }}
          >
            DoB
          </Typography>
          <Typography sx={{ display: "inline-block", width: "40%" }}>
            {user && format(new Date(user.dob), "dd/MM/yyyy")}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ color: "gray" }}>About</Typography>
          <Typography sx={{ mt: "0.75rem" }}>{user?.about}</Typography>
        </Box>
      </Box>
      <Hr />
    </Box>
  );
};

export default PrivateUserInfo;
