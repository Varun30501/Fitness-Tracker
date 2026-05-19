// pages/Login.tsx
import { ActivityIcon, AtSignIcon, BotIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon, PersonStandingIcon, SparklesIcon, UtensilsIcon } from "lucide-react"
import React, { useState } from "react"
import { useAppContext } from "../context/AppContext"
import { Toaster } from "react-hot-toast"
import { Link } from "react-router-dom"

const Login = () => {

    const [state, setState] = useState('login')
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const { login, signup } = useAppContext()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        if (state === "login") {
            await login({ email, password })
        } else {
            await signup({ username, email, password })
        }
        setIsSubmitting(false)
    }

    return (
        <>
            <Toaster />
            <main className="login-page-container">
                <section className="w-full max-w-md">
                    <div className="glass-panel reveal-up rounded-lg p-5 sm:p-6">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-linear-to-br from-emerald-400 via-teal-500 to-cyan-500 shadow-lg shadow-emerald-600/25">
                                <PersonStandingIcon className="size-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white">FitTrack</h1>
                                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Nutrition OS</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {state === 'login' ? "Sign In" : "Create Account"}
                            </h2>
                            <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                                {state === 'login' ? 'Log meals, movement, and calories from one focused dashboard.'
                                    : 'Start tracking your nutrition and workouts with a personalized profile.'}
                            </p>

                            <div className="mt-4 rounded-lg border border-emerald-200/70 bg-emerald-500/10 p-3 dark:border-emerald-500/20">
                                <div className="mb-2 flex items-center gap-2">
                                    <SparklesIcon className="size-4 text-emerald-500" />
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Smart fitness log</p>
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    <div className="rounded-lg bg-white/60 px-2 py-1.5 dark:bg-slate-800/60">
                                        <UtensilsIcon className="mx-auto mb-1 size-4 text-emerald-500" />
                                        Food
                                    </div>
                                    <div className="rounded-lg bg-white/60 px-2 py-1.5 dark:bg-slate-800/60">
                                        <ActivityIcon className="mx-auto mb-1 size-4 text-cyan-500" />
                                        Activity
                                    </div>
                                    <div className="rounded-lg bg-white/60 px-2 py-1.5 dark:bg-slate-800/60">
                                        <BotIcon className="mx-auto mb-1 size-4 text-orange-500" />
                                        AI
                                    </div>
                                </div>
                            </div>

                            {state !== 'login' && (
                                <div className="mt-4">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Username</label>
                                    <div className="relative mt-1.5">
                                        <AtSignIcon className="absolute left-3 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
                                        <input onChange={(e) => setUsername(e.target.value)}
                                            value={username}
                                            type="text" placeholder="Enter a username"
                                            className="login-input" required />
                                    </div>
                                </div>
                            )}

                            <div className="mt-4">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
                                <div className="relative mt-1.5">
                                    <MailIcon className="absolute left-3 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
                                    <input onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        type="email" placeholder="you@example.com"
                                        className="login-input" required />
                                </div>
                            </div>

                            <div className="mt-4">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Password
                                </label>

                                <div className="relative mt-1.5">
                                    <LockIcon className="absolute left-3 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />

                                    <input
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        placeholder="Enter your password"
                                        className="login-input pr-10"
                                        required
                                        type={showPassword ? "text" : "password"}
                                    />

                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-700 dark:hover:text-slate-200"
                                        onClick={() => setShowPassword((p) => !p)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
                                    </button>
                                </div>

                                {state === 'login' && (
                                    <div className="mt-2 flex justify-end">
                                        <Link
                                            to="/forgot-password"
                                            className="text-sm font-semibold text-emerald-600 transition-colors hover:text-emerald-700 dark:text-emerald-400"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <button type="submit" disabled={isSubmitting}
                                className="login-button">
                                {isSubmitting ? (state === "login" ? "Signing in..." : "Creating account...") : state === "login" ?
                                    'Login' : 'Sign Up'}
                            </button>

                            {state === 'login'
                                ? (
                                    <p className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                                        Don't have an account?
                                        <button type="button" onClick={() => setState('sign-up')}
                                            className="ml-1 cursor-pointer font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">Sign up</button>
                                    </p>
                                )
                                :
                                (
                                    <p className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                                        Already have an account?
                                        <button type="button" onClick={() => setState('login')}
                                            className="ml-1 cursor-pointer font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">Login</button>
                                    </p>
                                )}
                        </form>
                    </div>

                </section>
            </main>
        </>
    )
}

export default Login
