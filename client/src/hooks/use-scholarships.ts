import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { Scholarship } from "@shared/schema";

export function useScholarships() {
  return useQuery<Scholarship[]>({
    queryKey: [api.scholarships.list.path],
    queryFn: async () => {
      const res = await fetch(api.scholarships.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch scholarships");
      return res.json();
    },
  });
}

export function useScholarship(id: number) {
  return useQuery<Scholarship | null>({
    queryKey: [api.scholarships.get.path, id],
    queryFn: async () => {
      const res = await fetch(`/api/scholarships/${id}`, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch scholarship");
      return res.json();
    },
    enabled: id > 0,
  });
}
