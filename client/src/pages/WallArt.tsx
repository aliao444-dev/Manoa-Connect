import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWalls, useBookWall } from "@/hooks/use-walls";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Maximize2, DollarSign, Palette, Users, CheckCircle2, ArrowRight, Brush, MessageSquare, Calendar, Loader2 } from "lucide-react";
import type { WallSpace } from "@shared/schema";
import campusImage1 from "@assets/image_1769131712039.png";
import campusImage2 from "@assets/image_1769131722866.png";

const bookingFormSchema = z.object({
  startupName: z.string().min(2, "Startup name must be at least 2 characters"),
  startupDescription: z.string().min(10, "Please provide at least 10 characters"),
  designBrief: z.string().min(10, "Please provide at least 10 characters describing your vision"),
  contactEmail: z.string().email("Please enter a valid email address"),
  duration: z.coerce.number().min(1).max(12),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

export default function WallArt() {
  const { toast } = useToast();
  const [selectedWall, setSelectedWall] = useState<WallSpace | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const { data: walls = [], isLoading } = useWalls();
  const bookMutation = useBookWall();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      startupName: "",
      startupDescription: "",
      designBrief: "",
      contactEmail: "",
      duration: 3,
    },
  });

  const processSteps = [
    {
      icon: Palette,
      title: "Choose Your Canvas",
      description: "Browse available wall spaces across the Shidler campus and select the perfect location for your startup's mural.",
    },
    {
      icon: MessageSquare,
      title: "Share Your Vision",
      description: "Tell us about your startup and design ideas. Our team will help refine your concept for maximum impact.",
    },
    {
      icon: Brush,
      title: "Local Artist Collaboration",
      description: "We partner with talented Hawaii-based artists and muralists to bring your vision to life with authentic local style.",
    },
    {
      icon: Calendar,
      title: "Installation & Launch",
      description: "Watch your mural come to life! We coordinate installation timing to minimize disruption and maximize visibility.",
    },
  ];

  const handleSelectWall = (wall: WallSpace) => {
    setSelectedWall(wall);
    setBookingOpen(true);
  };

  const onSubmit = (data: BookingFormData) => {
    if (!selectedWall) return;
    
    bookMutation.mutate(
      { wallId: selectedWall.id, data },
      {
        onSuccess: () => {
          toast({
            title: "Booking Submitted!",
            description: "We'll contact you within 48 hours to discuss your mural project.",
          });
          setBookingOpen(false);
          setSelectedWall(null);
          form.reset();
        },
        onError: (error: Error) => {
          toast({
            title: "Booking Failed",
            description: error.message,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDialogClose = (open: boolean) => {
    setBookingOpen(open);
    if (!open) {
      form.reset();
      setSelectedWall(null);
    }
  };

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  const watchDuration = form.watch("duration");
  const totalPrice = selectedWall ? selectedWall.pricePerMonth * (watchDuration || 3) : 0;

  return (
    <div className="min-h-screen bg-background md:ml-64">
      <div className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={campusImage1}
            alt="Shidler College Campus"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70" />
        </div>
        <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 max-w-4xl">
          <Badge className="w-fit mb-4 bg-secondary text-secondary-foreground" data-testid="badge-wall-art">
            Startup Promotion
          </Badge>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            Campus Wall Art
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            Transform campus walls into stunning murals that showcase your startup. Partner with local Hawaii artists to create unforgettable brand experiences.
          </p>
        </div>
      </div>

      <div className="safe-p py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From concept to creation, we make it easy to promote your startup with beautiful, hand-painted murals by local artists.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {processSteps.map((step, index) => (
            <Card key={step.title} className="relative hover-elevate" data-testid={`card-process-step-${index}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Step {index + 1}</span>
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </CardContent>
              {index < processSteps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground/30 z-10" />
              )}
            </Card>
          ))}
        </div>

        <div className="mb-8">
          <img
            src={campusImage2}
            alt="Shidler Campus Evening View"
            className="w-full h-48 object-cover rounded-xl"
          />
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-display font-bold mb-2">Available Wall Spaces</h2>
          <p className="text-muted-foreground">
            Select a location to start your mural project. Premium spots at the Shidler College of Business.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {walls.map((wall) => (
              <Card
                key={wall.id}
                className={`hover-elevate cursor-pointer transition-all ${
                  wall.status !== "available" ? "opacity-60" : ""
                }`}
                onClick={() => wall.status === "available" && handleSelectWall(wall)}
                data-testid={`card-wall-${wall.id}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{wall.name}</CardTitle>
                    <Badge
                      variant={wall.status === "available" ? "default" : "secondary"}
                      data-testid={`badge-wall-status-${wall.id}`}
                    >
                      {wall.status === "available" ? "Available" : "Booked"}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {wall.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{wall.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Maximize2 className="w-4 h-4" />
                      {wall.dimensions}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-primary">
                      <DollarSign className="w-4 h-4" />
                      {formatPrice(wall.pricePerMonth)}/mo
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={wall.status !== "available"}
                    data-testid={`button-select-wall-${wall.id}`}
                  >
                    {wall.status === "available" ? "Select This Wall" : "Currently Booked"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-2xl font-display font-bold mb-2">
                  Support Local Hawaiian Artists
                </h3>
                <p className="text-primary-foreground/80">
                  Every mural is created by talented artists from the Hawaii community. Your startup promotion directly supports local creatives and brings authentic island style to campus.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-secondary/20 border-2 border-primary-foreground flex items-center justify-center"
                    >
                      <Users className="w-5 h-5" />
                    </div>
                  ))}
                </div>
                <span className="text-sm">15+ Local Artists</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={bookingOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-lg" data-testid="dialog-booking">
          <DialogHeader>
            <DialogTitle className="font-display">Book Wall Space</DialogTitle>
            <DialogDescription>
              {selectedWall?.name} - {formatPrice(selectedWall?.pricePerMonth || 0)}/month
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="startupName">Startup Name</Label>
              <Input
                id="startupName"
                placeholder="Your startup or project name"
                {...form.register("startupName")}
                data-testid="input-startup-name"
              />
              {form.formState.errors.startupName && (
                <p className="text-destructive text-xs">{form.formState.errors.startupName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startupDescription">About Your Startup</Label>
              <Textarea
                id="startupDescription"
                placeholder="Brief description of what your startup does..."
                {...form.register("startupDescription")}
                data-testid="input-startup-description"
              />
              {form.formState.errors.startupDescription && (
                <p className="text-destructive text-xs">{form.formState.errors.startupDescription.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="designBrief">Design Brief</Label>
              <Textarea
                id="designBrief"
                placeholder="Describe your vision for the mural - colors, themes, style preferences..."
                {...form.register("designBrief")}
                data-testid="input-design-brief"
              />
              {form.formState.errors.designBrief && (
                <p className="text-destructive text-xs">{form.formState.errors.designBrief.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="your.email@hawaii.edu"
                {...form.register("contactEmail")}
                data-testid="input-contact-email"
              />
              {form.formState.errors.contactEmail && (
                <p className="text-destructive text-xs">{form.formState.errors.contactEmail.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Booking Duration</Label>
              <Select
                defaultValue="3"
                onValueChange={(value) => form.setValue("duration", parseInt(value))}
              >
                <SelectTrigger data-testid="select-duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Month</SelectItem>
                  <SelectItem value="3">3 Months (Semester)</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months (Full Year)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Monthly Rate</span>
                <span>{formatPrice(selectedWall?.pricePerMonth || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Duration</span>
                <span>{watchDuration || 3} month(s)</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span data-testid="text-total-price">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm text-muted-foreground bg-secondary/10 p-3 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
              <p>
                After booking, our team will contact you within 48 hours to discuss artist selection and design refinement. Local Hawaii artists will then create your custom mural.
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={bookMutation.isPending}
                data-testid="button-submit-booking"
              >
                {bookMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Booking Request"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="h-20 md:hidden" />
    </div>
  );
}
