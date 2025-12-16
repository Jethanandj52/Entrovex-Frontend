 "use client";

import { useEffect, useState } from "react";
import axios from "axios";
import User from "@/api/user";

export default function useUserData() {
  const [user, setUser] = useState<any>(null);
  const [token, settoken] = useState<any>(null)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const meRes = await axios.get("/api/me");
        
        const token = meRes.data?.token
        if (!meRes.data?.decoded?.id) {
          setUser(null);
          settoken(null)
          return;
        }
        
          const res = await User.acc.getUser(meRes.data?.decoded?.id);
        const fullUser = res.data.user
        
        setUser(fullUser);
        settoken(token)
      } catch (err) {
        console.error("Failed to load user", err);
        setUser(null);
        settoken(null);
      } 
    };

    fetchUser();
  }, []);

  return {user , token}
}
