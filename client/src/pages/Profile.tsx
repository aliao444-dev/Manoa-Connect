import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldCheck, Star, Clock, Settings, Edit } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Profile() {
  const { data: user } = useUser();

  if (!user) return null;

  return (
    <div className="safe-p pt-8 pb-20 md:pl-72 md:pt-10">
      <div className="max-w-4xl mx-auto space-y-8">
         {/* Profile Header */}
         <div className="relative">
            <div className="h-48 bg-gradient-to-r from-primary to-emerald-600 rounded-3xl shadow-lg mb-16"></div>
            <div className="absolute -bottom-12 left-8 flex items-end gap-6">
               <div className="w-32 h-32 rounded-3xl bg-white p-1.5 shadow-xl">
                  {user.avatarUrl ? (
                     <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-2xl bg-muted" />
                  ) : (
                     <div className="w-full h-full bg-muted rounded-2xl flex items-center justify-center text-4xl">👤</div>
                  )}
               </div>
               <div className="pb-2 mb-1">
                  <h1 className="font-display font-bold text-3xl">{user.displayName || user.username}</h1>
                  <p className="text-muted-foreground">@{user.username}</p>
               </div>
            </div>
            <div className="absolute bottom-4 right-8 flex gap-3">
               <Button variant="outline" className="rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
               </Button>
               <Button variant="outline" size="icon" className="rounded-full bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-md">
                  <Settings className="w-4 h-4" />
               </Button>
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <Card className="border-border/50 shadow-sm">
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Trust Score</CardTitle>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold font-display">{user.trustScore}</div>
                  <p className="text-xs text-muted-foreground mt-1">Excellent Reputation</p>
               </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Member Since</CardTitle>
                  <Clock className="w-4 h-4 text-primary" />
               </CardHeader>
               <CardContent>
                  <div className="text-2xl font-bold font-display">
                     {user.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Verified Student</p>
               </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm">
               <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Roles</CardTitle>
                  <Star className="w-4 h-4 text-secondary" />
               </CardHeader>
               <CardContent>
                  <div className="flex gap-2">
                     <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">Student</Badge>
                     {user.isDriver && <Badge variant="secondary" className="bg-secondary/20 text-secondary-foreground hover:bg-secondary/30">Driver</Badge>}
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Content Tabs */}
         <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
               <h3 className="font-display font-bold text-xl">About Me</h3>
               <p className="text-muted-foreground leading-relaxed">
                  {user.bio || "No bio yet. Click 'Edit Profile' to add one!"}
               </p>
            </div>
            
            <div className="space-y-4">
               <h3 className="font-display font-bold text-xl">Recent Activity</h3>
               <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Clock className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="font-medium text-sm">Joined Manoa Connect</p>
                        <p className="text-xs text-muted-foreground">Just now</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
