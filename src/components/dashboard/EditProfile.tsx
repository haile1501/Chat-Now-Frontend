import {
  Modal,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextareaAutosize,
} from "@mui/material";
import { useState } from "react";
import UserAvatar from "@/components/UserAvatar";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { UserInfo } from "@/interfaces/UserInfo";
import AddAPhotoRoundedIcon from "@mui/icons-material/AddAPhotoRounded";
import { ACCESS_TOKEN } from "@/constants/literals";
import { updateUserProfile, uploadFile } from "@/api";

const EditProfile = ({
  open,
  handleClose,
  user,
  setUser,
}: {
  open: boolean;
  user: UserInfo | undefined;
  handleClose: any;
  setUser: Function;
}) => {
  const [updateData, setUpdateData] = useState({
    avatar: user?.avatar,
    firstName: user?.firstName,
    lastName: user?.lastName,
    gender: user?.gender,
    dob: dayjs(user?.dob),
    about: user?.about,
  });
  const handleDateChange = (value: Dayjs | null) => {
    setUpdateData((prev: any) => ({
      ...prev,
      dob: value,
    }));
  };

  const handleInputChange = (event: any) => {
    setUpdateData((prev: any) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleUpdate = () => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      updateUserProfile(accessToken, updateData)
        .then((userProfile) => {
          setUser(userProfile);
          handleClose();
        })
        .catch((err) => console.log(err));
    }
  };

  const handleUploadImage = () => {
    document.getElementById("profile-image-input")?.click();
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken && file) {
      uploadFile(accessToken, file)
        .then((url: any) => {
          const newData = { ...updateData, avatar: url };

          setUpdateData(newData);
        })
        .catch((err) => console.log(err));
    }
  };

  const checkIsValidInput = () => {
    return true;
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "40vw",
            height: "27vw",
            bgcolor: "white",
            //   border: "2px solid #000",
            //   boxShadow: 24,
            borderRadius: "2rem",
            p: 5,
            color: "black",
            outline: "none",
          }}
        >
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: "bold",
              mb: "2rem",
              ml: "1rem",
            }}
          >
            Update Profile
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
            }}
          >
            <Box sx={{ width: "40%" }}>
              <UserAvatar
                src={updateData.avatar}
                styles={{ width: "10vw", height: "10vw", m: "auto" }}
              />
              <AddAPhotoRoundedIcon
                sx={{ cursor: "pointer", ml: "auto" }}
                onClick={handleUploadImage}
              />
              <input
                type="file"
                id="profile-image-input"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "50%",
                flexDirection: "column",
                gap: "1.5rem",
                pr: "5%",
              }}
            >
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={updateData.firstName}
                  onChange={handleInputChange}
                  autoFocus
                  sx={{ width: "50%" }}
                />
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  value={updateData.lastName}
                  label="Last Name"
                  name="lastName"
                  onChange={handleInputChange}
                  autoComplete="family-name"
                  sx={{ width: "50%" }}
                />
              </Box>
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <DatePicker
                  label="Date of Birth"
                  value={updateData.dob}
                  onChange={handleDateChange}
                  sx={{ width: "60%" }}
                />
                <FormControl fullWidth sx={{ width: "40%" }}>
                  <InputLabel id="gender-input-label">Gender</InputLabel>
                  <Select
                    id="gender"
                    label="Gender"
                    required
                    labelId="gender-input-label"
                    name="gender"
                    onChange={handleInputChange}
                    value={updateData.gender}
                  >
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TextareaAutosize
                name="about"
                placeholder="About"
                style={{
                  width: "100%",
                  height: "30%",
                  backgroundColor: "white",
                  outline: "none",
                }}
                value={updateData.about}
                onChange={handleInputChange}
              />
              <button
                onClick={handleUpdate}
                style={{
                  backgroundColor: checkIsValidInput() ? "#3366ff" : "gray",
                  color: "white",
                  cursor: "pointer",
                  border: "none",
                  fontSize: "0.9rem",
                  padding: "0.8rem 1.9rem",
                  borderRadius: "0.5rem",
                  marginLeft: "auto",
                  boxShadow: "0px 8px 16px 0px #3366FF3D",
                }}
              >
                Save
              </button>
            </Box>
          </Box>
        </Box>
      </LocalizationProvider>
    </Modal>
  );
};

export default EditProfile;
