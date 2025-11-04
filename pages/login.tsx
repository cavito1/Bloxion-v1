"use client";

import { NextPage } from "next";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import React, { useEffect, useState, useRef } from "react";
import { useRecoilState } from "recoil";
import { loginState } from "@/state";
import Button from "@/components/button";
import Router from "next/router";
import axios from "axios";
import Input from "@/components/input";
import Link from "next/link";
import { useTheme } from "next-themes";
import ThemeToggle from "@/components/ThemeToggle";
import { Dialog } from "@headlessui/react";
import { IconX } from "@tabler/icons-react";
import { OAuthAvailable } from "@/hooks/useOAuth";

type LoginForm = { username: string; password: string };
type SignupForm = { username: string; password: string; verifypassword: string };

const Login: NextPage = () => {
  const [login, setLogin] = useRecoilState(loginState);
  const { isAvailable: isOAuth } = OAuthAvailable();

  const loginMethods = useForm<LoginForm>();
  const signupMethods = useForm<SignupForm>();

  const { register: regLogin, handleSubmit: submitLogin, setError: setErrLogin } = loginMethods;
  const {
    register: regSignup,
    handleSubmit: submitSignup,
    setError: setErrSignup,
    getValues: getSignupValues,
  } = signupMethods;

  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [signupStep, setSignupStep] = useState<0 | 1 | 2>(0);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationError, setVerificationError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCopyright, setShowCopyright] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  // ✨ Background gradient animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const colors = ["#ff0099", "#b900ff", "#005cff", "#00d8ff"];
    let angle = 0;
    const animate = () => {
      const { innerWidth: w, innerHeight: h } = window;
      canvas.width = w;
      canvas.height = h;
      angle += 0.002;
      const x = Math.cos(angle) * w;
      const y = Math.sin(angle) * h;
      const grad = ctx.createLinearGradient(0, 0, x, y);
      colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  // Reset form states when switching modes
  useEffect(() => {
    loginMethods.reset();
    signupMethods.reset();
    setVerificationError(false);
    setLoading(false);
  }, [mode]);

  // Login logic
  const onSubmitLogin: SubmitHandler<LoginForm> = async (data) => {
    setLoading(true);
    try {
      const req = await axios.post("/api/auth/login", data);
      const { data: res } = req;
      setLogin({ ...res.user, workspaces: res.workspaces });
      Router.push("/");
    } catch (e: any) {
      const status = e.response?.status;
      const msg = e.response?.data?.error || "Something went wrong";
      if (status === 404 || status === 401) {
        setErrLogin("username", { type: "custom", message: msg });
        if (status === 401) setErrLogin("password", { type: "custom", message: msg });
      } else {
        setErrLogin("username", { type: "custom", message: msg });
        setErrLogin("password", { type: "custom", message: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  // Signup step 1
  const onSubmitSignup: SubmitHandler<SignupForm> = async ({ username, password, verifypassword }) => {
    if (password !== verifypassword) {
      setErrSignup("verifypassword", { type: "validate", message: "Passwords must match" });
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/signup/start", { username });
      setVerificationCode(data.code);
      setSignupStep(2);
    } catch (e: any) {
      setErrSignup("username", {
        type: "custom",
        message: e.response?.data?.error || "Unexpected error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Verification logic
  const onVerifyAgain = async () => {
    setLoading(true);
    const { password } = getSignupValues();
    try {
      const { data } = await axios.post("/api/auth/signup/finish", { password, code: verificationCode });
      if (data.success) Router.push("/");
      else setVerificationError(true);
    } catch {
      setVerificationError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Animated background */}
      <canvas ref={canvasRef} className="fixed inset-0 w-full h-full z-0 opacity-70" />

      <div className="relative z-10 flex items-center justify-center h-screen px-4">
        <div className="bg-white border border-zinc-200 max-w-md w-full rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          {/* Theme toggle */}
          <div className="absolute top-4 right-4">
            <ThemeToggle />
          </div>

          {/* Tabs */}
          <div className="mb-6 flex justify-center space-x-10">
            {["login", "signup"].map((m) => {
              const isActive = mode === m;
              const gradient = "bg-gradient-to-r from-[#ff0099] to-[#b900ff]";
              return (
                <button
                  key={m}
                  onClick={() => setMode(m as any)}
                  type="button"
                  className={`relative pb-2 text-lg font-semibold transition-all duration-300 ${
                    isActive
                      ? `text-transparent bg-clip-text ${gradient}`
                      : "text-zinc-500 hover:text-zinc-700"
                  }`}
                >
                  {m === "login" ? "Login" : "Sign Up"}
                  {isActive && (
                    <span className={`absolute left-0 bottom-0 w-full h-[2px] rounded-full ${gradient}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* LOGIN */}
          {mode === "login" && (
            <>
              <h1 className="font-bold text-3xl text-zinc-900 mb-2">
                👋 Welcome to <span className="gradient-text">Orbit</span>
              </h1>
              <p className="text-md text-zinc-600 mb-6">
                Login to your Orbit account to continue
              </p>

              <FormProvider {...loginMethods}>
                <form onSubmit={submitLogin(onSubmitLogin)} className="space-y-5 mb-6" noValidate>
                  <Input label="Username" placeholder="Username" id="username" {...regLogin("username", { required: "Required" })} />
                  <Input
                    label="Password"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    id="password"
                    {...regLogin("password", { required: "Required" })}
                  />
                  <div className="flex items-center mb-2">
                    <input
                      id="show-password"
                      type="checkbox"
                      checked={showPassword}
                      onChange={() => setShowPassword((v) => !v)}
                      className="mr-2 accent-[#ff0099] rounded-md"
                    />
                    <label htmlFor="show-password" className="text-sm text-zinc-600 select-none">
                      Show password
                    </label>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link href="/forgot-password" className="text-sm text-[#ff0099] hover:underline">
                      Forgot password?
                    </Link>
                    <Button
                      type="submit"
                      classoverride="px-6 py-2 text-sm rounded-lg bg-gradient-to-r from-[#ff0099] to-[#b900ff] text-white hover:brightness-110"
                      loading={loading}
                      disabled={loading}
                    >
                      Login
                    </Button>
                  </div>

                  {isOAuth && (
                    <div className="mt-6 text-center">
                      <div className="flex items-center mb-4">
                        <div className="w-full border-t border-zinc-300"></div>
                        <span className="px-3 text-xs text-zinc-500">or</span>
                        <div className="w-full border-t border-zinc-300"></div>
                      </div>
                      <button
                        type="button"
                        onClick={() => (window.location.href = "/api/auth/roblox/start")}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-zinc-300 bg-white text-sm font-medium text-zinc-800 hover:bg-zinc-50 transition-all"
                      >
                        <img src="/roblox.svg" alt="Roblox" className="w-5 h-5" />
                        Continue with Roblox
                      </button>
                    </div>
                  )}
                </form>
              </FormProvider>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;