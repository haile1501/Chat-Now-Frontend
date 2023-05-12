"use client";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { verifyEmail } from "@/api";
const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    const otp = urlParams.get("otp");
    verifyEmail(email, otp)
      .then((res) => setIsLoading(false))
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <Box>
        {isLoading && <CircularProgress />}
        {!isLoading && (
          <Typography>"Your account was successfully activated"</Typography>
        )}
      </Box>
    </>
  );
};

export default VerifyEmail;
