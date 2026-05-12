import { useAuth } from "../hooks/useAuth.tsx";
import { useEffect } from "react";
import LoadingScreen from "./loadingScreen.tsx";

export default function VerifyRoutes({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/";
    }
  }, [loading, user]);

  if (loading) {
    return (
      <LoadingScreen />
    );
  }

  if (user) {
    return <>{children}</>;
  }
}
