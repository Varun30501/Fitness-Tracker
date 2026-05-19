import { Loader2Icon } from "lucide-react"


const Loading = () => {
  return (
    <div className="grid h-screen place-items-center bg-transparent">
        <div className="glass-panel reveal-scale flex items-center gap-3 rounded-lg px-5 py-4">
            <Loader2Icon className="h-6 w-6 animate-spin text-emerald-500" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Loading FitTrack</span>
        </div>
    </div>
  )
}

export default Loading
