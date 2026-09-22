"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MailOpen, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function VerifyPage() {
  const router = useRouter();
  
  const [passcode, setPasscode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate verification or integrate real endpoint when ready
    try {
      await new Promise(r => setTimeout(r, 1000)); // Simulated network request
      
      if (passcode.length !== 6) {
        throw new Error("Passcode must be exactly 6 digits.");
      }
      
      toast.success("Email verified successfully!");
      router.push("/");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-[440px]">
        
        {/* Card with subtle green-to-dark gradient */}
        <div className="bg-gradient-to-b from-[#2a301c] to-[#161616] rounded-3xl p-8 sm:p-10 flex flex-col items-center">
          
          <div className="w-14 h-14 bg-[#111111] border border-[#3a402d] rounded-xl flex items-center justify-center mb-6 shadow-sm">
            <MailOpen className="w-7 h-7 text-[#4d7019]" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Verify Your Email</h1>
          <p className="text-[15px] text-[#a0a0a0] mb-10 text-center">SUQFlow POS Management</p>

          <form onSubmit={handleVerify} className="w-full space-y-6">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-500 font-medium">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <label className="text-[13px] font-semibold text-[#c4c9b6] text-center block">Enter 6-Digit Passcode</label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value.replace(/[^0-9]/g, ''))}
                  required
                  autoComplete="one-time-code"
                  className="w-full bg-[#131313] border border-[#44493a] rounded-xl py-5 px-4 text-2xl text-white placeholder:text-[#555555] focus:outline-none focus:border-[#5a8c2a] focus:ring-1 focus:ring-[#5a8c2a] transition-all text-center tracking-[0.5em] font-mono"
                  placeholder="------"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || passcode.length !== 6}
              className="w-full bg-[#4b761c] hover:bg-[#5a8c2a] text-white py-4 rounded-xl text-[13px] font-bold tracking-widest transition-all mt-8 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  VERIFY
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
