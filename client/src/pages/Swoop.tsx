import { useState } from "react";
import { useRides, useCreateRide } from "@/hooks/use-rides";
import { useMyVehicles, useCreateVehicle, useUpdateVehicleAvailability } from "@/hooks/use-vehicles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MapPin, Navigation, Clock, CreditCard, Loader2, Plus, Bike, Car } from "lucide-react";
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

const vehicleSchema = z.object({
  type: z.enum(["bike", "moped", "golf_cart"]),
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
});

type VehicleForm = z.infer<typeof vehicleSchema>;

const vehicleIcons: Record<string, string> = {
  bike: "Bike",
  moped: "Moped",
  golf_cart: "Golf Cart",
};

export default function Swoop() {
  const [activeTab, setActiveTab] = useState<"request" | "driver">("request");
  const [showVehicleDialog, setShowVehicleDialog] = useState(false);
  const { data: rides } = useRides();
  const { data: myVehicles = [] } = useMyVehicles();
  const createRide = useCreateRide();
  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicleAvailability();
  const { toast } = useToast();
  
  const form = useForm<RideForm>({
    resolver: zodResolver(rideSchema),
    defaultValues: {
      pickupLocation: "",
      dropoffLocation: "",
    },
  });

  const vehicleForm = useForm<VehicleForm>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      type: "bike",
      name: "",
      description: "",
    },
  });

  const onSubmit = (data: RideForm) => {
    createRide.mutate({
      ...data,
      riderId: "1",
      price: 500,
      status: "requested",
    }, {
      onSuccess: () => {
        form.reset();
        toast({ title: "Ride Requested!", description: "Searching for nearby drivers..." });
      }
    });
  };

  const onVehicleSubmit = (data: VehicleForm) => {
    createVehicle.mutate(data, {
      onSuccess: () => {
        setShowVehicleDialog(false);
        vehicleForm.reset();
        toast({ title: "Vehicle Added!", description: "Your vehicle is now listed for SWOOP rides." });
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    });
  };

  const toggleAvailability = (vehicleId: number, currentStatus: boolean) => {
    updateVehicle.mutate({ id: vehicleId, available: !currentStatus }, {
      onSuccess: () => {
        toast({ 
          title: !currentStatus ? "You're Available!" : "Marked Unavailable",
          description: !currentStatus ? "You can now accept ride requests." : "You won't receive ride requests."
        });
      }
    });
  };

  return (
    <div className="safe-p pt-8 pb-20 md:pl-72 md:pt-10 h-screen flex flex-col">
       <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
          <div>
             <h1 className="font-display font-bold text-3xl text-primary mb-1">SWOOP</h1>
             <p className="text-muted-foreground">Campus micro-mobility</p>
          </div>
          
          <div className="bg-muted p-1 rounded-xl flex gap-1">
             <button 
                onClick={() => setActiveTab("request")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "request" ? "bg-white dark:bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                data-testid="button-rider-tab"
             >
                Rider
             </button>
             <button 
                onClick={() => setActiveTab("driver")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "driver" ? "bg-white dark:bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                data-testid="button-driver-tab"
             >
                Driver
             </button>
          </div>
       </div>

       <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden min-h-0">
          <div className="lg:col-span-2 bg-muted/30 rounded-3xl border border-border overflow-hidden relative">
             <img
                src="/assets/campus-map.png"
                alt="UH Manoa Campus Map"
                className="w-full h-full object-cover"
             />
             
             <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
                <div className="bg-white/90 dark:bg-background/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-border/50 pointer-events-auto">
                   <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Estimated Wait</p>
                   <p className="text-2xl font-display font-bold text-primary">4 min</p>
                </div>
                <div className="bg-white/90 dark:bg-background/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-border/50 pointer-events-auto flex flex-col items-center gap-1">
                   <p className="text-xs text-muted-foreground">Available Drivers</p>
                   <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                         <div className="w-2 h-2 bg-primary rounded-full" />
                         <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                         <div className="w-2 h-2 bg-primary rounded-full" />
                         <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      </div>
                      <p className="text-lg font-bold">4</p>
                   </div>
                </div>
             </div>
          </div>

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
                                     className="pl-9 bg-muted/30 border-transparent focus:bg-white dark:focus:bg-background h-12 rounded-xl"
                                     {...form.register("pickupLocation")} 
                                     data-testid="input-pickup"
                                  />
                               </div>
                            </div>
                            
                            <div className="pl-5 -my-2">
                               <div className="w-0.5 h-6 bg-border" />
                            </div>

                            <div className="space-y-2">
                               <Label className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Dropoff</Label>
                               <div className="relative">
                                  <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                                  <Input 
                                     placeholder="Where to?" 
                                     className="pl-9 bg-muted/30 border-transparent focus:bg-white dark:focus:bg-background h-12 rounded-xl"
                                     {...form.register("dropoffLocation")} 
                                     data-testid="input-dropoff"
                                  />
                               </div>
                            </div>
                         </div>

                         <div className="pt-4 space-y-3">
                            <div className="flex justify-between items-center p-4 bg-muted/20 rounded-xl border border-border/50 gap-2">
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
                               data-testid="button-swoop-now"
                            >
                               {createRide.isPending ? <Loader2 className="animate-spin mr-2" /> : "SWOOP Now"}
                            </Button>
                         </div>
                      </form>
                      
                      <div className="mt-8">
                         <h3 className="font-bold text-sm text-muted-foreground mb-4">Your Active Rides</h3>
                         <div className="space-y-3">
                            {rides?.filter(r => r.status !== 'completed').map(ride => (
                               <div key={ride.id} className="p-4 bg-primary/5 border border-primary/10 rounded-xl flex justify-between items-center gap-2">
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
                      className="space-y-6"
                   >
                      <div className="flex justify-between items-center gap-2">
                         <h2 className="font-display font-bold text-xl">Driver Mode</h2>
                         <Button size="sm" onClick={() => setShowVehicleDialog(true)} data-testid="button-add-vehicle">
                            <Plus className="w-4 h-4 mr-1" /> Add Vehicle
                         </Button>
                      </div>

                      {myVehicles.length > 0 && (
                         <div className="space-y-3">
                            <h3 className="text-sm font-medium text-muted-foreground">Your Vehicles</h3>
                            {myVehicles.map((vehicle) => (
                               <Card key={vehicle.id} className="overflow-hidden" data-testid={`card-vehicle-${vehicle.id}`}>
                                  <CardContent className="p-4">
                                     <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                           <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                              {vehicle.type === 'bike' && <Bike className="w-5 h-5 text-primary" />}
                                              {vehicle.type === 'moped' && <Car className="w-5 h-5 text-primary" />}
                                              {vehicle.type === 'golf_cart' && <Car className="w-5 h-5 text-primary" />}
                                           </div>
                                           <div>
                                              <p className="font-medium">{vehicle.name}</p>
                                              <p className="text-xs text-muted-foreground capitalize">{vehicleIcons[vehicle.type]}</p>
                                           </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                           <Badge variant={vehicle.available ? "default" : "secondary"}>
                                              {vehicle.available ? "Available" : "Offline"}
                                           </Badge>
                                           <Switch
                                              checked={vehicle.available || false}
                                              onCheckedChange={() => toggleAvailability(vehicle.id, vehicle.available || false)}
                                              data-testid={`switch-vehicle-${vehicle.id}`}
                                           />
                                        </div>
                                     </div>
                                  </CardContent>
                               </Card>
                            ))}
                         </div>
                      )}

                      {myVehicles.length === 0 && (
                         <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 rounded-xl p-4">
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                               Add your vehicle to start accepting ride requests! You can register a bike, moped, or golf cart.
                            </p>
                         </div>
                      )}
                      
                      <div className="space-y-4">
                         <h3 className="text-sm font-medium text-muted-foreground">Available Requests</h3>
                         {[1, 2].map((i) => (
                            <div key={i} className="p-4 border border-border rounded-xl hover:border-primary/50 transition-colors cursor-pointer bg-white dark:bg-card shadow-sm">
                               <div className="flex justify-between mb-2 gap-2 flex-wrap">
                                  <Badge variant="secondary" className="bg-primary/10 text-primary">RIDE #{i}20</Badge>
                                  <span className="font-bold text-primary">$5.00</span>
                               </div>
                               <div className="space-y-2 mb-4">
                                  <div className="flex items-center gap-2 text-sm">
                                     <div className="w-2 h-2 bg-green-500 rounded-full" />
                                     <span className="text-muted-foreground">Hamilton Library</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                     <div className="w-2 h-2 bg-red-500 rounded-full" />
                                     <span className="text-muted-foreground">Frear Hall</span>
                                  </div>
                               </div>
                               <Button size="sm" className="w-full" disabled={myVehicles.length === 0 || !myVehicles.some(v => v.available)}>
                                  Accept Ride
                               </Button>
                            </div>
                         ))}
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>
          </div>
       </div>

       <Dialog open={showVehicleDialog} onOpenChange={setShowVehicleDialog}>
          <DialogContent data-testid="dialog-add-vehicle">
             <DialogHeader>
                <DialogTitle>Add Your Vehicle</DialogTitle>
             </DialogHeader>
             <form onSubmit={vehicleForm.handleSubmit(onVehicleSubmit)} className="space-y-4 py-4">
                <div className="space-y-2">
                   <Label htmlFor="vehicleType">Vehicle Type</Label>
                   <Select 
                      defaultValue="bike" 
                      onValueChange={(v) => vehicleForm.setValue("type", v as "bike" | "moped" | "golf_cart")}
                   >
                      <SelectTrigger data-testid="select-vehicle-type">
                         <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                         <SelectItem value="bike">Bike</SelectItem>
                         <SelectItem value="moped">Moped</SelectItem>
                         <SelectItem value="golf_cart">Golf Cart</SelectItem>
                      </SelectContent>
                   </Select>
                </div>

                <div className="space-y-2">
                   <Label htmlFor="vehicleName">Vehicle Name</Label>
                   <Input
                      id="vehicleName"
                      placeholder="e.g., Blue Beach Cruiser"
                      {...vehicleForm.register("name")}
                      data-testid="input-vehicle-name"
                   />
                   {vehicleForm.formState.errors.name && (
                      <p className="text-destructive text-xs">{vehicleForm.formState.errors.name.message}</p>
                   )}
                </div>

                <div className="space-y-2">
                   <Label htmlFor="vehicleDesc">Description (optional)</Label>
                   <Input
                      id="vehicleDesc"
                      placeholder="Any details about your vehicle"
                      {...vehicleForm.register("description")}
                      data-testid="input-vehicle-description"
                   />
                </div>

                <DialogFooter>
                   <Button type="button" variant="outline" onClick={() => setShowVehicleDialog(false)}>
                      Cancel
                   </Button>
                   <Button type="submit" disabled={createVehicle.isPending} data-testid="button-submit-vehicle">
                      {createVehicle.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                      Add Vehicle
                   </Button>
                </DialogFooter>
             </form>
          </DialogContent>
       </Dialog>
    </div>
  );
}
