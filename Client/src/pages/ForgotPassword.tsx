import { MailIcon, PersonStandingIcon } from "lucide-react"
import { useState } from "react"
import api from "../configs/api"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"

const getErrorMessage = (error: unknown, fallback = "Failed to send email") => {
  if (typeof error === "object" && error !== null) {
    const maybeError = error as { response?: { data?: { error?: { message?: string } } }; message?: string };
    return maybeError.response?.data?.error?.message || maybeError.message || fallback;
  }

  return fallback;
}

const ForgotPassword = () => {

  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitHandler = async (e: React.FormEvent) => {

    e.preventDefault()
    setIsSubmitting(true)

    try {
      await api.post("/api/auth/forgot-password", { email },
        {
          headers: {
            Authorization: undefined,
          },
        }
      )
      toast.success("Reset email sent")
    } catch (err: unknown) {
      toast.error(getErrorMessage(err))
    }

    setIsSubmitting(false)
  }

  return (
    <main className="login-page-container">
      <form onSubmit={submitHandler} className="glass-panel reveal-up login-form rounded-lg p-6 sm:p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-lg bg-linear-to-br from-emerald-400 via-teal-500 to-cyan-500 shadow-lg shadow-emerald-600/25">
            <PersonStandingIcon className="size-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">FitTrack</h1>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Account recovery</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Forgot Password
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Enter your email to receive a password reset link.
        </p>

        <div className="mt-5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Email
          </label>

          <div className="relative mt-2">
            <MailIcon className="absolute left-3 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="login-input"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="login-button"
        >
          {isSubmitting ? "Sending..." : "Send Reset Email"}
        </button>

        <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Remember your password?
          <Link
            to="/login"
            className="ml-1 cursor-pointer font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
          >
            Login
          </Link>
        </p>
      </form>
    </main>
  )
}

export default ForgotPassword
