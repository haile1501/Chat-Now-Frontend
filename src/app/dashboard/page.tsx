"use client";
import { ACCESS_TOKEN } from "@/constants/literals";
import { Box, Container, Grid, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import chatnow from "../../../public/chatnow.png";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import CallOutlinedIcon from "@mui/icons-material/CallOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

import { useEffect } from "react";

const DashBoard = () => {
  const router = useRouter();
  // useEffect(() => {
  //   if (localStorage.getItem(ACCESS_TOKEN)) {
  //   } else {
  //     router.push("/auth/signin");
  //   }
  // }, []);

  return (
    <Grid container sx={{ height: "100vh" }}>
      <Grid
        md={0.8}
        sx={{ backgroundColor: "#f0f4fa", borderRight: "1px solid #e4e6ea" }}
        container
        direction="column"
        alignItems="center"
      >
        <Grid
          sx={{
            backgroundImage: `url(${chatnow.src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            width: "5rem",
            height: "4rem",
            mt: "1.5rem",
          }}
        ></Grid>
        <Grid
          container
          direction="column"
          alignItems="center"
          height="25%"
          width="100%"
          mt="35%"
          justifyContent="space-between"
        >
          <Box>
            <SmsOutlinedIcon style={{ fill: "#080707" }} />
          </Box>
          <Box>
            <PeopleAltOutlinedIcon style={{ fill: "#080707" }} />
          </Box>
          <Box>
            <CallOutlinedIcon style={{ fill: "#080707" }} />
          </Box>
          <Box>
            <NotificationsNoneOutlinedIcon style={{ fill: "#080707" }} />
          </Box>
        </Grid>
      </Grid>
      <Grid item md={2.5} sx={{ backgroundColor: "#f8faff" }}></Grid>
      <Grid item md={8.7}></Grid>
    </Grid>
  );
};

export default DashBoard;
