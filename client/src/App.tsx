import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Navigation } from "@/components/Navigation";
import { useUser } from "@/hooks/use-user";

// Pages
import Landing from "@/pages/Landing";
import Marketplace from "@/pages/Marketplace";
import Swoop from "@/pages/Swoop";
import Profile from "@/pages/Profile";
import Messages from "@/pages/Messages";
import WallArt from "@/pages/WallArt";
import Scholarships from "@/pages/Scholarships";

function Router() {
  const { data: user, isLoading } = useUser();
  const [location] = useLocation();

  // If loading user state, show nothing (or a global loader)
  if (isLoading) return null;

  // Public Routes
  if (!user) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        {/* Redirect all other routes to Landing if not logged in */}
        <Route component={Landing} />
      </Switch>
    );
  }

  // Protected Routes
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation />
      <main>
        <Switch>
          <Route path="/" component={() => { window.location.href = "/marketplace"; return null; }} />
          <Route path="/marketplace" component={Marketplace} />
          <Route path="/swoop" component={Swoop} />
          <Route path="/wall-art" component={WallArt} />
          <Route path="/scholarships" component={Scholarships} />
          <Route path="/profile" component={Profile} />
          <Route path="/messages" component={Messages} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
