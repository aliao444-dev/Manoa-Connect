import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/use-user";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Car, Users } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";

export default function Landing() {
  const { data: user, isLoading } = useUser();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) setLocation("/marketplace");
  }, [user, setLocation]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("auth") === "login" || params.get("auth") === "error") {
      setShowModal(true);
      if (params.get("auth") === "error") setError("Sign-in failed. Please try again.");
    }
  }, []);

  if (isLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-white border-t-transparent animate-spin" />
          <p className="text-white/80 font-medium">Loading Manoa Connect...</p>
        </div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Login failed"); return; }
      await queryClient.invalidateQueries({ queryKey: [api.profile.me.path] });
      setShowModal(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
          firstName: form.get("firstName"),
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Registration failed"); return; }
      await queryClient.invalidateQueries({ queryKey: [api.profile.me.path] });
      setShowModal(false);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <span className="font-display font-bold text-xl text-primary">Manoa Connect</span>
        </div>
        <Button onClick={() => { setError(""); setShowModal(true); }} variant="outline" className="border-primary text-primary hover:bg-primary/5">
          Sign In
        </Button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center pb-20">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary-foreground font-medium text-sm mb-6 border border-secondary/30">
              Exclusive to UH Manoa Students
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold text-primary tracking-tight leading-[1.1] mb-6">
              Your Campus.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">Connected.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The all-in-one super app for UH Manoa. Buy &amp; sell textbooks,
              catch a ride with SWOOP, and connect with your classmates.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button
              size="lg"
              onClick={() => { setError(""); setShowModal(true); }}
              className="w-full sm:w-auto px-8 h-14 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Join Now — It's Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => { setError(""); setShowModal(true); }}
              className="w-full sm:w-auto px-8 h-14 text-lg rounded-full border-primary/30 hover:border-primary/60"
            >
              Sign In
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 text-left"
          >
            <div className="p-6 rounded-3xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">Marketplace</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Buy and sell textbooks, dorm essentials, and more within the trusted UH community.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Car className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">SWOOP Rides</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Need a lift to class or dorms? Catch a ride on golf carts and mopeds around campus.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2">Community</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Connect with verified students. Built on trust with UH Manoa identity verification.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/50">
        <p>© {new Date().getFullYear()} Manoa Connect. Built for students by students.</p>
      </footer>

      {/* Auth Modal */}
      <Dialog open={showModal} onOpenChange={(open) => { setShowModal(open); setError(""); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center gap-2 mb-1">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">M</div>
              <span className="font-bold text-lg text-primary">Manoa Connect</span>
            </div>
            <DialogTitle className="text-center text-base font-normal text-muted-foreground">
              Sign in to access the UH Manoa student hub
            </DialogTitle>
          </DialogHeader>

          {/* SSO Buttons */}
          <div className="flex flex-col gap-3 mt-2">
            <a href="/api/auth/google" className="w-full">
              <Button variant="outline" className="w-full h-11 flex items-center gap-3 text-sm font-medium">
                <GoogleIcon className="w-4 h-4 shrink-0" />
                Continue with Google
              </Button>
            </a>
            <a href="/api/auth/github" className="w-full">
              <Button variant="outline" className="w-full h-11 flex items-center gap-3 text-sm font-medium">
                <GitHubIcon className="w-4 h-4 shrink-0" />
                Continue with GitHub
              </Button>
            </a>
          </div>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or use email</span>
            </div>
          </div>

          {/* Email/Password Tabs */}
          <Tabs defaultValue="login" onValueChange={() => setError("")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-4">
              <form onSubmit={handleLogin} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" name="email" type="email" placeholder="you@hawaii.edu" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" name="password" type="password" required />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Log In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="mt-4">
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-name">First Name</Label>
                  <Input id="reg-name" name="firstName" type="text" placeholder="Your name" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input id="reg-email" name="email" type="email" placeholder="you@hawaii.edu" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input id="reg-password" name="password" type="password" minLength={8} required />
                  <p className="text-xs text-muted-foreground">At least 8 characters</p>
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function GoogleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
