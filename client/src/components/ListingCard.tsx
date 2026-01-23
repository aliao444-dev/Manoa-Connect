import { type Listing } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { MapPin, Tag } from "lucide-react";

interface ListingCardProps {
  listing: Listing;
  onClick?: () => void;
}

export function ListingCard({ listing, onClick }: ListingCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-md hover:border-border cursor-pointer group"
    >
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {listing.imageUrls[0] ? (
          <img 
            src={listing.imageUrls[0]} 
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary/10 text-secondary">
             <Tag className="w-12 h-12 opacity-20" />
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs font-medium">
          {formatDistanceToNow(new Date(listing.createdAt!), { addSuffix: true })}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
           <h3 className="font-display font-semibold text-lg leading-tight line-clamp-2 text-foreground group-hover:text-primary transition-colors">
             {listing.title}
           </h3>
           <span className="font-bold text-primary whitespace-nowrap ml-2">
             ${(listing.price / 100).toFixed(2)}
           </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <span className="px-2 py-0.5 rounded-md bg-secondary/10 text-secondary-foreground text-xs font-medium">
            {listing.category}
          </span>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="truncate">{listing.condition}</span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
           {listing.description}
        </p>

        <div className="flex items-center gap-2 pt-3 border-t border-border/50">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
             <span className="text-[10px] font-bold text-primary">UH</span>
          </div>
          <span className="text-xs text-muted-foreground">Verified Student</span>
        </div>
      </div>
    </motion.div>
  );
}
