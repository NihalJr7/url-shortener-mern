import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RedirectPage = () => {
  const { shortCode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const redirectUser = () => {
      // Get the backend API URL (e.g. https://my-backend.onrender.com/api)
      // and strip the /api part to get the base backend URL
      let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      // If apiUrl doesn't end with /api, we'll assume it's just the base URL
      const backendBaseUrl = apiUrl.endsWith('/api') ? apiUrl.slice(0, -4) : apiUrl;
      
      // Redirect the browser to the backend's redirect endpoint.
      // The backend will track the click and perform a 301 redirect to the original URL.
      window.location.href = `${backendBaseUrl}/${shortCode}`;
    };

    redirectUser();
  }, [shortCode, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 dark:bg-surface-900">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-sm text-surface-500 dark:text-surface-400">Redirecting to your destination...</p>
      </div>
    </div>
  );
};

export default RedirectPage;
