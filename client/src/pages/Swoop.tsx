import { useState } from "react";
import { useRides, useCreateRide } from "@/hooks/use-rides";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MapPin, Navigation, Clock, CreditCard, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const rideSchema = z.object({
  pickupLocation: z.string().min(1, "Pickup required"),
  dropoffLocation: z.string().min(1, "Dropoff required"),
});

type RideForm = z.infer<typeof rideSchema>;

export default function Swoop() {
  const [activeTab, setActiveTab] = useState<"request" | "driver">("request");
  const { data: rides } = useRides();
  const createRide = useCreateRide();
  const { toast } = useToast();
  
  const form = useForm<RideForm>({
    resolver: zodResolver(rideSchema),
  });

  const onSubmit = (data: RideForm) => {
    createRide.mutate({
      ...data,
      riderId: 1, // Will be overridden
      price: 500, // Flat rate $5.00 for prototype
      status: "requested",
    }, {
      onSuccess: () => {
        form.reset();
        toast({ title: "Ride Requested!", description: "Searching for nearby drivers..." });
      }
    });
  };

  return (
    <div className="safe-p pt-8 pb-20 md:pl-72 md:pt-10 h-screen flex flex-col">
       <div className="flex justify-between items-center mb-6">
          <div>
             <h1 className="font-display font-bold text-3xl text-primary mb-1">SWOOP</h1>
             <p className="text-muted-foreground">Campus micro-mobility</p>
          </div>
          
          <div className="bg-muted p-1 rounded-xl flex gap-1">
             <button 
                onClick={() => setActiveTab("request")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "request" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
             >
                Rider
             </button>
             <button 
                onClick={() => setActiveTab("driver")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "driver" ? "bg-white shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
             >
                Driver
             </button>
          </div>
       </div>

       <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden min-h-0">
          {/* Map Area */}
          <div className="lg:col-span-2 bg-muted/30 rounded-3xl border border-border overflow-hidden relative group">
             {/* Simple Map Placeholder */}
             <div className="absolute inset-0 bg-[#e5e7eb] flex items-center justify-center">
                <div className="text-center opacity-30">
                   <Navigation className="w-16 h-16 mx-auto mb-4" />
                   <p className="font-display font-bold text-2xl">Campus Map View</p>
                </div>
                
                {/* Simulated Pins */}
                <div className="absolute top-1/3 left-1/4">
                   <div className="w-4 h-4 bg-primary rounded-full animate-ping absolute" />
                   <div className="w-4 h-4 bg-primary rounded-full relative shadow-lg border-2 border-white" />
                   <div className="bg-white px-2 py-1 rounded-md text-xs font-bold shadow-md mt-1 -ml-4 whitespace-nowrap">Current User</div>
                </div>

                <div className="absolute bottom-1/3 right-1/3">
                   <div className="text-2xl">🛺</div>
                </div>
             </div>
             
             {/* Overlay Controls */}
             <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-border/50 pointer-events-auto">
                   <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Estimated Wait</p>
                   <p className="text-2xl font-display font-bold text-primary">4 min</p>
                </div>
             </div>
          </div>

          {/* Action Panel */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm overflow-y-auto">
             <AnimatePresence mode="wait">
                {activeTab === "request" ? (
                   <motion.div 
                      key="request"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full flex flex-col"
                   >
                      <h2 className="font-display font-bold text-xl mb-6">Request a Ride</h2>
                      
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
                         <div className="space-y-4">
                            <div className="space-y-2">
                               <Label className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Pickup</Label>
                               <div className="relative">
                                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                  <Input 
                                     placeholder="Current Location" 
                                     className="pl-9 bg-muted/30 border-transparent focus:bg-white h-12 rounded-xl"
                                     {...form.register("pickupLocation")} 
                                  />
                               </div>
                            </div>
                            
                            {/* Connector Line */}
                            <div className="pl-5 -my-2">
                               <div className="w-0.5 h-6 bg-border" />
                            </div>

                            <div className="space-y-2">
                               <Label className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Dropoff</Label>
                               <div className="relative">
                                  <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                                  <Input 
                                     placeholder="Where to?" 
                                     className="pl-9 bg-muted/30 border-transparent focus:bg-white h-12 rounded-xl"
                                     {...form.register("dropoffLocation")} 
                                  />
                               </div>
                            </div>
                         </div>

                         <div className="pt-4 space-y-3">
                            <div className="flex justify-between items-center p-4 bg-muted/20 rounded-xl border border-border/50">
                               <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                     <CreditCard className="w-5 h-5" />
                                  </div>
                                  <div>
                                     <p className="font-medium text-sm">Personal Card</p>
                                     <p className="text-xs text-muted-foreground">**** 4242</p>
                                  </div>
                               </div>
                               <span className="font-display font-bold text-lg">$5.00</span>
                            </div>

                            <Button 
                               type="submit" 
                               className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/20"
                               disabled={createRide.isPending}
                            >
                               {createRide.isPending ? <Loader2 className="animate-spin mr-2" /> : "SWOOP Now"}
                            </Button>
                         </div>
                      </form>
                      
                      {/* Active Rides List */}
                      <div className="mt-8">
                         <h3 className="font-bold text-sm text-muted-foreground mb-4">Your Active Rides</h3>
                         <div className="space-y-3">
                            {rides?.filter(r => r.status !== 'completed').map(ride => (
                               <div key={ride.id} className="p-4 bg-primary/5 border border-primary/10 rounded-xl flex justify-between items-center">
                                  <div>
                                     <p className="font-medium text-sm">{ride.dropoffLocation}</p>
                                     <p className="text-xs text-primary capitalize">{ride.status}</p>
                                  </div>
                                  <Clock className="w-4 h-4 text-primary/50" />
                               </div>
                            ))}
                            {!rides?.length && (
                               <p className="text-sm text-muted-foreground text-center py-4">No active rides</p>
                            )}
                         </div>
                      </div>
                   </motion.div>
                ) : (
                   <motion.div 
                      key="driver"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                   >
                      <h2 className="font-display font-bold text-xl mb-6">Driver Mode</h2>
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
                         <p className="text-sm text-amber-800">Available requests near you will appear here.</p>
                      </div>
                      
                      <div className="space-y-4">
                         {/* Mock Requests */}
                         {[1, 2].map((i) => (
                            <div key={i} className="p-4 border border-border rounded-xl hover:border-primary/50 transition-colors cursor-pointer bg-white shadow-sm">
                               <div className="flex justify-between mb-2">
                                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded">RIDE #{i}20</span>
                                  <span className="font-bold text-primary">$5.00</span>
                               </div>
                               <div className="space-y-2 mb-4">
                                  <div className="flex items-center gap-2 text-sm">
                                     <div className="w-2 h-2 bg-green-500 rounded-full" />
                                     <span className="text-muted-foreground">Library</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                     <div className="w-2 h-2 bg-red-500 rounded-full" />
                                     <span className="text-muted-foreground">Frear Hall</span>
                                  </div>
                               </div>
                               <Button size="sm" className="w-full">Accept Ride</Button>
                            </div>
                         ))}
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>
       </div>
    </div>
  );
}

// Helper component for Label (missing in shadcn import above but used in code)
function Label({ className, children, ...props }: any) {
   return <label className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`} {...props}>{children}</label>
}
