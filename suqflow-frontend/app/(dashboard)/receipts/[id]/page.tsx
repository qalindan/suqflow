import Link from "next/link";
import { ArrowLeft, CheckCircle2, Lock, Receipt, ShieldCheck, User2 } from "lucide-react";

export default function ReceiptPage({ params }: { params: { id: string } }) {
  // Using params.id safely if needed, but hardcoding for layout mockup
  const fullReceiptNumber = `#REC-2026-08412`; 

  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      {/* Top Navigation Bar */}
      <div className="bg-[#151515] border-b border-sidebar-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-foreground hover:text-white transition-colors cursor-pointer">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-lg font-medium">Active Checkout</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[#4d7019] flex items-center justify-center text-[#151515]">
          <User2 className="w-4 h-4" />
        </div>
      </div>

      <div className="flex flex-col p-8 gap-8 max-w-6xl mx-auto w-full">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted">
            <span className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              <Link href="/" className="hover:text-foreground transition-colors">Dashboard</Link>
            </span>
            <span>/</span>
            <Link href="/sales" className="hover:text-foreground transition-colors">Receipts</Link>
            <span>/</span>
            <span className="text-[#4d7019] font-medium">{fullReceiptNumber}</span>
          </div>
          <Link href="/sales" className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors bg-[#1a1a1a] hover:bg-[#252525] border border-sidebar-border px-4 py-2 rounded-lg">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Transactions</span>
          </Link>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#151515] p-4 rounded-xl border border-sidebar-border shadow-lg">
          <div className="flex items-center gap-4">
            <span className="px-3 py-1.5 rounded-full bg-[#4d7019]/10 text-[#4d7019] border border-[#4d7019]/20 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Paid (Cash)
            </span>
            <span className="text-lg font-semibold text-foreground">Receipt {fullReceiptNumber}</span>
            <span className="px-2.5 py-1 rounded-md bg-[#252525] text-muted text-[10px] font-semibold uppercase tracking-wider">
              Register #01
            </span>
          </div>
          <div className="flex items-center">
            <span className="px-3 py-1.5 rounded-lg bg-[#252525] text-muted border border-sidebar-border text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Read-Only Ledger Entry
            </span>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          
          {/* Left Side: Receipt Paper */}
          <div className="w-full lg:w-[480px] shrink-0 flex flex-col gap-6">
            {/* Receipt Paper Card */}
            <div className="bg-[#1c1c1c] rounded-2xl border border-sidebar-border shadow-2xl p-8 mx-auto w-full max-w-[420px] relative overflow-hidden">
              
              {/* Receipt Header */}
              <div className="text-center flex flex-col items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#4D7019] flex items-center justify-center shadow-lg shadow-[#4D7019]/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4d7019" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                </div>
                <h2 className="text-xl font-bold text-foreground tracking-wide">SuqFlow POS & Retail Solutions</h2>
              </div>
              
              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute w-full border-t border-[#333]"></div>
                <div className="relative bg-[#1c1c1c] px-3 text-muted">
                  <Receipt className="w-4 h-4" />
                </div>
              </div>

              {/* Receipt Meta */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
                <div>
                  <p className="text-[9px] text-shift-muted uppercase font-bold tracking-widest mb-1">Receipt Ref</p>
                  <p className="text-sm text-foreground font-semibold">REC-2026-08412</p>
                </div>
                <div>
                  <p className="text-[9px] text-shift-muted uppercase font-bold tracking-widest mb-1">Date & Time</p>
                  <p className="text-sm text-muted font-medium">Aug 21, 2026 • 14:32 EAT</p>
                </div>
                <div>
                  <p className="text-[9px] text-shift-muted uppercase font-bold tracking-widest mb-1">Register & Lane</p>
                  <p className="text-sm text-muted font-medium">Lane 01 (Main Counter)</p>
                </div>
                <div>
                  <p className="text-[9px] text-shift-muted uppercase font-bold tracking-widest mb-1">Cashier Staff</p>
                  <p className="text-sm text-[#4d7019] font-medium flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded bg-[#4D7019] flex items-center justify-center">
                      <User2 className="w-2.5 h-2.5 text-[#4d7019]" />
                    </span> 
                    Kalkidan
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="mb-8">
                <div className="flex text-[9px] text-shift-muted uppercase font-bold tracking-widest border-b border-[#333] pb-3 mb-4">
                  <div className="flex-1">Item / Description</div>
                  <div className="w-12 text-center">Qty</div>
                  <div className="w-16 text-right">Unit</div>
                  <div className="w-16 text-right">Total</div>
                </div>
                
                <div className="space-y-5">
                  <div className="flex text-sm">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Highland Water (1L)</p>
                      <p className="text-[10px] text-muted mt-0.5">SKU-HL-0198</p>
                    </div>
                    <div className="w-12 text-center text-muted font-medium">2</div>
                    <div className="w-16 text-right text-muted font-medium">25.00</div>
                    <div className="w-16 text-right font-bold text-foreground">50.00</div>
                  </div>
                  <div className="flex text-sm">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Ethiopian Yirgacheffe Coffee</p>
                      <p className="text-[10px] text-muted mt-0.5">Roast 250g Whole Bean</p>
                    </div>
                    <div className="w-12 text-center text-muted font-medium">1</div>
                    <div className="w-16 text-right text-muted font-medium">320.00</div>
                    <div className="w-16 text-right font-bold text-foreground">320.00</div>
                  </div>
                  <div className="flex text-sm">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Local Ambasha Bread</p>
                      <p className="text-[10px] text-muted mt-0.5">Fresh Baked Regular</p>
                    </div>
                    <div className="w-12 text-center text-muted font-medium">3</div>
                    <div className="w-16 text-right text-muted font-medium">15.00</div>
                    <div className="w-16 text-right font-bold text-foreground">45.00</div>
                  </div>
                  <div className="flex text-sm">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">Coca-Cola (330ml)</p>
                      <p className="text-[10px] text-muted mt-0.5">Glass Bottle Deposit</p>
                    </div>
                    <div className="w-12 text-center text-muted font-medium">2</div>
                    <div className="w-16 text-right text-muted font-medium">20.00</div>
                    <div className="w-16 text-right font-bold text-foreground">40.00</div>
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-[#333] pt-5 mb-5">
                <div className="flex justify-between items-center text-xs text-muted mb-6">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">ETB 455.00</span>
                </div>
                
                <div className="flex justify-between items-center py-4 bg-[#131313] px-4 rounded-xl">
                  <span className="text-sm font-bold text-foreground uppercase tracking-wider">Total Due</span>
                  <span className="text-2xl font-bold text-[#4d7019]">ETB 455.00</span>
                </div>
              </div>

              {/* Payment Info Block */}
              <div className="bg-[#222222] rounded-xl p-4 grid grid-cols-3 gap-2 mb-8">
                <div>
                  <p className="text-[9px] text-muted uppercase font-bold tracking-widest mb-1">Tendered</p>
                  <p className="text-xs font-bold text-foreground">ETB 500.00</p>
                </div>
                <div>
                  <p className="text-[9px] text-muted uppercase font-bold tracking-widest mb-1">Change Due</p>
                  <p className="text-xs font-bold text-foreground">ETB 45.00</p>
                </div>
                <div>
                  <p className="text-[9px] text-muted uppercase font-bold tracking-widest mb-1">Drawer</p>
                  <p className="text-[10px] text-foreground font-medium">Cash Drawer #01</p>
                </div>
              </div>
              
              <div className="text-center pb-2">
                <p className="text-[10px] font-medium text-muted">Thank you for shopping with us!</p>
              </div>
            </div>
          </div>

          {/* Right Side: Owner Audit Sidebar */}
          <div className="w-full lg:w-[320px] flex flex-col gap-6">
            {/* Transaction Audit */}
            <div className="bg-[#1c1c1c] rounded-2xl border border-sidebar-border shadow-lg p-6">
              <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-6">
                <ShieldCheck className="w-5 h-5 text-[#4d7019]" />
                Transaction Audit
              </h3>
              
              <div className="flex items-center gap-4 mb-8 p-3 bg-[#131313] rounded-xl border border-sidebar-border">
                <div className="w-10 h-10 rounded-full bg-[#4D7019] flex items-center justify-center text-sm font-bold text-[#4d7019]">
                  K
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Kalkidan T.</p>
                  <p className="text-[10px] text-muted mt-0.5">Shift Lead • Drawer ID: #CR-01</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted">Fiscal Memory Log</span>
                  <span className="text-xs font-medium text-shift-muted">FS-8849-01</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted">Payment Gateway</span>
                  <span className="text-xs font-medium text-shift-muted">Physical Cash In</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted">Verification</span>
                  <span className="text-xs font-medium text-[#4d7019] flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 
                    Audited & Synced
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
