"use client";
import React, { useState } from "react";
import { resetPassword } from "@/api/resetPassword"; // Import the API function for resetting the password

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [resetStatus, setResetStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const handleResetPassword = async () => {
  try {
    // Call the API function to reset the password
    const response = await resetPassword(email, newPassword);

    // Handle the response and update the resetStatus accordingly
    if (response.success) {
      setResetStatus("Password reset successful!");
    } else {
      setResetStatus("Password reset failed. Please try again.");
    }
  } catch (error) {
    console.log(error);
    setResetStatus("An error occurred. Please try again later.");
  }
};

return (
  <div>
    <h2>Password Reset</h2>
    <div>
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
    </div>
    <div>
      <label>New Password:</label>
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
    </div>
    <button onClick={handleResetPassword}>Reset Password</button>
    {resetStatus && <p>{resetStatus}</p>}
  </div>
);
};

export default ForgotPasswordPage;
