import { LockIcon } from "lucide-react"
import { useState } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import axios from "axios"
import toast from "react-hot-toast"

const ResetPassword = () => {

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const code = searchParams.get("code")
  console.log("Reset code:", code)

  const [password,setPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")
  const [isSubmitting,setIsSubmitting] = useState(false)

  const submitHandler = async (e:React.FormEvent)=>{

    e.preventDefault()

    if(password !== confirmPassword){
      toast.error("Passwords do not match")
      return
    }

    setIsSubmitting(true)

    try{

      await axios.post("/api/auth/reset-password",{
        code,
        password,
        passwordConfirmation: confirmPassword
      })

      toast.success("Password reset successful")

      setTimeout(()=>navigate("/login"),1500)

    }catch(err:any){

      toast.error(err.response?.data?.error?.message || "Reset failed")

    }

    setIsSubmitting(false)

  }

  return (

    <main className="login-page-container">

      <form onSubmit={submitHandler} className="login-form">

        <h2 className="text-3xl font-medium text-gray-900 dark:text-white">
          Reset Password
        </h2>

        <p className="mt-2 text-sm text-gray-500/90 dark:text-gray-400">
          Enter your new password below.
        </p>

        {/* New Password */}
        <div className="mt-4">

          <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
            New Password
          </label>

          <div className="relative mt-2">

            <LockIcon
              className="absolute left-3 top-1/2 -translate-y-1/2
              text-gray-400 size-4.5"
            />

            <input
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              placeholder="Enter new password"
              className="login-input"
              required
            />

          </div>

        </div>

        {/* Confirm Password */}
        <div className="mt-4">

          <label className="font-medium text-sm text-gray-700 dark:text-gray-300">
            Confirm Password
          </label>

          <div className="relative mt-2">

            <LockIcon
              className="absolute left-3 top-1/2 -translate-y-1/2
              text-gray-400 size-4.5"
            />

            <input
              type="password"
              value={confirmPassword}
              onChange={(e)=>setConfirmPassword(e.target.value)}
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