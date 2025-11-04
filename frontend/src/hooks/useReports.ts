// frontend/src/hooks/useReports.ts
import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function useReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem('authToken');
      
      console.log('🔄 useReports hook: fetching reports', { 
        hasToken: !!token, 
        isAuthenticated, 
        hasUser: !!user 
      });
      
      if (!token || !isAuthenticated || !user) {
        console.warn('❌ useReports hook: Missing auth requirements, skipping fetch');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reports`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ useReports hook: Reports fetched successfully:', data.length, 'reports');
        setReports(data);
      } catch (err) {
        console.error("❌ useReports hook: Failed to load reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [isAuthenticated, user]);

  return { reports, loading };
}
