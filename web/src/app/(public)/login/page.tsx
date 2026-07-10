'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { login, signup } from './actions'

function LoginContent() {
    const searchParams = useSearchParams()
    const [isLogin, setIsLogin] = useState(true)

    useEffect(() => {
        if (searchParams.get('mode') === 'signup') {
            setIsLogin(false)
        } else {
            setIsLogin(true)
        }
    }, [searchParams])

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
            </div>

            <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-800 p-8 shadow-2xl z-10 transition-all duration-300">

                {/* Toggle Switches */}
                <div className="flex bg-zinc-950 rounded-xl p-1 mb-8 shadow-inner border border-zinc-800/50">
                    <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${isLogin ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Log In
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${!isLogin ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
                        {isLogin ? 'Welcome Back' : 'Create an Account'}
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        {isLogin
                            ? 'Enter your email and password to access your dashboard.'
                            : 'Sign up to get started and provision your environment.'}
                    </p>
                </div>

                <form className="space-y-4 flex flex-col">

                    {!isLogin && (
                        <>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-zinc-300 ml-1" htmlFor="name">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required={!isLogin}
                                    className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-zinc-500"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-zinc-300 ml-1" htmlFor="company">
                                    Company Name
                                </label>
                                <input
                                    id="company"
                                    name="company"
                                    type="text"
                                    required={!isLogin}
                                    className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-zinc-500"
                                    placeholder="Acme Inc."
                                />
                            </div>
                        </>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-300 ml-1" htmlFor="email">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-white placeholder-zinc-500"
                            placeholder="you@company.com"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-zinc-300 ml-1" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-3 bg-zinc-950/50 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-white placeholder-zinc-500"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="pt-4">
                        {isLogin ? (
                            <button
                                formAction={login}
                                className="w-full py-3.5 px-4 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold rounded-xl transition-all shadow-lg shadow-white/10 active:scale-[0.98]"
                            >
                                Sign In &rarr;
                            </button>
                        ) : (
                            <button
                                formAction={signup}
                                className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98]"
                            >
                                Sign Up
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4 text-white">
                Loading...
            </div>
        }>
            <LoginContent />
        </Suspense>
    )
}

