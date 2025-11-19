'use client';

import { useState, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function useApi<T>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const request = useCallback(async (
    endpoint: string,
    options?: RequestInit
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, error, loading, request };
}

// Specific API hooks
export function useDiagnostics() {
  const { request, ...rest } = useApi();

  const analyzeClinicalNotes = useCallback(
    (patientId: string, clinicalNotes: string) =>
      request('/diagnostics/analyze', {
        method: 'POST',
        body: JSON.stringify({ patientId, clinicalNotes }),
      }),
    [request]
  );

  return { ...rest, analyzeClinicalNotes };
}

export function usePatients() {
  const { request, ...rest } = useApi();

  const getPatients = useCallback(() => request('/patients'), [request]);

  const getPatient = useCallback(
    (id: string) => request(`/patients/${id}`),
    [request]
  );

  const createPatient = useCallback(
    (patientData: any) =>
      request('/patients', {
        method: 'POST',
        body: JSON.stringify(patientData),
      }),
    [request]
  );

  return { ...rest, getPatients, getPatient, createPatient };
}

