import { Outlet } from "react-router-dom";
import Sidebar from "../components/navigation/Sidebar";
import Topbar from "../components/navigation/Topbar";
import { useEffect, useState } from "react";

export default function UserLayout() {
  const [account, setAccount] = useState("");

  const checkWallet = async () => {
   
    const accounts = await window.ethereum.request({
      method: "eth_accounts",
    });

    if (accounts.length > 0) {
      setAccount(accounts[0]);
    } else {
      setAccount("");
    }
  };

  useEffect(() => {
    Promise.resolve().then(checkWallet);
  }, []);

  // useEffect(() => {
  //   if (!window.ethereum) return;

  //   const handleAccountsChanged = (accounts) => {
  //     setAccount(accounts[0] || "");
  //   };

  //   const handleChainChanged = () => {
  //     window.location.reload(); // safest
  //   };

  //   window.ethereum.on("accountsChanged", handleAccountsChanged);
  //   window.ethereum.on("chainChanged", handleChainChanged);

  //   return () => {
  //     window.ethereum.removeListener(
  //       "accountsChanged",
  //       handleAccountsChanged
  //     );
  //     window.ethereum.removeListener(
  //       "chainChanged",
  //       handleChainChanged
  //     );
  //   };
  // }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Topbar account={account} />

        <main className="flex-1 px-6 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
