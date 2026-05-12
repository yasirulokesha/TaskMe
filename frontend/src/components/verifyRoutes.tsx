import { useAuth } from "../hooks/useAuth.tsx";
import Logo from "../assets/logo.svg";
import { useEffect } from "react";

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
      <div className="flex items-center flex-col justify-center h-screen bg-[#FDFFF1]">
        <img src={Logo} alt="Loading..." className="w-45 h-30 animate-pulse" />
        <div className="flex ease-in-out duration-300 gap-1 -mt-5">
          <h1 className="text-lg font-black animate-bounce [animation-duration:1150ms]">L</h1>
          <h1 className="text-lg font-black animate-bounce [animation-duration:1160ms]">O</h1>
          <h1 className="text-lg font-black animate-bounce [animation-duration:1170ms]">A</h1>
          <h1 className="text-lg font-black animate-bounce [animation-duration:1180ms]">D</h1>
          <h1 className="text-lg font-black animate-bounce [animation-duration:1190ms]">I</h1>
          <h1 className="text-lg font-black animate-bounce [animation-duration:1200ms]">N</h1>
          <h1 className="text-lg font-black animate-bounce [animation-duration:1210ms]">G</h1>
        </div>
      </div>
    );
  }

  if (user) {
    return <>{children}</>;
  }
}
