import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { useMyVehicles } from "@/hooks/use-vehicles";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, Star, Car, Bike, Plus, Send, MessageSquare, LogOut, Briefcase, GraduationCap } from "lucide-react";

interface Post {
  id: number;
  content: string;
  timestamp: Date;
  type: 'vent' | 'update';
}

export default function Profile() {
  const { data: user } = useUser();
  const { data: myVehicles = [] } = useMyVehicles();
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, content: "Just finished my ICS 311 midterm... that was brutal! Algorithms are no joke.", timestamp: new Date(Date.now() - 3600000), type: 'vent' },
    { id: 2, content: "Started driving for SWOOP today - first ride went great!", timestamp: new Date(Date.now() - 86400000), type: 'update' },
  ]);
  const [newPost, setNewPost] = useState("");

  if (!user) return null;

  const initials = (user.displayName || "U")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handlePost = () => {
    if (!newPost.trim()) return;
    setPosts([
      { id: Date.now(), content: newPost, timestamp: new Date(), type: 'vent' },
      ...posts
    ]);
    setNewPost("");
  };

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return `${Math.floor(diff / 86400000)}d ago`;
  };

  return (
    <div className="safe-p pt-8 pb-20 md:pl-72 md:pt-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <Card className="overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-primary to-emerald-600" />
          <CardContent className="pt-0">
            <div className="flex flex-col sm:flex-row gap-4 -mt-12">
              <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 pt-4 sm:pt-14">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h1 className="font-display font-bold text-2xl text-foreground" data-testid="text-display-name">
                      {user.displayName || "Student"}
                    </h1>
                    <p className="text-muted-foreground text-sm flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      UH Manoa Student
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap items-center">
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      Trust: {user.trustScore || 100}
                    </Badge>
                    {user.isDriver && (
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">
                        <Car className="w-3 h-3 mr-1" />
                        Driver
                      </Badge>
                    )}
                    <Button size="sm" variant="outline" data-testid="button-edit-profile">
                      Edit Profile
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Driver Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  My Vehicles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {myVehicles.length > 0 ? (
                  myVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30" data-testid={`vehicle-item-${vehicle.id}`}>
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        {vehicle.type === 'bike' ? (
                          <Bike className="w-4 h-4 text-primary" />
                        ) : (
                          <Car className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{vehicle.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{vehicle.type.replace('_', ' ')}</p>
                      </div>
                      <Badge variant={vehicle.available ? "default" : "secondary"} className="text-xs">
                        {vehicle.available ? "Online" : "Offline"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-2">No vehicles registered</p>
                    <Button size="sm" variant="outline" asChild data-testid="button-add-vehicle-profile">
                      <a href="/swoop">
                        <Plus className="w-3 h-3 mr-1" /> Add Vehicle
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="text-sm font-medium" data-testid="text-member-since">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2024'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Trust Score</span>
                  <span className="text-sm font-medium text-primary" data-testid="text-trust-score">{user.trustScore || 100}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Posts</span>
                  <span className="text-sm font-medium">{posts.length}</span>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full text-destructive" asChild data-testid="button-sign-out">
              <a href="/api/logout">
                <LogOut className="w-4 h-4 mr-2" /> Sign Out
              </a>
            </Button>
          </div>

          {/* Right Column - Posts Feed */}
          <div className="md:col-span-2 space-y-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Textarea
                      placeholder="What's on your mind? Vent about classes, share updates..."
                      className="min-h-[80px] resize-none"
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      data-testid="input-new-post"
                    />
                    <div className="flex justify-end mt-2">
                      <Button size="sm" onClick={handlePost} disabled={!newPost.trim()} data-testid="button-post">
                        <Send className="w-4 h-4 mr-1" /> Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {posts.map((post) => (
                <Card key={post.id} data-testid={`card-post-${post.id}`}>
                  <CardContent className="pt-4">
                    <div className="flex gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{user.displayName || "Student"}</span>
                          <span className="text-xs text-muted-foreground">{formatTime(post.timestamp)}</span>
                          {post.type === 'vent' && (
                            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              Vent
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-foreground">{post.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {posts.length === 0 && (
                <Card>
                  <CardContent className="py-8 text-center">
                    <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground/50 mb-3" />
                    <p className="text-muted-foreground">No posts yet. Share what's on your mind!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
