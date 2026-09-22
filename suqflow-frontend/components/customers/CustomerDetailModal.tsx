import { X, ShieldCheck, Clock } from "lucide-react";
import { CustomerData } from "./DebtSettlementModal";

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettleDebt: (customer: CustomerData) => void;
  customer: CustomerData | null;
}

export function CustomerDetailModal({ isOpen, onClose, onSettleDebt, customer }: CustomerDetailModalProps) {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Slide-over Panel */}
      <div className="relative w-full max-w-[672px] h-full bg-[#131313] border-l border-[#2a2a2a] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header Section */}
        <div className="p-8 pb-6">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 text-muted hover:text-foreground transition-colors p-2 rounded-full hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#1c1c1c] border border-[#2a2a2a] flex items-center justify-center text-xl font-bold text-[#AAD471]">
              {customer.initials}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-foreground">{customer.name}</h2>
                {customer.isOwed && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#93000A]/20 text-red-400 border border-[#93000A]/30 flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-red-400"></div>
                    Owes Money
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground mt-1">{customer.phone}</p>
              <p className="text-[10px] text-muted mt-1 font-medium">Customer Since: Jan 2026 · Account #CUST-0842</p>
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-[#1c0f0f] border border-[#93000A]/30 rounded-xl p-5 mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-bold text-[#a44] uppercase tracking-wider mb-1">
                  Current Balance (Unsettled Credit / Liq)
                </p>
                <p className="text-3xl font-bold text-white">{customer.balance}</p>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-black/40 border border-[#2a2a2a] flex items-center gap-1.5 text-xs text-muted">
                <ShieldCheck className="w-3.5 h-3.5 text-[#AAD471]" />
                Credit Limit: ETB 2,500.00
              </div>
            </div>
            
            {customer.isOwed && (
              <button 
                onClick={() => onSettleDebt(customer)}
                className="w-full py-3 rounded-lg bg-[#4D7019] hover:bg-[#5c851e] text-white text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Settle Debt
              </button>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-[#2a2a2a]"></div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-8 pt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#AAD471" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              Internal Shop Credit History (Liq / Nisiya)
            </h3>
            <span className="px-2 py-1 rounded bg-[#1a1a1a] text-[10px] text-muted border border-[#2a2a2a]">
              5 records
            </span>
          </div>
          <p className="text-[10px] text-muted mb-6">Chronological store tab transactions. Excludes external banking/cards.</p>

          <div className="flex flex-col">
            <div className="flex text-[10px] text-shift-muted uppercase font-bold tracking-widest pb-3 border-b border-[#2a2a2a] mb-2">
              <div className="w-32">Date & Time</div>
              <div className="flex-1">Action & Details</div>
              <div className="w-28 text-right">Amount</div>
              <div className="w-32 text-right">Running Balance</div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-start text-sm">
                <div className="w-32">
                  <p className="text-foreground">18 Feb 2026</p>
                  <p className="text-[10px] text-muted mt-0.5">11:20 AM</p>
                </div>
                <div className="flex-1">
                  <p className="text-red-400 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    Credit Purchase
                  </p>
                  <p className="text-[10px] text-muted mt-0.5">Goods: Teff flour, Cooking oil</p>
                </div>
                <div className="w-28 text-right font-medium text-red-400">- ETB 250.00</div>
                <div className="w-32 text-right text-muted">- ETB 450.00</div>
              </div>

              <div className="flex items-start text-sm">
                <div className="w-32">
                  <p className="text-foreground">14 Feb 2026</p>
                  <p className="text-[10px] text-muted mt-0.5">04:15 PM</p>
                </div>
                <div className="flex-1">
                  <p className="text-red-400 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    Credit Purchase
                  </p>
                  <p className="text-[10px] text-muted mt-0.5">Goods: Spices, Sugar</p>
                </div>
                <div className="w-28 text-right font-medium text-red-400">- ETB 200.00</div>
                <div className="w-32 text-right text-muted">- ETB 200.00</div>
              </div>

              <div className="flex items-start text-sm">
                <div className="w-32">
                  <p className="text-foreground">02 Feb 2026</p>
                  <p className="text-[10px] text-muted mt-0.5">09:30 AM</p>
                </div>
                <div className="flex-1">
                  <p className="text-[#AAD471] font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#AAD471]"></span>
                    Debt Settlement
                  </p>
                  <p className="text-[10px] text-muted mt-0.5">Cash Reconciled by Abebe K.</p>
                </div>
                <div className="w-28 text-right font-medium text-[#AAD471]">+ ETB 650.00</div>
                <div className="w-32 text-right text-muted">ETB 0.00</div>
              </div>

              <div className="flex items-start text-sm">
                <div className="w-32">
                  <p className="text-foreground">28 Jan 2026</p>
                  <p className="text-[10px] text-muted mt-0.5">02:45 PM</p>
                </div>
                <div className="flex-1">
                  <p className="text-red-400 font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                    Credit Purchase
                  </p>
                  <p className="text-[10px] text-muted mt-0.5">Goods: Highland Water pack</p>
                </div>
                <div className="w-28 text-right font-medium text-red-400">- ETB 650.00</div>
                <div className="w-32 text-right text-muted">- ETB 650.00</div>
              </div>

              <div className="flex items-start text-sm">
                <div className="w-32">
                  <p className="text-foreground">15 Jan 2026</p>
                  <p className="text-[10px] text-muted mt-0.5">10:00 AM</p>
                </div>
                <div className="flex-1">
                  <p className="text-[#AAD471] font-medium flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#AAD471]"></span>
                    Debt Settlement
                  </p>
                  <p className="text-[10px] text-muted mt-0.5">Full settlement</p>
                </div>
                <div className="w-28 text-right font-medium text-[#AAD471]">+ ETB 400.00</div>
                <div className="w-32 text-right text-muted">ETB 0.00</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#2a2a2a] bg-[#1a1a1a] p-4 flex justify-between items-center text-xs text-muted">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#AAD471" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>Total Lifetime Credit: ETB 1,500.00</span>
          </div>
          <div className="flex items-center gap-2 text-[#AAD471]">
            <Clock className="w-3.5 h-3.5" />
            <span>Settlement Rate: 100% on time</span>
          </div>
        </div>
        
      </div>
    </div>
  );
}
