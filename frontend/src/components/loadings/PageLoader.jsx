import { useCallback } from "react";
import { loadingMessages } from "../../utils/constants";

const PageLoader = () => {
    const randomMessage = useCallback(() => loadingMessages[Math.floor(Math.random() * loadingMessages.length)], []);

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-9999 font-inter">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
        <p className="text-xl text-gray-500 tracking-wide">
          {randomMessage()}
        </p>
      </div>
    </div>
  );
};

export default PageLoader;