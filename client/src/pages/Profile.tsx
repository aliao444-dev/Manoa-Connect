import { useState } from "react";
import { useUser } from "@/hooks/use-user";
import { useMyVehicles } from "@/hooks/use-vehicles";
import { useMyListings } from "@/hooks/use-listings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, Car, Bike, Plus, Send, MessageSquare, LogOut, Briefcase, GraduationCap, Trash2, ShoppingBag, Flame, Trophy, Users } from "lucide-react";

type PostType = 'vent' | 'success' | 'discussion';

interface Post {
  id: number;
  content: string;
  timestamp: Date;
  type: PostType;
}

const postTypeConfig: Record<PostType, { label: string; icon: typeof Flame; className: string }> = {
  vent: { label: 'Vent', icon: Flame, className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  success: { label: 'Success', icon: Trophy, className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  discussion: { label: 'Discussion', icon: Users, className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
};

export default function Profile() {
  const { data: user } = useUser();
  const { data: myVehicles = [] } = useMyVehicles();
  const { data: myListings = [] } = useMyListings();
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, content: "Just finished my ICS 311 midterm... that was brutal! Algorithms are no joke.", timestamp: new Date(Date.now() - 3600000), type: 'vent' },
    { id: 2, content: "Got an A on my calculus exam!", timestamp: new Date(Date.now() - 86400000), type: 'success' },
  ]);
  const [newPost, setNewPost] = useState("");
  const [selectedTag, setSelectedTag] = useState<PostType>('discussion');

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
      { id: Date.now(), content: newPost, timestamp: new Date(), type: selectedTag },
      ...posts
    ]);
    setNewPost("");
  };

  const handleDeletePost = (postId: number) => {
    setPosts(posts.filter(p => p.id !== postId));
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
          {/* Left Column - Stats & Info */}
          <div className="space-y-4">
            {/* Quick Stats - moved to top */}
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
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Listings</span>
                  <span className="text-sm font-medium">{myListings.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* My Listings */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  My Listings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {myListings.length > 0 ? (
                  myListings.slice(0, 3).map((listing) => (
                    <div key={listing.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30" data-testid={`listing-item-${listing.id}`}>
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <ShoppingBag className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{listing.title}</p>
                        <p className="text-xs text-muted-foreground">${(listing.price / 100).toFixed(2)}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {listing.status === 'available' ? 'Active' : listing.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-2">No listings yet</p>
                    <Button size="sm" variant="outline" asChild data-testid="button-create-listing-profile">
                      <a href="/marketplace">
                        <Plus className="w-3 h-3 mr-1" /> Create Listing
                      </a>
                    </Button>
                  </div>
                )}
                {myListings.length > 3 && (
                  <Button size="sm" variant="ghost" className="w-full" asChild data-testid="button-view-all-listings">
                    <a href="/marketplace">View All ({myListings.length})</a>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* My Vehicles */}
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
                    <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
                      <div className="flex gap-1">
                        {(Object.keys(postTypeConfig) as PostType[]).map((type) => {
                          const config = postTypeConfig[type];
                          const Icon = config.icon;
                          return (
                            <button
                              key={type}
                              onClick={() => setSelectedTag(type)}
                              className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-all ${
                                selectedTag === type 
                                  ? config.className 
                                  : 'bg-muted text-muted-foreground'
                              }`}
                              data-testid={`button-tag-${type}`}
                            >
                              <Icon className="w-3 h-3" />
                              {config.label}
                            </button>
                          );
                        })}
                      </div>
                      <Button size="sm" onClick={handlePost} disabled={!newPost.trim()} data-testid="button-post">
                        <Send className="w-4 h-4 mr-1" /> Post
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {posts.map((post) => {
                const config = postTypeConfig[post.type];
                const Icon = config.icon;
                return (
                  <Card key={post.id} data-testid={`card-post-${post.id}`}>
                    <CardContent className="pt-4">
                      <div className="flex gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm">{user.displayName || "Student"}</span>
                              <span className="text-xs text-muted-foreground">{formatTime(post.timestamp)}</span>
                              <Badge variant="secondary" className={`text-xs ${config.className}`}>
                                <Icon className="w-3 h-3 mr-1" />
                                {config.label}
                              </Badge>
                            </div>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-7 w-7 text-muted-foreground hover:text-destructive"
                              onClick={() => handleDeletePost(post.id)}
                              data-testid={`button-delete-post-${post.id}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-foreground">{post.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

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
