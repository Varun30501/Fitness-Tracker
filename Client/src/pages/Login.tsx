// pages/Login.tsx
import { AtSignIcon, BotIcon, EyeIcon, EyeOffIcon, LockIcon, MailIcon, PersonStandingIcon } from "lucide-react"
import React, { useState } from "react"
import { useAppContext } from "../context/AppContext"
import { Toaster } from "react-hot-toast"
import { Link } from "react-router-dom"
import headerImg from "../assets/header_img.png"

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
                <section className="grid w-full max-w-5xl overflow-hidden rounded-lg lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="glass-panel reveal-up rounded-lg p-6 sm:p-8">
                        <div className="mb-8 flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-lg bg-linear-to-br from-emerald-400 via-teal-500 to-cyan-500 shadow-lg shadow-emerald-600/25">
                                <PersonStandingIcon className="size-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">FitTrack</h1>
                                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Nutrition OS</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="login-form">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                                {state === 'login' ? "Sign In" : "Create Account"}
                            </h2>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                                {state === 'login' ? 'Log meals, movement, and calories from one focused dashboard.'
                                    : 'Start tracking your nutrition and workouts with a personalized profile.'}
                            </p>

                            {state !== 'login' && (
                                <div className="mt-5">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Username</label>
                                    <div className="relative mt-2">
                                        <AtSignIcon className="absolute left-3 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
                                        <input onChange={(e) => setUsername(e.target.value)}
                                            value={username}
                                            type="text" placeholder="Enter a username"
                                            className="login-input" required />
                                    </div>
                                </div>
                            )}

                            <div className="mt-5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
                                <div className="relative mt-2">
                                    <MailIcon className="absolute left-3 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />
                                    <input onChange={(e) => setEmail(e.target.value)}
                                        value={email}
                                        type="email" placeholder="you@example.com"
                                        className="login-input" required />
                                </div>
                            </div>

                            <div className="mt-5">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                    Password
                                </label>

                                <div className="relative mt-2">
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
                                    <div className="mt-3 flex justify-end">
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
                                    <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                                        Don't have an account?
                                        <button type="button" onClick={() => setState('sign-up')}
                                            className="ml-1 cursor-pointer font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">Sign up</button>
                                    </p>
                                )
                                :
                                (
                                    <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                                        Already have an account?
                                        <button type="button" onClick={() => setState('login')}
                                            className="ml-1 cursor-pointer font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">Login</button>
                                    </p>
                                )}
                        </form>
                    </div>

                    <aside className="relative hidden overflow-hidden rounded-lg border border-white/70 bg-slate-950 p-8 text-white shadow-2xl shadow-emerald-950/25 lg:block">
                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm font-semibold backdrop-blur-xl">
                                    <BotIcon className="size-4 text-cyan-300" />
                                    AI food logging ready
                                </div>
                                <h2 className="mt-6 text-4xl font-bold">Smarter tracking, calmer decisions.</h2>
                                <p className="mt-3 text-sm text-slate-300">
                                    A focused dashboard for meals, activity, calories, and daily goals.
                                </p>
                            </div>
                            <img src={headerImg} alt="FitTrack assistant" className="mx-auto max-h-72 w-auto drop-shadow-2xl" />
                            <div className="grid grid-cols-3 gap-3 text-center text-sm">
                                <div className="rounded-lg bg-white/10 p-3 backdrop-blur-xl">
                                    <p className="font-bold text-emerald-300">Meals</p>
                                    <p className="text-xs text-slate-300">logged</p>
                                </div>
                                <div className="rounded-lg bg-white/10 p-3 backdrop-blur-xl">
                                    <p className="font-bold text-cyan-300">Moves</p>
                                    <p className="text-xs text-slate-300">tracked</p>
                                </div>
                                <div className="rounded-lg bg-white/10 p-3 backdrop-blur-xl">
                                    <p className="font-bold text-orange-300">Burn</p>
                                    <p className="text-xs text-slate-300">balanced</p>
                                </div>
                            </div>
                        </div>
                    </aside>
                </section>
            </main>
        </>
    )
}

export default Login
