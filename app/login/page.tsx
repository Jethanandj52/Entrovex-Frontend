"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { validateForm } from "@/lib/validaion";
import Loader from "@/components/ui/loader";
import FormError from "@/components/ui/formError";
import UserApi from "@/api/user";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie"

export default function LoginPage() {
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const errors = validateForm("login", user);
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await UserApi.acc.login(user)

      if (res.data.success) {
        toast.success("Login Successful!");
        // Store token in cookies
        Cookies.set("token", res.data.token, {
          expires: user.remember ? 7 : undefined, // 7 days if remember me checked
        });
        router.push("/dashboard"); // redirect after login
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err: any) {
      console.log(err);
      
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
        <Link
          href="/"
          className="text-white flex items-center justify-center gap-2 mb-6 hover:underline"
        >
          ← Back to Home
        </Link>

        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 bg-yellow-400 rounded-lg rotate-45"></div>
        </div>

        <h1 className="text-3xl font-bold text-center text-yellow-400">
          Welcome Back
        </h1>
        <p className="text-center text-purple-200 mb-6">
          Log in to your Task Hive account
        </p>

        <Card className="backdrop-blur-md bg-white/10 border-white/20 shadow-xl rounded-2xl">
          <CardContent className="p-6">
            {/* Email */}
            <div className="mb-4">
              <Label className="text-white">Email Address</Label>
              <div className="relative my-3">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-purple-200" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={user.email}
                  onChange={(e) => {
                    setUser({ ...user, email: e.target.value });
                    setErrors((prev) => ({ ...prev, email: "" }));
                  }}
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
                  type="password"
                  placeholder="Enter your password"
                  value={user.password}
                  onChange={(e) => {
                    setUser({ ...user, password: e.target.value });
                    setErrors((prev) => ({ ...prev, password: "" }));
                  }}
                  className="pl-10 bg-white/20 border-white/20 text-white placeholder-purple-200"
                />
                <FormError error={errors.password} />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={user.remember}
                  onCheckedChange={(checked) =>
                    setUser({ ...user, remember: checked === true })
                  }
                  id="remember"
                  className="border-white/50"
                />
                <Label htmlFor="remember" className="text-white text-sm">
                  Remember me
                </Label>
              </div>
              <Link
                href="/forgot-password"
                className="text-yellow-300 text-sm hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleSubmit}
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold hover:cursor-pointer transform transition-transform duration-200 hover:scale-105"
            >
              {loading ? <Loader /> : "Log In"}
            </Button>

            {/* Signup Link */}
            <p className="text-center text-white mt-4 text-sm">
              Don’t have an account?{" "}
              <Link
                href="/signup"
                className="text-yellow-300 font-semibold hover:underline"
              >
                Create Account
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
