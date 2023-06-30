import axios from "axios";

export async function resetPassword(email: string, newPassword: string) {
  try {
    // Make an HTTP request to the password reset endpoint
    const response = await axios.post("/api/reset-password", {
      email,
      newPassword,
    });

    // Handle the response and return the result
    return response.data;
  } catch (error) {
    // Handle any errors and throw an exception or return an appropriate response
    throw error;
  }
}
