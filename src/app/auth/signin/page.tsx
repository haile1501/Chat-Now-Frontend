"use client";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { TEXT_FIELD_HELPER_TEXT } from "@/utils/constant";
import { useState } from "react";
import { SignInBody, signIn } from "@/api";
import validator from "validator";
import { CircularProgress } from "@mui/material";
import { AxiosError, AxiosResponse } from "axios";
import { ERROR_CODE } from "@/utils/constant";
import ResendEmail from "@/components/auth/ResendEmail";
import { useRouter } from "next/navigation";

const UnVerifiedAccount = ({ email }: { email: string }) => {
  return (
    <Box sx={{ p: 3, mt: 2 }}>
      <Typography>
        Your account is not yet activated. We has sent a verification email to{" "}
        <Box component="span" fontWeight="bold">
          {email}
        </Box>
        . Please open it up to activate your account.
      </Typography>
      <ResendEmail email={email} />
    </Box>
  );
};

const SignInForm = ({
  signInBody,
  setSignInBody,
  setIsUnverifiedAccount,
}: {
  signInBody: SignInBody;
  setSignInBody: Function;
  setIsUnverifiedAccount: Function;
}) => {
  const router = useRouter();
  const [isLoginFailed, setIsLoginFailed] = useState<boolean>(false);
  const [isEmptyEmail, setIsEmptyEmail] = useState<boolean>(false);
  const [isEmptyPassword, setIsEmptyPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleInputChange = (event: any) => {
    setSignInBody((prev: SignInBody) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    let isNotOK = false;
    if (validator.isEmpty(signInBody.email)) {
      setIsEmptyEmail(true);
      isNotOK = true;
    } else {
      setIsEmptyEmail(false);
    }

    if (validator.isEmpty(signInBody.password)) {
      setIsEmptyPassword(true);
      isNotOK = true;
    } else {
      setIsEmptyPassword(false);
    }

    if (!isNotOK) {
      signIn(signInBody)
        .then((res: AxiosResponse) => {
          setIsLoading(false);
          router.push("/dashboard");
        })
        .catch((err: AxiosError) => {
          setIsLoginFailed(true);
          setIsLoading(false);
          const errResponse: ErrorResponse = err.response
            ?.data as ErrorResponse;
          if (errResponse.errorCode === ERROR_CODE.WRONG_EMAIL_OR_PASSWORD) {
            setIsLoginFailed(true);
          }

          if (errResponse.errorCode === ERROR_CODE.UNVERIFIED_ACCOUNT) {
            setIsUnverifiedAccount(true);
          }
        });
    } else {
      setIsLoading(false);
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
      {isLoginFailed && (
        <Typography color="red" component="p" textAlign="center">
          Wrong email or password!
        </Typography>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        value={signInBody.email}
        error={isEmptyEmail}
        helperText={isEmptyEmail && TEXT_FIELD_HELPER_TEXT}
        onChange={handleInputChange}
        autoComplete="email"
        autoFocus
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        value={signInBody.password}
        error={isEmptyPassword}
        onChange={handleInputChange}
        helperText={isEmptyPassword && TEXT_FIELD_HELPER_TEXT}
        autoComplete="current-password"
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        {!isLoading && "Sign In"}
        {isLoading && <CircularProgress size={25} sx={{ color: "white" }} />}
      </Button>
      <Grid container>
        <Grid item xs>
          <Link href="/auth/forgot-password" variant="body2">
            Forgot password?
          </Link>
        </Grid>
        <Grid item>
          <Link href="/auth/signup" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default function SignIn() {
  const [signInBody, setSignInBody] = useState<SignInBody>({
    email: "",
    password: "",
  });
  const [isUnverifiedAccount, setIsUnverifiedAccount] =
    useState<boolean>(false);

  return (
    <>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      {!isUnverifiedAccount && (
        <SignInForm
          setIsUnverifiedAccount={setIsUnverifiedAccount}
          signInBody={signInBody}
          setSignInBody={setSignInBody}
        />
      )}
      {isUnverifiedAccount && <UnVerifiedAccount email={signInBody.email} />}
    </>
  );
}
