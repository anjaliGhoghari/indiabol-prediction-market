
import WalletButton from "../WalletButton";

export default function AdminTopbar() {
    
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center justify-between px-8">
      <p className="text-sm text-slate-400">
        Platform Control Center
        <span className="text-xs ml-2 text-emerald-400">● Live</span>

      </p>

<div>
      
     

      <span className="text-xs px-3 py-1 ml-5 rounded-full bg-emerald-900 text-emerald-300">
        ADMIN  
      </span>
      </div>
    </header>
  );
}