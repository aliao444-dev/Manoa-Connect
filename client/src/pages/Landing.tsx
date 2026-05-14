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
    window.location.href = "/api/auth/github";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">M</div>
          <span className="font-display font-bold text-xl text-primary">Manoa Connect</span>
        </div>
        <Button onClick={handleLogin} variant="outline" className="border-primary text-primary hover:bg-primary/5 flex items-center gap-2">
          <GitHubIcon className="w-4 h-4" />
          Sign in with GitHub
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
              <GitHubIcon className="w-5 h-5" />
              Continue with GitHub
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

function GitHubIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}
