import { ACCESS_TOKEN } from "@/constants/literals";
import { Box, Popover, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditProfile from "./EditProfile";
import { UserInfo } from "@/interfaces/UserInfo";

const optionStyles = {
  cursor: "pointer",
  padding: "0.5rem",
  ":hover": {
    backgroundColor: "#d2d4d9",
  },
};

const Menu = ({
  id,
  openMenu,
  anchorEl,
  handleCloseMenu,
  user,
  setUser,
}: {
  id: any;
  openMenu: boolean;
  anchorEl: any;
  handleCloseMenu: any;
  user: UserInfo | undefined;
  setUser: Function;
}) => {
  const router = useRouter();
  const [openProfile, setOpenProfile] = useState(false);

  const handleOpenProfile = () => setOpenProfile(true);
  const handleCloseProfile = () => setOpenProfile(false);

  const handleSignOut = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    router.push("/auth/signin");
  };

  return (
    <Popover
      id={id}
      open={openMenu}
      anchorEl={anchorEl}
      onClose={handleCloseMenu}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{
        left: "1.25rem",
        bottom: "10rem",
      }}
    >
      <EditProfile
        open={openProfile}
        handleClose={handleCloseProfile}
        user={user}
        setUser={setUser}
      />
      <Box
        sx={{
          color: "black",
          padding: "0.5rem",
          backgroundColor: "white",
        }}
      >
        <Box sx={{ ...optionStyles }} onClick={handleOpenProfile}>
          Profile
        </Box>
        <Box sx={{ ...optionStyles }}>Change password</Box>
        <Box sx={{ ...optionStyles }} onClick={handleSignOut}>
          Sign out
        </Box>
      </Box>
    </Popover>
  );
};

export default Menu;
