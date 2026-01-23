import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShieldCheck, Star, Clock, Settings, Edit, User, Mail, LogOut } from "lucide-react";

export default function Profile() {
  const { data: user } = useUser();

  if (!user) return null;

  const initials = (user.displayName || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="safe-p pt-8 pb-20 md:pl-72 md:pt-10">
      <div className="max-w-4xl mx-auto space-y-8">
         <div className="relative">
            <div className="h-48 bg-gradient-to-r from-primary to-emerald-600 rounded-3xl shadow-lg mb-16" />
            <div className="absolute -bottom-12 left-8 flex items-end gap-6">
               <div className="w-32 h-32 rounded-3xl bg-card p-1.5 shadow-xl border-4 border-background">
                  <Avatar className="w-full h-full rounded-2xl">
                     <AvatarFallback className="text-3xl font-bold bg-primary/10 text-primary rounded-2xl">
                        {initials}
                     </AvatarFallback>
                  </Avatar>
               </div>
               <div className="pb-2 mb-1">
                  <h1 className="font-display font-bold text-3xl text-foreground" data-testid="text-display-name">
                     {user.displayName || "Student"}
                  </h1>
                  <p className="text-muted-foreground font-medium" data-testid="text-user-id">ID: {user.userId}</p>
               </div>
            </div>
            <div className="absolute bottom-4 right-8 flex gap-3">
               <Button variant="outline" className="rounded-full bg-white/10 text-white border-white/20 backdrop-blur-md" data-testid="button-edit-profile">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
               </Button>
               <Button variant="outline" size="icon" className="rounded-full bg-white/10 text-white border-white/20 backdrop-blur-md" data-testid="button-settings">
                  <Settings className="w-4 h-4" />
               </Button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <Card className="border-border/50 shadow-sm" data-testid="card-trust-score">
               <CardHeader className="flex flex-row items-center justify-between pb-2 gap-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Trust Score</CardTitle>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold font-display text-foreground" data-testid="text-trust-score">{user.trustScore}</div>
                  <p className="text-xs text-muted-foreground mt-1">Excellent Reputation</p>
               </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm" data-testid="card-member-since">
               <CardHeader className="flex flex-row items-center justify-between pb-2 gap-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Member Since</CardTitle>
                  <Clock className="w-4 h-4 text-primary" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold font-display text-foreground" data-testid="text-member-since">
                     {user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Verified Student</p>
               </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm" data-testid="card-roles">
               <CardHeader className="flex flex-row items-center justify-between pb-2 gap-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Roles</CardTitle>
                  <Star className="w-4 h-4 text-secondary" />
               </CardHeader>
               <CardContent>
                  <div className="flex gap-2 flex-wrap">
                     <Badge variant="secondary" className="bg-primary/10 text-primary">Student</Badge>
                     {user.isDriver && <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground">Driver</Badge>}
                  </div>
               </CardContent>
            </Card>
         </div>

         <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-sm">
               <CardHeader>
                  <CardTitle className="font-display text-xl flex items-center gap-2">
                     <User className="w-5 h-5" /> About Me
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-muted-foreground leading-relaxed" data-testid="text-bio">
                     {user.bio || "No bio yet. Click 'Edit Profile' to add one!"}
                  </p>
               </CardContent>
            </Card>
            
            <Card className="shadow-sm">
               <CardHeader>
                  <CardTitle className="font-display text-xl flex items-center gap-2">
                     <Clock className="w-5 h-5" /> Recent Activity
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-4">
                     <div className="p-4 rounded-xl bg-muted/30 border border-border flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                           <Clock className="w-5 h-5" />
                        </div>
                        <div>
                           <p className="font-medium text-sm text-foreground">Joined Manoa Connect</p>
                           <p className="text-xs text-muted-foreground">Just now</p>
                        </div>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>

         <Card className="shadow-sm">
            <CardHeader>
               <CardTitle className="font-display text-xl flex items-center gap-2">
                  <Mail className="w-5 h-5" /> Account Information
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border">
                     <p className="text-xs text-muted-foreground mb-1">Display Name</p>
                     <p className="font-medium text-foreground">{user.displayName || "Not set"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/30 border border-border">
                     <p className="text-xs text-muted-foreground mb-1">User ID</p>
                     <p className="font-medium text-foreground font-mono text-sm">{user.userId}</p>
                  </div>
               </div>
            </CardContent>
         </Card>

         <div className="pt-4">
            <Button variant="destructive" asChild data-testid="button-sign-out">
               <a href="/api/logout">
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
               </a>
            </Button>
         </div>
      </div>
    </div>
  );
}
