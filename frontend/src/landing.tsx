import { useState } from "react";
import logo from "../src/assets/logo.svg";
import { IconButton } from "./components/buttonVarients";
import LoadingScreen from "./components/loadingScreen";

function Landing() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = () => {
    setLoading(true);
    window.location.href = new URL('/auth/google', import.meta.env.VITE_API_URL).toString();
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <header className="h-20 bg-[#FDFFF1] absolute w-full top-0 left-0 ">
        <div className="container flex flex-row items-center justify-between mx-auto h-full  ">
          <img src={logo} alt="TaskMe Logo" className=" h-5 my-4" />
          <a
            href="https://github.com/yasirulokesha/TaskMe"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-[#2B2D42]  text-white rounded-lg hover:bg-[#2b2b42d1] hover:shadow-xl transition-all font-medium text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-github w-4 h-4"
              aria-hidden="true"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
              <path d="M9 18c-4.51 2-5-2-7-2"></path>
            </svg>
            Star on GitHub
          </a>
        </div>
      </header>
      <div className="absolute -z-10 h-screen w-screen overflow-hidden bg-[url(../src/assets/logo.svg)] bg-repeat-space bg-size-[150%] md:bg-size-[100%] bg-center opacity-10" />
      <main className="container mx-auto h-screen flex flex-col items-center justify-center gap-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#2B2D42]">
          Welcome !
        </h2>
        <img src={logo} alt="TaskMe Logo" className="h-10 md:h-15 my-10" />
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <h2 className="text-md md:text-lg font-bold text-center text-[#2B2D42] w-full md:w-auto">
            Begin the journey here
          </h2>

          <IconButton
            text="Sign in with Google"
            onPress={handleGoogleSignIn}
            icon={
              <svg
                width="18"
                height="20"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.2235 9.0629V13.266H17.3334C16.5345 15.8125 14.3632 17.6352 11.2235 17.6352C7.48456 17.6352 4.4537 14.6641 4.4537 11C4.4537 7.3359 7.48456 4.3648 11.2235 4.3648C12.9044 4.3648 14.4395 4.9687 15.6233 5.9631L18.781 2.8677C16.787 1.0868 14.1343 0 11.2235 0C5.02486 0 0 4.9247 0 11C0 17.0753 5.02486 22 11.2235 22C20.6448 22 22.7241 13.365 21.8006 9.0772L11.2235 9.0629Z"
                  fill="white"
                />
              </svg>
            }
          />
        </div>
        <p className="text-center text-md text-[#2B2D42] max-w-md bottom-0 absolute mb-30">
          It is a simple and convenient task buddy
          <br />
          in your pocket
        </p>
      </main>
      <footer className="h-20 bg-[#FDFFF1] absolute w-full bottom-0 left-0 flex items-center justify-center">
        <p className="text-sm  text-[#2B2D42]">
          &copy; 2026 TaskMe. Proudly made by{" "}
          <a
            href="https://github.com/yasirulokesha/TaskMe"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#2B2D42] font-bold"
          >
            Yasiru Lokesha
          </a>
        </p>
      </footer>
    </>
  );
}

export default Landing;
