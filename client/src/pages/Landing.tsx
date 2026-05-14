import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Car, Users } from "lucide-react";

export default function Landing() {
  const { data: user, isLoading } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) setLocation("/marketplace");
  }, [user, setLocation]);

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

  const handleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <span className="font-display font-bold text-xl text-primary">Manoa Connect</span>
        </div>
        <Button onClick={handleLogin} variant="outline" className="border-primary text-primary hover:bg-primary/5 flex items-center gap-2">
          <GoogleIcon />
          Sign in with Google
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
              onClick={handleLogin}
              className="w-full sm:w-auto px-8 h-14 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3"
            >
              <GoogleIcon className="w-5 h-5" />
              Continue with Google
              <ArrowRight className="w-5 h-5" />
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
