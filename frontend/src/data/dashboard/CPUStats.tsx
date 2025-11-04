// frontend/src/data/dashboard/CPUStats.tsx
import { useEffect, useState } from "react";
import { CPUStatsProps } from "types";

export function useCPUStats() {
  const [stats, setStats] = useState<CPUStatsProps[]>([]);
  const [loading, setLoading] = useState(true);

  // Define API_BASE_URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.warn('No auth token found, skipping CPU stats fetch');
      setLoading(false);
      return;
    }
    
    fetch(`${API_BASE_URL}/reports/cpu_stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('✅ CPU stats fetch success, data:', data);
        console.log(`${API_BASE_URL}/reports/cpu_stats`);
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ CPU stats failed to load:', err);
        console.log(`${API_BASE_URL}/reports/cpu_stats`);
        setLoading(false)
      });
  }, []);

  return { stats, loading };
}