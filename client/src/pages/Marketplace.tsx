import { useState } from "react";
import { useListings, useCreateListing } from "@/hooks/use-listings";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Filter, Loader2, Image as ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useUpload } from "@/hooks/use-upload";

// Schema for listing form
const createListingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(0, "Price must be positive"),
  condition: z.string().min(1, "Condition is required"),
  category: z.string().min(1, "Category is required"),
});

type CreateListingForm = z.infer<typeof createListingSchema>;

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  
  const { data: listings, isLoading } = useListings({ search, category: category === "all" ? undefined : category });
  const createListing = useCreateListing();
  const { toast } = useToast();
  const { getUploadParameters } = useUpload();

  const form = useForm<CreateListingForm>({
    resolver: zodResolver(createListingSchema),
  });

  const onSubmit = (data: CreateListingForm) => {
    // Convert price to cents
    createListing.mutate({
      ...data,
      price: Math.round(data.price * 100),
      sellerId: "temp", // Will be overridden by backend
      imageUrls: imageUrls.length > 0 ? imageUrls : ["https://placehold.co/600x400?text=No+Image"],
      status: "active",
    }, {
      onSuccess: () => {
        setIsCreateOpen(false);
        form.reset();
        setImageUrls([]);
        toast({ title: "Success", description: "Listing created successfully!" });
      },
      onError: (err) => {
        toast({ title: "Error", description: err.message, variant: "destructive" });
      }
    });
  };

  return (
    <div className="safe-p pt-8 pb-20 md:pl-72 md:pt-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-primary mb-1">Marketplace</h1>
          <p className="text-muted-foreground">Buy and sell across campus</p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow-lg shadow-primary/20" data-testid="button-sell-item">
              <Plus className="w-5 h-5 mr-2" />
              Sell Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">Create Listing</DialogTitle>
            </DialogHeader>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="e.g. Calculus Textbook, Mini Fridge" {...form.register("title")} data-testid="input-listing-title" />
                {form.formState.errors.title && <p className="text-destructive text-xs">{form.formState.errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                   <Label htmlFor="price">Price ($)</Label>
                   <Input id="price" type="number" step="0.01" placeholder="0.00" {...form.register("price")} data-testid="input-listing-price" />
                </div>
                <div className="grid gap-2">
                   <Label htmlFor="category">Category</Label>
                   <Select onValueChange={(v) => form.setValue("category", v)}>
                      <SelectTrigger data-testid="select-category">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Textbook">Textbook</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Dorm">Dorm Essentials</SelectItem>
                        <SelectItem value="Hawaiian">Hawaiian</SelectItem>
                        <SelectItem value="Service">Service</SelectItem>
                        <SelectItem value="Sports">Sports</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="condition">Condition</Label>
                <Select onValueChange={(v) => form.setValue("condition", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select condition..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Like New">Like New</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe your item..." className="min-h-[100px]" {...form.register("description")} />
              </div>

              <div className="grid gap-2">
                <Label>Photos</Label>
                <div className="flex gap-2 items-center">
                  <ObjectUploader
                    maxNumberOfFiles={3}
                    onGetUploadParameters={getUploadParameters}
                    onComplete={(result) => {
                      const urls = (result.successful || []).map(f => f.response?.uploadURL as string).filter(Boolean);
                      setImageUrls(prev => [...prev, ...urls]);
                      toast({ title: "Uploaded", description: `${urls.length} images uploaded` });
                    }}
                    buttonClassName="bg-secondary/10 text-secondary-foreground hover:bg-secondary/20"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Upload Photos
                  </ObjectUploader>
                  <span className="text-xs text-muted-foreground">{imageUrls.length} photos added</span>
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={createListing.isPending}>
                  {createListing.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Post Listing
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-border/50 sticky top-4 z-30">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
             placeholder="Search textbooks, furniture..." 
             className="pl-9 bg-muted/30 border-transparent focus:bg-white transition-all"
             value={search}
             onChange={(e) => setSearch(e.target.value)}
             data-testid="input-search-listings"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
           {["All", "Textbook", "Dorm", "Electronics", "Hawaiian", "Service", "Sports"].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat === "All" ? "" : cat)}
                className={`
                   px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                   ${(category === cat || (cat === "All" && !category)) 
                      ? "bg-primary text-white" 
                      : "bg-muted text-muted-foreground"}
                `}
                data-testid={`button-filter-${cat.toLowerCase()}`}
              >
                 {cat}
              </button>
           ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[300px] rounded-2xl bg-muted animate-pulse" />
           ))}
        </div>
      ) : listings?.length === 0 ? (
        <div className="text-center py-20">
           <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
           </div>
           <h3 className="font-display font-bold text-xl text-primary mb-2">No listings found</h3>
           <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings?.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
