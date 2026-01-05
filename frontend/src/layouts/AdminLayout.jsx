import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";
import { useEffect, useState } from "react";
import { getMarketFactory } from "../hooks/useMarketFactory";
export default function AdminLayouts() {
  const [account, setAccount] = useState();
  const [loading, setLoading] = useState(true);
  const [owner, setOwner] = useState();

  const connectWallet = async () => {
    if (!window.ethereum) return;

    try {
      const [acc] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(acc);

      const factory = await getMarketFactory();
      const ownerAddr = await factory.owner();
      setOwner(ownerAddr);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);
  useEffect(() => {
  if (!window.ethereum) return;

  const handler = () => connectWallet();
  window.ethereum.on("accountsChanged", handler);

  return () => {
    window.ethereum.removeListener("accountsChanged", handler);
  };
}, []);
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-200">
      Checking admin access…
    </div>
  );
}
  const isAdmin =
    account && owner && account.toLowerCase() === owner.toLowerCase();
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
        <h1 className="text-9xl font-extrabold text-gray-800 tracking-widest">
          403
        </h1>
        <div className="bg-red-600 text-white px-2 text-sm rounded rotate-12 absolute">
          Access Denied
        </div>
        <p className="text-2xl md:text-3xl font-bold text-gray-700 mt-6">
          Oops! You are not Admin.
        </p>
        <p className="text-gray-500 mt-2 text-center">
          The page you are trying to access has restricted access.
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-200">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar />
        <main className="flex-1 px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
