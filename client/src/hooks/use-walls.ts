import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { WallSpace, WallBooking, InsertWallBooking } from "@shared/schema";

export function useWalls() {
  return useQuery<WallSpace[]>({
    queryKey: [api.walls.list.path],
    queryFn: async () => {
      const res = await fetch(api.walls.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch walls");
      return res.json();
    },
  });
}

export function useWall(id: number) {
  return useQuery<WallSpace | null>({
    queryKey: [api.walls.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.walls.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch wall");
      return res.json();
    },
    enabled: id > 0,
  });
}

export function useBookWall() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ wallId, data }: { wallId: number; data: Omit<InsertWallBooking, 'userId' | 'wallId'> }) => {
      const validated = api.walls.book.input.parse(data);
      
      const res = await fetch(buildUrl("/api/walls/:id/book", { id: wallId }), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to book wall");
      }
      
      return res.json() as Promise<WallBooking>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.walls.list.path] });
    },
  });
}

export function useMyWallBookings() {
  return useQuery<WallBooking[]>({
    queryKey: [api.walls.myBookings.path],
    queryFn: async () => {
      const res = await fetch(api.walls.myBookings.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      return res.json();
    },
  });
}
