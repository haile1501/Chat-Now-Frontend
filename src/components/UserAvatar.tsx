import { Avatar } from "@mui/material";
import defaultAvatar from "../../public/user.png";

const UserAvatar = ({
  src,
  styles,
}: {
  src: string | undefined | null;
  styles?: any | undefined;
}) => {
  return (
    <Avatar
      src={src || defaultAvatar.src}
      sx={styles && { ...styles }}
    ></Avatar>
  );
};

export default UserAvatar;
