import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { ClassGroup, ClassGroupMember, GroupMessage, InsertGroupMessage } from "@shared/schema";

export function useClassGroups() {
  return useQuery<ClassGroup[]>({
    queryKey: [api.classGroups.list.path],
    queryFn: async () => {
      const res = await fetch(api.classGroups.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch class groups");
      return res.json();
    },
  });
}

export function useMyClassGroups() {
  return useQuery<ClassGroup[]>({
    queryKey: [api.classGroups.myGroups.path],
    queryFn: async () => {
      const res = await fetch(api.classGroups.myGroups.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch class groups");
      return res.json();
    },
  });
}

export function useJoinClassGroup() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (classId: string) => {
      const res = await fetch(api.classGroups.join.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId }),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to join class group");
      }
      
      return res.json() as Promise<{ group: ClassGroup; membership: ClassGroupMember }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.classGroups.myGroups.path] });
      queryClient.invalidateQueries({ queryKey: [api.classGroups.list.path] });
    },
  });
}

export function useGroupMessages(groupId: number) {
  return useQuery<GroupMessage[]>({
    queryKey: [api.classGroups.messages.path, groupId],
    queryFn: async () => {
      const url = buildUrl(api.classGroups.messages.path, { id: groupId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return res.json();
    },
    enabled: groupId > 0,
    refetchInterval: 5000,
  });
}

export function useSendGroupMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ groupId, content }: { groupId: number; content: string }) => {
      const url = buildUrl(api.classGroups.sendMessage.path, { id: groupId });
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to send message");
      }
      
      return res.json() as Promise<GroupMessage>;
    },
    onSuccess: (_, { groupId }) => {
      queryClient.invalidateQueries({ queryKey: [api.classGroups.messages.path, groupId] });
    },
  });
}
