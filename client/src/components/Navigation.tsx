import { Link, useLocation } from "wouter";
import { useUser } from "@/hooks/use-user";
import { Home, ShoppingBag, Car, MessageCircle, User, LogOut } from "lucide-react";
import { Button } from "./ui/button";

export function Navigation() {
  const [location] = useLocation();
  const { data: user } = useUser();

  const isActive = (path: string) => location === path;
  
  const navItems = [
    { href: "/marketplace", icon: ShoppingBag, label: "Market" },
    { href: "/swoop", icon: Car, label: "SWOOP" },
    { href: "/messages", icon: MessageCircle, label: "Messages" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  if (!user) return null;

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-primary text-primary-foreground p-6 shadow-xl z-50">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
             {/* Logo placeholder */}
             <span className="text-primary font-bold text-xl">M</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl tracking-tight">Manoa<br/>Connect</h1>
          </div>
        </div>

        <div className="space-y-2 flex-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={`
                flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                ${isActive(item.href) 
                  ? "bg-white/10 text-white font-medium translate-x-1" 
                  : "text-primary-foreground/70 hover:bg-white/5 hover:text-white"
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
                {user.avatarUrl ? (
                   <img src={user.avatarUrl} alt={user.displayName || "User"} className="w-full h-full object-cover" />
                ) : (
                   <User className="w-4 h-4 text-white" />
                )}
             </div>
             <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{user.displayName || user.username}</p>
                <p className="text-xs text-primary-foreground/50 truncate">{user.email}</p>
             </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-primary-foreground/70 hover:text-white hover:bg-white/5"
            onClick={() => window.location.href = "/api/logout"}
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
            <Link key={item.href} href={item.href}>
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
