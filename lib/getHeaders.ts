import useUserData from "./auth";

export const getAuthHeaders = () => {
    const { token } = useUserData()
    
    console.log(token);
    
  return {
    Authorization: `Bearer ${token}`, // <-- you will replace this
    "Content-Type": "application/json",
  };
};
