"use client";
import {
  Avatar,
  Box,
  Grid,
  CssBaseline,
  ThemeProvider,
  createTheme,
  Paper,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import communicate from "../../../public/communicate.jpg";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = createTheme();
  return (
    <>
      <ThemeProvider theme={theme}>
        <Grid container component="main" sx={{ height: "100vh" }}>
          <CssBaseline />
          <Grid
            item
            xs={false}
            sm={4}
            md={6.5}
            sx={{
              backgroundImage: `url(${communicate.src})`,
              backgroundRepeat: "no-repeat",
              backgroundColor: (t) =>
                t.palette.mode === "light"
                  ? t.palette.grey[50]
                  : t.palette.grey[900],
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <Grid
            item
            xs={12}
            sm={8}
            md={5.5}
            component={Paper}
            elevation={6}
            square
          >
            <Box
              sx={{
                my: 8,
                mx: 20,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: "secondary.main", mb: 3 }}>
                <LockOutlinedIcon />
              </Avatar>
              {children}
            </Box>
          </Grid>
        </Grid>
      </ThemeProvider>
    </>
  );
}
