import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { Profile, InsertProfile } from "@shared/schema";

export function useUser() {
  return useQuery({
    queryKey: [api.profile.me.path],
    queryFn: async (): Promise<Profile | null> => {
      const res = await fetch(api.profile.me.path, { credentials: "include" });
      if (res.status === 401) return null;
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
    retry: false,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<InsertProfile>) => {
      const res = await fetch(api.profile.update.path, {
        method: api.profile.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to update profile");
      return res.json() as Promise<Profile>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.profile.me.path] });
    },
  });
}
