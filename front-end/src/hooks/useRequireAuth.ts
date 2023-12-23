// hooks/useRequireAuth.ts
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

const useRequireAuth = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirecionar para a página de login
      router.push("/usuario/login");
    }
  }, [isAuthenticated, router]);

  return isAuthenticated;
};

export default useRequireAuth;
