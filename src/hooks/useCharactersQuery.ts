import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { characterAPI } from '@/services/api';

// Query keys
export const characterKeys = {
  all: ['characters'] as const,
  lists: () => [...characterKeys.all, 'list'] as const,
  list: (filters: string) => [...characterKeys.lists(), { filters }] as const,
  details: () => [...characterKeys.all, 'detail'] as const,
  detail: (id: string) => [...characterKeys.details(), id] as const,
};

// Hooks
export function useCharactersQuery() {
  return useQuery({
    queryKey: characterKeys.lists(),
    queryFn: async () => {
      const response = await characterAPI.getAll();
      return response.data;
    },
  });
}

export function useCharacterQuery(id: string) {
  return useQuery({
    queryKey: characterKeys.detail(id),
    queryFn: async () => {
      const response = await characterAPI.getById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateCharacter() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await characterAPI.create(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: characterKeys.lists() });
    },
  });
}

export function useUpdateCharacter() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await characterAPI.update(id, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: characterKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: characterKeys.lists() });
    },
  });
}

export function useDeleteCharacter() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      await characterAPI.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: characterKeys.lists() });
    },
  });
}
