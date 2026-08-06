import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, Loader2, Sparkles } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import GoogleIcon from "@/components/GoogleIcon";
import SmartImage from "@/components/shared/SmartImage";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const COVER =
  "https://media.base44.com/images/public/6a5745b9539f530d423709d4/e71523aa5_generated_image.png";

export default function AuthModal({ open, onOpenChange }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const reset = () => {
    setError("");
    setPassword("");
    setConfirmPassword("");
    setShowOtp(false);
    setOtpCode("");
  };

  const switchMode = (next) => {
    setMode(next);
    reset();
  };

  const handleGoogle = () => base44.auth.loginWithProvider("google", "/");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) base44.auth.setToken(result.access_token);
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[860px] overflow-hidden p-0 gap-0 border-0">
        <div className="grid md:grid-cols-2">
          {/* Left cover */}
          <div className="relative hidden min-h-[520px] md:block">
            <SmartImage src={COVER} alt="Yogyakarta" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ backgroundColor: "rgba(28,22,19,0.45)" }} />
            <div className="relative flex h-full flex-col justify-end p-8">
              <span className="font-wordmark text-[24px] font-semibold uppercase tracking-[0.08em] text-white">
                Experience Jogja
              </span>
              <p className="mt-2 text-[14px] font-normal text-white/90">
                Where every journey becomes your story.
              </p>
            </div>
          </div>

          {/* Right forms */}
          <div className="p-6 md:p-8" style={{ backgroundColor: "var(--bg-surface)" }}>
            {!showOtp && (
              <div className="mb-6 inline-flex rounded-lg p-1" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
                {[
                  { key: "login", label: "Log In" },
                  { key: "signup", label: "Sign Up" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => switchMode(tab.key)}
                    className="focus-ring rounded-md px-4 py-1.5 text-[14px] font-semibold transition-colors"
                    style={{
                      backgroundColor: mode === tab.key ? "var(--color-primary)" : "transparent",
                      color: mode === tab.key ? "var(--on-primary)" : "var(--text-secondary)",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</div>
            )}

            {showOtp ? (
              <div>
                <h3 className="text-[20px] font-medium" style={{ color: "var(--text-primary)" }}>Verify your email</h3>
                <p className="mt-1 text-[14px]" style={{ color: "var(--text-secondary)" }}>We sent a code to {email}</p>
                <div className="my-6 flex justify-center">
                  <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
                    <InputOTPGroup>
                      {[0, 1, 2, 3, 4, 5].map((i) => <InputOTPSlot key={i} index={i} />)}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button className="h-12 w-full font-medium" onClick={handleVerify} disabled={loading || otpCode.length < 6}>
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Verifying...</> : "Verify"}
                </Button>
                <p className="mt-4 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                  Didn't receive the code?{" "}
                  <button onClick={handleResend} className="font-medium hover:underline" style={{ color: "var(--color-primary)" }}>Resend</button>
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <Alert className="bg-primary/10 text-primary border-primary/20">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <AlertTitle className="font-bold">Demo Mode Active</AlertTitle>
                    <AlertDescription className="text-xs mt-1 opacity-90">
                      The authentication system is currently taking a coffee break! ☕<br/>
                      Feel free to look around, but login and registration are disabled for this preview.
                    </AlertDescription>
                  </Alert>
                </div>

                <Button variant="outline" className="mb-5 h-12 w-full text-sm font-medium" onClick={handleGoogle}>
                  <GoogleIcon className="mr-2 h-5 w-5" />
                  Continue with Google
                </Button>

                <div className="relative mb-5">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="px-3" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}>or</span>
                  </div>
                </div>

                <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="am-email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                      <Input id="am-email" type="email" autoComplete="email" placeholder="you@example.com"
                        value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 pl-10" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="am-password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                      <Input id="am-password" type="password"
                        autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="••••••••"
                        value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 pl-10" required />
                    </div>
                  </div>
                  {mode === "signup" && (
                    <div className="space-y-2">
                      <Label htmlFor="am-confirm">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                        <Input id="am-confirm" type="password" autoComplete="new-password" placeholder="••••••••"
                          value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="h-12 pl-10" required />
                      </div>
                    </div>
                  )}
                  <Button type="submit" className="h-12 w-full font-medium" disabled={loading}>
                    {loading
                      ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{mode === "login" ? "Logging in..." : "Creating account..."}</>
                      : mode === "login" ? "Log in" : "Create account"}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}