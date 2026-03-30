import { MailIcon } from "lucide-react"
import { useState } from "react"
import api from "../configs/api"
import toast from "react-hot-toast"
import { Link } from "react-router-dom"

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

    } catch (err: any) {

      toast.error(err.response?.data?.error?.message || "Failed to send email")

    }

    setIsSubmitting(false)

  }

  return (

    <main className="login-page-container">

      <form onSubmit={submitHandler} className="login-form">

        <h2 className="text-3xl font-medium text-gray-900 dark:text-white">
          Forgot Password
        </h2>

        <p className="mt-2 text-sm text-gray-500/90 dark:text-gray-400">
          Enter your email to receive a password reset link.
        </p>

        <div className="mt-4">

          <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
            Email
          </label>

          <div className="relative mt-2">

            <MailIcon
              className="absolute left-3 top-1/2 -translate-y-1/2
              text-gray-400 size-4.5"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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

        <p className="text-center py-6 text-sm text-gray-500 dark:text-gray-400">
          Remember your password?
          <Link
            to="/login"
            className="ml-1 cursor-pointer text-green-600 hover:underline"
          >
            Login
          </Link>
        </p>

      </form>

    </main>

  )
}

export default ForgotPassword