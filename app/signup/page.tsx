"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Mail, Lock, User } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { validateForm } from "@/lib/validaion";
import Loader from "@/components/ui/loader";
import FormError from "@/components/ui/formError";
import UserApi from "@/api/user";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({});

     const [loading, setLoading] = useState(false);




const handleSubmit = async () => {
  
 const errors = validateForm("signup",user);

 if (Object.keys(errors).length > 0) {
   setErrors(errors);
   return;
 }

  setLoading(true);
  
  try {
  
   const res = await UserApi.acc.register(user);

   if (res.data.success) {
     toast.success("Account Created Successfully");
     router.push("/login");
   } else {
     toast.error(res.data.message || "Accound Creation Failed");
   }
 } catch (err: any) {
   toast.error(err?.response?.data?.message || "Something went wrong");
 }

 setLoading(false);
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#6720a1]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back to Home */}
        <Link
          href="/"
          className="text-white flex items-center justify-center gap-2 mb-2 p-4 hover:underline"
        >
          ← Back to Home
        </Link>

        {/* Logo Hexagon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-yellow-400 rounded-lg rotate-45"></div>
        </div>

        {/* Welcome Text */}
        <h1 className="text-3xl font-bold text-center text-yellow-400">
          Join the Hive
        </h1>
        <p className="text-center text-purple-200 mb-6">
          Fill in the details to create your Task Hive account
        </p>

        {/* Signup Card */}
        <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-xl rounded-2xl">
          <CardContent className="p-5">
            {/* Full Name */}
            <div className="mb-4">
              <Label className="text-white">Username</Label>
              <div className="relative my-3">
                <User className="absolute left-3 top-3 h-4 w-4 text-purple-200" />
                <Input
                  onChange={(e) => {
                    setUser({ ...user, username: e.target.value });
                    setErrors((prev) => ({ ...prev, username: "" }));
                  }}
                  value={user.username}
                  type="text"
                  placeholder="Your User Name"
                  className="pl-10 bg-white/20 border-white/20 text-white placeholder-purple-200"
                />
                <FormError error={errors.username} />
              </div>
            </div>

            {/* Email */}
            <div className="mb-4">
              <Label className="text-white">Email Address</Label>
              <div className="relative my-3">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-purple-200" />
                <Input
                  onChange={(e) => {
                    setUser({ ...user, email: e.target.value });
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  value={user.email}
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10 bg-white/20 border-white/20 text-white placeholder-purple-200"
                />
                <FormError error={errors.email} />
              </div>
            </div>

            {/* Password */}
            <div className="mb-4">
              <Label className="text-white">Password</Label>
              <div className="relative my-3">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-200" />
                <Input
                  onChange={(e) => {
                    setUser({ ...user, password: e.target.value });
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  value={user.password}
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10 bg-white/20 border-white/20 text-white placeholder-purple-200"
                />
                <FormError error={errors.password} />
              </div>
            </div>

            {/* Confrim Password */}
            <div className="mb-4">
              <Label className="text-white"> Confrim Password</Label>
              <div className="relative my-3">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-purple-200" />
                <Input
                  onChange={(e) => {
                    setUser({ ...user, confirmPassword: e.target.value });
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                  value={user.confirmPassword}
                  type="password"
                  placeholder="Confrim your password"
                  className="pl-10 bg-white/20 border-white/20 text-white placeholder-purple-200"
                />
                <FormError error={errors.confirmPassword} />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="mb-4">
              <div className="flex items-center ">
                <Checkbox
                  checked={user.terms}
                  onCheckedChange={(checked) => {
                    setUser({ ...user, terms: checked === true });
                    setErrors((prev) => ({ ...prev, terms: "" }));
                  }}
                  id="terms"
                  className="border-white/50"
                />

                <Label htmlFor="terms" className="text-white text-sm ml-2">
                  I agree to the{" "}
                  <a href="/terms" className="text-yellow-400 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="/privacy"
                    className="text-yellow-400 hover:underline"
                  >
                    Privacy Policy
                  </a>
                </Label>
              </div>
              <FormError error={errors.terms} />
            </div>

            {/* Signup Button */}
            <Button
              onClick={handleSubmit}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold hover:cursor-pointer transform transition-transform duration-200 hover:scale-105"
            >
              {loading ? <Loader /> : "Create Account"}
            </Button>

            {/* Already have account */}
            <p className="text-center text-white mt-4 text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-yellow-300 font-semibold hover:underline"
              >
                Log In
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
