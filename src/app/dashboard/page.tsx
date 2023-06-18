"use client";
import { ACCESS_TOKEN } from "@/constants/literals";
import { useRouter } from "next/navigation";

import { useEffect } from "react";

const DashBoard = () => {
  const router = useRouter();
  useEffect(() => {
    if (localStorage.getItem(ACCESS_TOKEN)) {
    } else {
      router.push("/auth/signin");
    }
  }, []);

  return <div>DashBoard</div>;
};

export default DashBoard;
