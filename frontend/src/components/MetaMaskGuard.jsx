import { Navigate } from "react-router-dom";

export default function MetaMaskGuard({ children }) {
  if (!window.ethereum) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">MetaMask Required</h1>
        <p className="text-gray-500 mt-2">
          Please install MetaMask to use this app.
        </p>
        <a
          href="https://metamask.io/download/"
          target="_blank"
          rel="noreferrer"
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded"
        >
          Install MetaMask
        </a>
      </div>
    );
  }

  return children;
}
