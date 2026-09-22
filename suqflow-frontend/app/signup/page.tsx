"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = "/api/auth/signup";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Signup failed");
      }
      
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#131313] p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">SuqFlow</h1>
          <p className="text-sm text-gray-400">Create your retail management account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white focus:border-primary focus:outline-none"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white focus:border-primary focus:outline-none"
              placeholder="admin@suqflow.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white focus:border-primary focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Confirm Password</label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white focus:border-primary focus:outline-none"
              placeholder="••••••••"
            />
          </div>



          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full mt-2 items-center justify-center rounded-lg bg-[#4d7019] hover:bg-[#3a5413] text-white px-4 py-3 font-semibold transition-colors disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign Up"}
          </button>
        </form>
        
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account? <a href="/login" className="text-[#4d7019] hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  );
}
