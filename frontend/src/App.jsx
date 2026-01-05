import { BrowserRouter, Route, Routes } from "react-router-dom";
import MarketDetail from "./pages/user/MarketDetail";
import UserLayout from "./layouts/UserLayout";
import Dashboard from "./pages/user/Dashboard";
import Markets from "./pages/user/Markets";
import Profile from "./pages/user/Profile";
import MyPredictions from "./pages/user/MyPredictions";
import AdminLayouts from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import CreateMarket from "./pages/admin/CreateMarket";
import AdminMarkets from "./pages/admin/AdminMarkets";
import ResolveMarket from "./pages/admin/ResolveMarket";
import Landing from "./pages/public/Landing";
import MetaMaskGuard from "./components/MetaMaskGuard";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route>
            <Route path="/" element={<Landing />} />
          </Route>

          <Route
            path="/app"
            element={
              <MetaMaskGuard>
                <UserLayout />
              </MetaMaskGuard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="markets" element={<Markets />} />
            <Route path="market/:address" element={<MarketDetail />} />
            <Route path="predictions" element={<MyPredictions />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="/admin" element={<AdminLayouts />}>
            <Route index element={<AdminDashboard />} />
            <Route path="create" element={<CreateMarket />} />
            <Route path="markets" element={<AdminMarkets />} />
            <Route path="resolve" element={<ResolveMarket />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
