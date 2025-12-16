
export const validateEmail = (email: string): string => {
  if (!email) return "Email is required.";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return "Enter a valid email.";
  return "";
};

export const validatePassword = (password: string): string => {
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  return "";
};
export const validateTitle = (title: string): string => {
  if (!title) return "Title is required.";
  if (title.length < 6) return "Title must be at least 6 characters.";
  return "";
};
export const validateDescription = (title: string): string => {
  if (!title) return "Description is required.";
  if (title.length < 20) return "Description must be at least 20 characters.";
  return "";
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string => {
  if (!confirmPassword) return "Confirm password is required.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return "";
};

export const validateUsername = (username: string): string => {
  if (!username) return "Username is required.";
  const trimmed = username.trim();
  if (trimmed.length < 3) return "Username must be at least 3 characters.";
  if (trimmed.length > 20) return "Username cannot exceed 20 characters.";
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed))
    return "Username can only contain letters, numbers, and underscores.";
  return "";
};

export const validateOtp = (otp: string): string => {
  if (!otp) return "OTP is required.";
  if (!/^\d{6}$/.test(otp)) return "OTP must be a 6-digit code.";
  return "";
};


export const validateChecked = (terms: boolean): string => {
    if (!terms) return "You must accept the terms & conditions";
    return "";
}

interface FormData {
  email?: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
  otp?: string;
  terms?: boolean;
  title?: string;
  description?: string;
}

export const validateForm = (
  type: "login" | "signup" | "otp"| "password" | "createProject",
  data: FormData
) => {
  const errors: Record<string, string> = {};

  if (type === "login") {
    errors.email = validateEmail(data.email || "");
    errors.password = validatePassword(data.password || "");
  }

  if (type === "signup") {
    errors.username = validateUsername(data.username || "");
    errors.email = validateEmail(data.email || "");
    errors.password = validatePassword(data.password || "");
    errors.confirmPassword = validateConfirmPassword(
      data.password || "",
      data.confirmPassword || ""
      );
      errors.terms = validateChecked(data.terms || false)
  }

  if (type === "otp") {
    errors.otp = validateOtp(data.otp || "");
  }
  if (type === "password") {
    errors.password = validatePassword(data.password || "");
    errors.confirmPassword = validateConfirmPassword(
      data.password || "",
      data.confirmPassword || ""
    );
  } if (type === "createProject") {
    errors.email = validateTitle(data.title || "");
    errors.password = validateDescription(data.description || "");
  }

  // Remove empty error messages
  Object.keys(errors).forEach((key) => {
    if (!errors[key]) delete errors[key];
  });

  return errors; // returns {} if everything is valid
};
