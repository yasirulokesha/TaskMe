import { useAuth } from "../hooks/useAuth.tsx";

export default function VerifyRoutes({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    window.location.href = "/";
    return null;
  }

  if (user) {
    return <>{children}</>;
  }
}
