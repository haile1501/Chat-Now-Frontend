"use client";
import {
  Stepper,
  Step,
  StepLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Link,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { EMAIL_HELPER_TEXT, ERROR_CODE } from "@/utils/constant";
import { TEXT_FIELD_HELPER_TEXT } from "@/utils/constant";
import validator from "validator";
import { SignUpBody, signUp } from "@/api";
import SignUpData from "@/interfaces/SignUpData";
import { AxiosError, AxiosResponse } from "axios";
import ResendEmail from "@/components/auth/ResendEmail";

const PersonalInfo = ({
  setCompleted,
  setUser,
  user,
}: {
  setCompleted: Function;
  setUser: Function;
  user: SignUpData;
}) => {
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isEmptyFirstName, setIsEmptyFirstName] = useState(false);
  const [isEmptyLastName, setIsEmptyLastName] = useState(false);
  const [isEmptyPassword, setIsEmptyPassword] = useState(false);
  const [isUnMatchedPassword, setIsUnMatchedPassword] = useState(false);
  const [emailHelperText, setEmailHelperText] = useState(
    EMAIL_HELPER_TEXT.INVALID_EMAIL
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleDateChange = (value: Dayjs | null) => {
    setUser((prev: SignUpData) => ({
      ...prev,
      dob: value,
    }));
  };

  const handleInputChange = (event: any) => {
    setUser((prev: SignUpData) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    let isNotOK = false;
    if (validator.isEmpty(user.firstName)) {
      isNotOK = true;
      setIsEmptyFirstName(true);
    } else {
      setIsEmptyFirstName(false);
    }

    if (validator.isEmpty(user.lastName)) {
      isNotOK = true;
      setIsEmptyLastName(true);
    } else {
      setIsEmptyLastName(false);
    }

    if (validator.isEmpty(user.email)) {
      isNotOK = true;
      setIsInvalidEmail(true);
      setEmailHelperText(TEXT_FIELD_HELPER_TEXT);
    } else if (!validator.isEmail(user.email)) {
      isNotOK = true;
      setIsInvalidEmail(true);
      setEmailHelperText(EMAIL_HELPER_TEXT.INVALID_EMAIL);
    } else {
      setIsInvalidEmail(false);
    }

    if (validator.isEmpty(user.password)) {
      isNotOK = true;
      setIsEmptyPassword(true);
    } else {
      setIsEmptyPassword(false);
      if (user.password !== user.confirmPassword) {
        isNotOK = true;
        setIsUnMatchedPassword(true);
      } else {
        setIsUnMatchedPassword(false);
      }
    }

    if (!isNotOK) {
      const signUpBody: SignUpBody = {
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        dob: new Date(user.dob.toISOString()),
        email: user.email,
        gender: user.gender,
      };

      signUp(signUpBody)
        .then((res: AxiosResponse) => {
          setCompleted((prev: number) => prev + 1);
          setIsLoading(false);
        })
        .catch((err: AxiosError) => {
          setIsLoading(false);
          const errResponse: ErrorResponse = err.response
            ?.data as ErrorResponse;
          if (errResponse.errorCode === ERROR_CODE.EMAIL_ALREADY_USED) {
            setIsInvalidEmail(true);
            setEmailHelperText(EMAIL_HELPER_TEXT.REGISTERD_EMAIl);
          }
        });
    } else {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Grid container columnSpacing={2} rowSpacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            autoComplete="given-name"
            name="firstName"
            required
            fullWidth
            id="firstName"
            label="First Name"
            value={user.firstName}
            onChange={handleInputChange}
            error={isEmptyFirstName}
            helperText={isEmptyFirstName && TEXT_FIELD_HELPER_TEXT}
            autoFocus
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            id="lastName"
            value={user.lastName}
            label="Last Name"
            name="lastName"
            onChange={handleInputChange}
            error={isEmptyLastName}
            helperText={isEmptyLastName && TEXT_FIELD_HELPER_TEXT}
            autoComplete="family-name"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={isInvalidEmail}
            required
            fullWidth
            id="email"
            label="Email Address"
            value={user.email}
            name="email"
            helperText={isInvalidEmail && emailHelperText}
            onChange={handleInputChange}
            autoComplete="email"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="password"
            value={user.password}
            label="Password"
            type="password"
            id="password"
            onChange={handleInputChange}
            error={isEmptyPassword}
            helperText={isEmptyPassword && TEXT_FIELD_HELPER_TEXT}
            autoComplete="new-password"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            value={user.confirmPassword}
            type="password"
            id="confirmPassword"
            onChange={handleInputChange}
            error={isUnMatchedPassword}
            helperText={isUnMatchedPassword && "Confirm password doesn't match"}
            autoComplete="new-password"
          />
        </Grid>
        <Grid item xs={12} sm={7}>
          <DatePicker
            label="Date of Birth"
            value={user.dob}
            onChange={handleDateChange}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <FormControl fullWidth>
            <InputLabel id="gender-input-label">Gender</InputLabel>
            <Select
              id="gender"
              label="Gender"
              required
              labelId="gender-input-label"
              name="gender"
              onChange={handleInputChange}
              value={user.gender}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {!isLoading && "Sign Up"}
        {isLoading && <CircularProgress size={25} sx={{ color: "white" }} />}
      </Button>
      <Grid container justifyContent="flex-end">
        <Grid item>
          <Link href="signin" variant="body2">
            Already have an account? Sign in
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

const EmailVerification = ({ email }: { email: string }) => {
  return (
    <Box sx={{ p: 3, mt: 2 }}>
      <Typography>
        We will send an email to{" "}
        <Box component="span" fontWeight="bold">
          {email}
        </Box>
        . Please open it up to activate your account.
      </Typography>
      <ResendEmail email={email} />
    </Box>
  );
};

export default function SignUp() {
  const [completed, setCompleted] = useState<number>(0);
  const [user, setUser] = useState<SignUpData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "male",
    dob: dayjs(),
  });
  const steps = ["Enter personal information", "Verify account"];

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      <Stepper activeStep={completed} alternativeLabel sx={{ mt: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {completed === 0 && (
        <PersonalInfo
          setCompleted={setCompleted}
          user={user}
          setUser={setUser}
        />
      )}
      {completed > 0 && <EmailVerification email={user.email} />}
    </LocalizationProvider>
  );
}
