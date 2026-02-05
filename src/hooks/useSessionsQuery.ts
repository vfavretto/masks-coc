import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionAPI } from '@/services/api';

// Query keys
export const sessionKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (filters: string) => [...sessionKeys.lists(), { filters }] as const,
  details: () => [...sessionKeys.all, 'detail'] as const,
  detail: (id: string) => [...sessionKeys.details(), id] as const,
  search: (query: string) => [...sessionKeys.all, 'search', query] as const,
};

// Hooks
export function useSessionsQuery() {
  return useQuery({
    queryKey: sessionKeys.lists(),
    queryFn: async () => {
      const response = await sessionAPI.getAll();
      return response.data;
    },
  });
}

export function useSessionQuery(id: string) {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: async () => {
      const response = await sessionAPI.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useSessionSearch(query: string) {
  return useQuery({
    queryKey: sessionKeys.search(query),
    queryFn: async () => {
      const response = await sessionAPI.search(query);
      return response.data;
    },
    enabled: query.length > 2,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await sessionAPI.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
}

export function useUpdateSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await sessionAPI.update(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await sessionAPI.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
  });
}
