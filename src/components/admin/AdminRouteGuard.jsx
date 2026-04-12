import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAdminSession } from "../../lib/api";

const AdminRouteGuard = () => {
  const [status, setStatus] = useState("checking");
  const location = useLocation();

  useEffect(() => {
    let isActive = true;

    const verify = async () => {
      try {
        await getAdminSession();
        if (isActive) setStatus("authenticated");
      } catch {
        if (isActive) setStatus("unauthenticated");
      }
    };

    verify();
    return () => {
      isActive = false;
    };
  }, [location.pathname]);

  if (status === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm font-semibold text-slate-500">Checking admin session...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default AdminRouteGuard;
