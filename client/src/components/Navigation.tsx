import { Link, useLocation } from "wouter";
import { useUser } from "@/hooks/use-user";
import { ShoppingBag, Car, MessageCircle, User, LogOut, Palette, GraduationCap } from "lucide-react";
import { Button } from "./ui/button";

export function Navigation() {
  const [location] = useLocation();
  const { data: user } = useUser();

  const isActive = (path: string) => location === path;
  
  const navItems = [
    { href: "/marketplace", icon: ShoppingBag, label: "Market" },
    { href: "/swoop", icon: Car, label: "SWOOP" },
    { href: "/wall-art", icon: Palette, label: "Wall Art" },
    { href: "/scholarships", icon: GraduationCap, label: "Scholarships" },
    { href: "/messages", icon: MessageCircle, label: "Messages" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  if (!user) return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-primary text-primary-foreground p-6 shadow-xl z-50">
        <Link href="/" data-testid="link-logo-home">
          <div className="flex items-center gap-3 mb-12 cursor-pointer group">
            <div className="w-12 h-12 bg-gradient-to-br from-white to-emerald-100 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
               <span className="text-primary font-black text-2xl">M</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-xl tracking-tight leading-tight">MANOA</h1>
              <p className="text-xs text-primary-foreground/70 font-medium tracking-widest">CONNECT</p>
            </div>
          </div>
        </Link>

        <div className="space-y-2 flex-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className={`
                flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                ${isActive(item.href) 
                  ? "bg-white/10 text-white font-medium translate-x-1" 
                  : "text-primary-foreground/70"
                }
              `}>
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4 px-2">
             <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center overflow-hidden">
               <User className="w-4 h-4 text-white" />
             </div>
             <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{user.displayName || "Student"}</p>
                <p className="text-xs text-primary-foreground/50 truncate">UH Manoa</p>
             </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-primary-foreground/70"
            onClick={() => window.location.href = "/api/logout"}
            data-testid="button-nav-sign-out"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-border shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50 pb-safe">
        <div className="flex justify-around items-center p-3">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} data-testid={`link-mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className={`
                flex flex-col items-center gap-1 p-2 rounded-lg transition-colors
                ${isActive(item.href) ? "text-primary" : "text-muted-foreground"}
              `}>
                <item.icon className={`w-6 h-6 ${isActive(item.href) ? "fill-current/10" : ""}`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
