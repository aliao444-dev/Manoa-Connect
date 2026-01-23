import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertRide } from "@shared/routes";

export function useRides() {
  return useQuery({
    queryKey: [api.rides.list.path],
    queryFn: async () => {
      const res = await fetch(api.rides.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch rides");
      return api.rides.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateRide() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertRide) => {
      const validated = api.rides.create.input.parse(data);
      
      const res = await fetch(api.rides.create.path, {
        method: api.rides.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to request ride");
      
      return api.rides.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.rides.list.path] });
    },
  });
}

export function useUpdateRide() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status, driverId }: { id: number; status: string; driverId?: number }) => {
      const url = buildUrl(api.rides.update.path, { id });
      
      const res = await fetch(url, {
        method: api.rides.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, driverId }),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update ride");
      
      return api.rides.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.rides.list.path] });
    },
  });
}
