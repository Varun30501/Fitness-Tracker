import { LockIcon, PersonStandingIcon } from "lucide-react"
import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import api from "../configs/api"
import toast from "react-hot-toast"

const getErrorMessage = (error: unknown, fallback = "Reset failed") => {
  if (typeof error === "object" && error !== null) {
    const maybeError = error as { response?: { data?: { error?: { message?: string } } }; message?: string };
    return maybeError.response?.data?.error?.message || maybeError.message || fallback;
  }

  return fallback;
}

const ResetPassword = () => {

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const code = searchParams.get("code")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setIsSubmitting(true)

    try {
      await api.post("/api/auth/reset-password", {
        code,
        password,
        passwordConfirmation: confirmPassword
      })

      toast.success("Password reset successful")
      setTimeout(() => navigate("/login"), 1500)
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
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Password reset</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
          Reset Password
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Enter your new password below.
        </p>

        <div className="mt-5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            New Password
          </label>

          <div className="relative mt-2">
            <LockIcon className="absolute left-3 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="login-input"
              required
            />
          </div>
        </div>

        <div className="mt-5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Confirm Password
          </label>

          <div className="relative mt-2">
            <LockIcon className="absolute left-3 top-1/2 size-4.5 -translate-y-1/2 text-slate-400" />

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
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
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </main>
  )
}

export default ResetPassword
