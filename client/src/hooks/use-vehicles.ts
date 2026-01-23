import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { Vehicle, InsertVehicle } from "@shared/schema";

export function useAvailableVehicles() {
  return useQuery<Vehicle[]>({
    queryKey: [api.vehicles.list.path],
    queryFn: async () => {
      const res = await fetch(api.vehicles.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch vehicles");
      return res.json();
    },
  });
}

export function useMyVehicles() {
  return useQuery<Vehicle[]>({
    queryKey: [api.vehicles.myVehicles.path],
    queryFn: async () => {
      const res = await fetch(api.vehicles.myVehicles.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch vehicles");
      return res.json();
    },
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<InsertVehicle, 'ownerId'>) => {
      const res = await fetch(api.vehicles.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create vehicle");
      }
      
      return res.json() as Promise<Vehicle>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.vehicles.myVehicles.path] });
      queryClient.invalidateQueries({ queryKey: [api.vehicles.list.path] });
    },
  });
}

export function useUpdateVehicleAvailability() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, available }: { id: number; available: boolean }) => {
      const res = await fetch(`/api/vehicles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available }),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update vehicle");
      }
      
      return res.json() as Promise<Vehicle>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.vehicles.myVehicles.path] });
      queryClient.invalidateQueries({ queryKey: [api.vehicles.list.path] });
    },
  });
}
