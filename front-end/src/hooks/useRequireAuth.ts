// hooks/useRequireAuth.ts
import { ReactNode, createElement, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

type ChildrenType = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ChildrenType) => {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirecionar para a página de login
      router.push("/usuario/login");
    }
  }, [isAuthenticated, router]);

  if (loading) {
    return createElement("div", null, "Carregando...");
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
