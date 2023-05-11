import { Dayjs } from "dayjs";

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: "male" | "female" | "other";
  dob: Dayjs;
}

export default SignUpData;
