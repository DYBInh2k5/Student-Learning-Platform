import { useState, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async (
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any,
    headers?: Record<string, string>
  ) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const baseHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...headers,
      };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: baseHeaders,
        body: body ? JSON.stringify(body) : undefined,
      });

      const contentType = response.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await response.json()
        : { success: false, message: 'Invalid server response' };

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Request failed');
      }

      return data.data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error };
};
