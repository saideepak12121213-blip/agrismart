import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from './client';
import {
  Farm,
  SoilTest,
  DiseaseDiagnostic,
  CropPlan,
  FertilizerPrescription,
  IrrigationSchedule,
  ChatMessage,
  ChatConversation,
} from '@shared/types';

// Farm Hooks
export function useFarms() {
  return useQuery<Farm[]>({
    queryKey: ['farms'],
    queryFn: () => apiFetch<Farm[]>('/api/farms'),
  });
}

export function useFarm(id: string) {
  return useQuery<Farm>({
    queryKey: ['farm', id],
    queryFn: () => apiFetch<Farm>(`/api/farms/${id}`),
    enabled: Boolean(id),
  });
}

export function useCreateFarm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newFarm: any) =>
      apiFetch<Farm>('/api/farms', {
        method: 'POST',
        body: JSON.stringify(newFarm),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
    },
  });
}

export function useCreateSoilTest(farmId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (testData: any) =>
      apiFetch<SoilTest>(`/api/farms/${farmId}/soil-tests`, {
        method: 'POST',
        body: JSON.stringify(testData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
      queryClient.invalidateQueries({ queryKey: ['farm', farmId] });
      queryClient.invalidateQueries({ queryKey: ['soil-tests', farmId] });
    },
  });
}

// Diagnostics Hooks
export function useAnalyzeCrop() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiFetch<DiseaseDiagnostic>('/api/diagnostics/analyze', {
        method: 'POST',
        body: formData,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnostics'] });
      queryClient.invalidateQueries({ queryKey: ['farms'] });
    },
  });
}

export function useDiagnosticHistory(farmId: string = 'all', severity?: string, isResolved?: boolean) {
  const params = new URLSearchParams();
  if (severity) params.append('severity', severity);
  if (isResolved !== undefined) params.append('is_resolved', String(isResolved));

  return useQuery<DiseaseDiagnostic[]>({
    queryKey: ['diagnostics', farmId, severity, isResolved],
    queryFn: () => apiFetch<DiseaseDiagnostic[]>(`/api/diagnostics/history/${farmId}?${params.toString()}`),
  });
}

export function useToggleDiagnosticResolved() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, is_resolved }: { id: string; is_resolved: boolean }) =>
      apiFetch<DiseaseDiagnostic>(`/api/diagnostics/${id}/resolve`, {
        method: 'PATCH',
        body: JSON.stringify({ is_resolved }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diagnostics'] });
      queryClient.invalidateQueries({ queryKey: ['farms'] });
    },
  });
}

// Crop Planner Hooks
export function useRecommendCrops() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { farm_id: string; season: string; target_crops_preference?: string[]; budget_constraint?: string }) =>
      apiFetch<any>('/api/planner/recommend', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crop-plans'] });
    },
  });
}

export function useCropPlanHistory(farmId: string = 'all') {
  return useQuery<CropPlan[]>({
    queryKey: ['crop-plans', farmId],
    queryFn: () => apiFetch<CropPlan[]>(`/api/planner/history/${farmId}`),
  });
}

// Fertilizer Hooks
export function useCalculateFertilizer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      farm_id: string;
      crop_name: string;
      area_hectares: number;
      target_n: number;
      target_p: number;
      target_k: number;
    }) =>
      apiFetch<any>('/api/fertilizer/calculate', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fertilizers'] });
    },
  });
}

export function useFertilizerHistory(farmId: string = 'all') {
  return useQuery<FertilizerPrescription[]>({
    queryKey: ['fertilizers', farmId],
    queryFn: () => apiFetch<FertilizerPrescription[]>(`/api/fertilizer/history/${farmId}`),
  });
}

// Irrigation Hooks
export function useIrrigationSchedule(farmId: string, cropName: string = 'Tomato') {
  return useQuery<IrrigationSchedule & { farm_name?: string; location_name?: string }>({
    queryKey: ['irrigation', farmId, cropName],
    queryFn: () => apiFetch<any>(`/api/irrigation/schedule/${farmId}?crop_name=${encodeURIComponent(cropName)}`),
    enabled: Boolean(farmId),
  });
}

// Dr. Agro Chat Hooks
export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { conversation_id?: string; farm_id?: string; message: string; language: string }) =>
      apiFetch<any>('/api/chat/message', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['chat-history', data.conversation_id] });
    },
  });
}

export function useConversations() {
  return useQuery<ChatConversation[]>({
    queryKey: ['conversations'],
    queryFn: () => apiFetch<ChatConversation[]>('/api/chat/conversations'),
  });
}

export function useChatHistory(conversationId?: string) {
  return useQuery<{ conversation: ChatConversation; messages: ChatMessage[] }>({
    queryKey: ['chat-history', conversationId],
    queryFn: () => apiFetch<any>(`/api/chat/history/${conversationId}`),
    enabled: Boolean(conversationId),
  });
}
