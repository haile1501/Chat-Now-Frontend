"use client";
import { Typography, Box, Grid, Link } from "@mui/material";
import { useState, useEffect } from "react";

const ResendEmail = ({ email }: { email: string }) => {
  const [seconds, setSeconds] = useState(60);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleClick = () => {
    if (!isButtonDisabled) {
      setIsButtonDisabled(true);
    }
  };

  useEffect(() => {
    if (seconds > 0 && isButtonDisabled) {
      const timer = setTimeout(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else {
      setSeconds(60);
      setIsButtonDisabled(false);
    }
  }, [seconds, isButtonDisabled]);

  return (
    <>
      <Typography sx={{ mt: 1.5 }}>
        Did not receive the email?{" "}
        <Box
          component="span"
          fontWeight="bold"
          color={isButtonDisabled ? "gray" : "#1976d2"}
          sx={{ cursor: "pointer" }}
          onClick={handleClick}
        >
          Click here to resend{" "}
          <Box
            component="span"
            visibility={isButtonDisabled ? "visible" : "hidden"}
          >
            ({seconds})
          </Box>
        </Box>
      </Typography>
      <Grid container justifyContent="flex-end" mt={3}>
        <Grid item>
          <Link href="signin" variant="body2">
            Go to Sign In page
          </Link>
        </Grid>
      </Grid>
    </>
  );
};

export default ResendEmail;
