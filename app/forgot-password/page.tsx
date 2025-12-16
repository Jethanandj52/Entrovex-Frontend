"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import user from "@/api/user";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { validateEmail, validateForm, validateOtp } from "@/lib/validaion";
import FormError from "@/components/ui/formError";
import Loader from "@/components/ui/loader";

export default function ResetPasswordPage() {

  const router = useRouter();
  const [currPage, setCurrPage] = useState("sendOTP")
  const [email , setEmail] = useState("")
  const [OTP, setOTP] = useState("")
  const [password, setpassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [errors, setErrors] = useState<Record<string, string>>({});



   const [loading, setLoading] = useState(false);
const OTPsend = async () => {

 const emailError = validateEmail(email);

 if (emailError) {
   setErrors({ ...errors, email: emailError });
   return;
 }


  setLoading(true)
  try {
    const res = await user.forgetPassword.sendOTP({ email });

    if (res.data.success) {
      toast.success("OTP sent successfully!");
      setCurrPage("OTPverification");
    } else {
      toast.error(res.data.message || "Failed to send OTP");
    }
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Something went wrong");
  }

  setLoading(false)
};

  
  const verifyOTP = async () => {
   const OTPError = validateOtp(OTP);
   if (OTPError) {
     setErrors({ ...errors, OTP: OTPError });
     return;
   }


  setLoading(true)
    try {
      const res = await user.forgetPassword.verifyOTP({ email, otp: OTP });

      if (res.data.success) {
        toast.success("OTP verified!");
        setCurrPage("ChangePassword");
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid OTP");
    }
    setLoading(false)
  };

  const resetPassword = async () => {
    
     const passError = validateForm("password", {password,confirmPassword});

  if (Object.keys(passError).length > 0) {
    setErrors({ ...errors, ...passError });
    return;
  }

    setLoading(true)
    try {
      const res = await user.forgetPassword.changePass({
        email,
        newPassword: password,
        confirmPassword,
      });

      if (res.data.success) {
        toast.success("Password updated successfully!");
        router.push("/login")

      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
    setLoading(false)
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#6720a1]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back to Login */}
        <Link
          href="/login"
          className="text-white flex items-center justify-center gap-2 mb-6 hover:underline"
        >
          ← Back to Login
        </Link>

        {/* Logo Hexagon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-yellow-400 rounded-lg rotate-45"></div>
        </div>

        <h1 className="text-3xl font-bold text-center text-yellow-400">
          Reset Password
        </h1>
        <p className="text-center text-purple-200 mb-6">
          Enter your new password and confirm it
        </p>

        <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-xl rounded-2xl">
          <CardContent className="p-6">
            {currPage === "sendOTP" ? (
              <>
                {/* email */}
                <div className="mb-4">
                  <Label className="text-white">Email Address</Label>
                  <div className="relative my-3">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-purple-200" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((prev) => ({ ...prev, email: "" }));
                      }}
                      placeholder="you@example.com"
                      className="pl-10 bg-white/20 border-white/20 text-white placeholder-purple-200"
                    />
                    <FormError error={errors.email} />
                  </div>
                </div>

                <Button
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold hover:cursor-pointer transform transition-transform duration-200 hover:scale-105"
                  onClick={OTPsend}
                >
                  {loading ? <Loader /> : "send OTP"}
                </Button>
              </>
            ) : currPage === "OTPverification" ? (
              <>
                <div className="mb-4">
                  <Label className="text-white">Enter OTP</Label>
                  <div className="relative my-3">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-200" />
                    <Input
                      value={OTP}
                      onChange={(e) => {
                        setOTP(e.target.value);
                        setErrors((prev) => ({ ...prev, OTP: "" }));
                      }}
                      placeholder="Enter your OTP"
                      className="pl-10 bg-white/20 border-white/20 text-white placeholder-purple-200"
                    />
                    <FormError error={errors.OTP} />
                  </div>
                </div>

                <Button
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold hover:cursor-pointer transform transition-transform duration-200 hover:scale-105"
                  onClick={verifyOTP}
                >
                  {loading ? <Loader /> : "Verify OTP"}
                </Button>
              </>
            ) : (
              <>
                {/* New Password */}
                <div className="mb-4">
                  <Label className="text-white">New Password</Label>
                  <div className="relative my-3">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-200" />
                    <Input
                      value={password}
                      onChange={(e) => {
                        setpassword(e.target.value);
                        setErrors((prev) => ({ ...prev, password: "" }));
                      }}
                      type="password"
                      placeholder="Enter new password"
                      className="pl-10 bg-white/20 border-white/20 text-white placeholder-purple-200"
                    />
                    <FormError error={errors.password} />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <Label className="text-white">Confirm Password</Label>
                  <div className="relative my-3">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-200" />
                    <Input
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                      }}
                      type="password"
                      placeholder="Confirm new password"
                      className="pl-10 bg-white/20 border-white/20 text-white placeholder-purple-200"
                    />
                    <FormError error={errors.confirmPassword} />
                  </div>
                </div>

                <Button
                  onClick={resetPassword}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold hover:cursor-pointer transform transition-transform duration-200 hover:scale-105"
                >
                  {loading ? <Loader /> : "Reset Password"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
