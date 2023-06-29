"use client";
import "./globals.css";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/material";
import { Manrope } from "next/font/google";
const manrope = Manrope({ subsets: ["latin"] });

const theme = createTheme({
  typography: {
    fontFamily: "inherit", // Specify the desired font family
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
