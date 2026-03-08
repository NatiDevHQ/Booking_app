import React from 'react'
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { cn } from "../../lib/utils"

interface LoginPageProps {
    onNavigate: (page: 'home' | 'booking' | 'confirmation' | 'admin' | 'login' | 'signup' | 'dashboard') => void
}

const StackIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="M2 17l10 5 10-5"/>
        <path d="M2 12l10 5 10-5"/>
    </svg>
)

export default function LoginPage({ onNavigate }: LoginPageProps) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        <div className="mb-6">
            <StackIcon />
        </div>

        <h1 className="text-2xl font-bold mb-2">Simple Booking</h1>
        <div className="text-zinc-400 text-sm mb-8">
          Don't have an account?{" "}
          <button 
            onClick={() => onNavigate('signup')} 
            className="text-zinc-300 hover:text-white underline underline-offset-4"
          >
            Sign up
          </button>
        </div>

        <div className="w-full space-y-4">
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-white">Email</label>
                <div className="text-[10px] text-zinc-500 mb-1">Use "admin@example.com" for admin view</div>
                <Input 
                    id="email-input"
                    type="email"
                    placeholder="user@example.com"
                    className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                    onChange={(e) => {
                        (window as any)._loginEmail = e.target.value;
                    }}
                />
            </div>
            
            <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-white">Password</label>
                    <a href="#" className="text-xs text-zinc-400 hover:text-white">Forgot password?</a>
                </div>
                <Input 
                    type="password"
                    defaultValue="password123"
                    className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500"
                />
            </div>

            <Button 
                variant="white" 
                className="w-full mt-2 font-medium"
                onClick={() => {
                    const email = (window as any)._loginEmail || "";
                    if (email.includes('admin')) {
                        onNavigate('admin');
                    } else {
                        onNavigate('home');
                    }
                }}
            >
                Sign In
            </Button>
        </div>
      </div>
    </div>
  )
}