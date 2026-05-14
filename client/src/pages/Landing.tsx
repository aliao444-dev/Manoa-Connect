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
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) setLocation("/marketplace");
  }, [user, setLocation]);

  useEffect(() => {
    if (window.location.search.includes("auth=login")) {
      setShowModal(true);
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
    setLoginError("");
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
      if (!res.ok) { setLoginError(data.message || "Login failed"); return; }
      await queryClient.invalidateQueries({ queryKey: [api.profile.me.path] });
      setShowModal(false);
    } catch {
      setLoginError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setRegisterError("");
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
      if (!res.ok) { setRegisterError(data.message || "Registration failed"); return; }
      await queryClient.invalidateQueries({ queryKey: [api.profile.me.path] });
      setShowModal(false);
    } catch {
      setRegisterError("Something went wrong. Please try again.");
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
        <Button onClick={() => setShowModal(true)} variant="outline" className="border-primary text-primary hover:bg-primary/5">
          Student Login
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
              onClick={() => setShowModal(true)}
              className="w-full sm:w-auto px-8 h-14 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
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

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-primary">Manoa Connect</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="login" className="mt-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Log In</TabsTrigger>
              <TabsTrigger value="register">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" name="email" type="email" placeholder="you@hawaii.edu" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="login-password">Password</Label>
                  <Input id="login-password" name="password" type="password" required />
                </div>
                {loginError && <p className="text-sm text-red-500">{loginError}</p>}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Log In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="mt-4">
              <form onSubmit={handleRegister} className="space-y-4">
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
                {registerError && <p className="text-sm text-red-500">{registerError}</p>}
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
