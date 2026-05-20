import { useMemo, useRef, useState } from "react"
import type { FormEvent } from "react"
import {
    BotIcon,
    BrainCircuitIcon,
    CalendarCheckIcon,
    CameraIcon,
    FlameIcon,
    HeartPulseIcon,
    LightbulbIcon,
    MessageCircleIcon,
    SendIcon,
    ShieldCheckIcon,
    SparklesIcon,
    TargetIcon,
    TrendingUpIcon,
    UtensilsIcon,
} from "lucide-react"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import { useAppContext } from "../context/AppContext"
import api from "../configs/api"

type CoachMessage = {
    id: number;
    role: "assistant" | "user";
    text: string;
}

type CoachContext = {
    totalCalories: number;
    caloriesBurned: number;
    activeMinutes: number;
    mealsLogged: number;
    workoutsLogged: number;
    calorieGoal: number;
    burnGoal: number;
    remainingCalories: number;
}

type InfoTab = "about" | "features"

const quickPrompts = [
    "Review my day",
    "Suggest dinner",
    "Workout nudge",
    "Protein ideas",
]

const coachFeatureRows = [
    {
        title: "Food Snap",
        text: "Use meal photos as a starting point for faster food entries.",
        icon: CameraIcon,
        color: "bg-emerald-500/10 text-emerald-500",
    },
    {
        title: "Daily Review",
        text: "Turn today's meals and activity into a simple progress summary.",
        icon: TrendingUpIcon,
        color: "bg-cyan-500/10 text-cyan-500",
    },
    {
        title: "Goal Nudges",
        text: "Suggest small next steps based on intake, burn, and consistency.",
        icon: TargetIcon,
        color: "bg-orange-500/10 text-orange-500",
    },
]

const getErrorMessage = (error: unknown, fallback = "FitCoach could not respond right now.") => {
    if (typeof error === "object" && error !== null) {
        const maybeError = error as { response?: { data?: { error?: { message?: string } } }; message?: string };
        return maybeError.response?.data?.error?.message || maybeError.message || fallback;
    }

    return fallback;
}

const AiCoach = () => {
    const { user, allFoodLogs, allActivityLogs } = useAppContext()
    const [input, setInput] = useState("")
    const [infoTab, setInfoTab] = useState<InfoTab>("about")
    const [isThinking, setIsThinking] = useState(false)
    const messageIdRef = useRef(2)

    const today = new Date().toISOString().split("T")[0]
    const todaysFood = allFoodLogs.filter((entry) => entry.createdAt?.split("T")[0] === today)
    const todaysActivities = allActivityLogs.filter((entry) => entry.createdAt?.split("T")[0] === today)

    const context: CoachContext = useMemo(() => {
        const calorieGoal = user?.dailyCalorieIntake || 2000
        const burnGoal = user?.dailyCalorieBurn || 400
        const totalCalories = todaysFood.reduce((sum, item) => sum + item.calories, 0)
        const caloriesBurned = todaysActivities.reduce((sum, item) => sum + (item.calories || 0), 0)
        const activeMinutes = todaysActivities.reduce((sum, item) => sum + item.duration, 0)

        return {
            totalCalories,
            caloriesBurned,
            activeMinutes,
            mealsLogged: todaysFood.length,
            workoutsLogged: todaysActivities.length,
            calorieGoal,
            burnGoal,
            remainingCalories: calorieGoal - totalCalories,
        }
    }, [todaysActivities, todaysFood, user?.dailyCalorieBurn, user?.dailyCalorieIntake])

    const [messages, setMessages] = useState<CoachMessage[]>([
        {
            id: 1,
            role: "assistant",
            text: "I can help you review today, choose a meal, plan a workout, or prepare a support question.",
        },
    ])

    const sendPrompt = async (prompt: string) => {
        const trimmedPrompt = prompt.trim()
        if (!trimmedPrompt || isThinking) return
        const userMessageId = messageIdRef.current + 1
        const coachMessageId = messageIdRef.current + 2
        messageIdRef.current = coachMessageId

        const userMessage: CoachMessage = {
            id: userMessageId,
            role: "user",
            text: trimmedPrompt,
        }

        const history = [...messages, userMessage].slice(-8).map((message) => ({
            role: message.role,
            text: message.text,
        }))

        setMessages((prev) => [...prev, userMessage])
        setInput("")
        setIsThinking(true)

        try {
            const { data } = await api.post("/api/ai-coach", {
                prompt: trimmedPrompt,
                context,
                history,
            })

            const coachMessage: CoachMessage = {
                id: coachMessageId,
                role: "assistant",
                text: data?.reply || "I could not generate a reply right now. Try again in a moment.",
            }

            setMessages((prev) => [...prev, coachMessage])
        } catch (error: unknown) {
            const coachMessage: CoachMessage = {
                id: coachMessageId,
                role: "assistant",
                text: getErrorMessage(error),
            }

            setMessages((prev) => [...prev, coachMessage])
        } finally {
            setIsThinking(false)
        }
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        void sendPrompt(input)
    }

    const insightCards = [
        {
            label: "Intake",
            value: `${context.totalCalories}/${context.calorieGoal}`,
            helper: "kcal",
            icon: UtensilsIcon,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
        },
        {
            label: "Burn",
            value: `${context.caloriesBurned}/${context.burnGoal}`,
            helper: "kcal",
            icon: FlameIcon,
            color: "text-orange-500",
            bg: "bg-orange-500/10",
        },
        {
            label: "Activity",
            value: `${context.activeMinutes}`,
            helper: "minutes",
            icon: HeartPulseIcon,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
        },
    ]

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase text-cyan-600 dark:text-cyan-400">AI Helper</p>
                        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">FitCoach</h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Daily guidance, support prompts, and health habit nudges.</p>
                    </div>
                    <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-cyan-200/70 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-700 dark:border-cyan-500/20 dark:text-cyan-300">
                        <SparklesIcon className="size-4" />
                        Gemini-powered
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl p-4 lg:grid lg:grid-cols-[minmax(0,0.95fr)_360px] lg:gap-6 lg:p-6">
                <Card className="flex min-h-[500px] max-h-[580px] flex-col">
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-lg bg-cyan-500/10">
                            <BotIcon className="size-6 text-cyan-500" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-slate-900 dark:text-white">Coach Chat</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Based on today's local app data.</p>
                        </div>
                    </div>

                    <div className="mb-3 flex flex-wrap gap-2">
                        {quickPrompts.map((prompt) => (
                            <button
                                key={prompt}
                                onClick={() => { void sendPrompt(prompt) }}
                                disabled={isThinking}
                                className="rounded-lg border border-slate-200/70 bg-white/70 px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm shadow-slate-950/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-cyan-500/40 dark:hover:text-cyan-300">
                                {prompt}
                            </button>
                        ))}
                    </div>

                    <div className="app-scrollbar flex-1 space-y-3 overflow-y-auto rounded-lg border border-slate-200/70 bg-slate-50/70 p-3 dark:border-white/10 dark:bg-slate-950/40">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                                <div className={`max-w-[82%] rounded-lg px-4 py-3 text-sm shadow-sm ${message.role === "user"
                                    ? "bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-700/20"
                                    : "border border-white/70 bg-white/85 text-slate-700 shadow-slate-950/5 dark:border-white/10 dark:bg-slate-800/80 dark:text-slate-200"
                                    }`}>
                                    {message.text}
                                </div>
                            </div>
                        ))}
                        {isThinking && (
                            <div className="flex justify-start">
                                <div className="rounded-lg border border-white/70 bg-white/85 px-4 py-3 text-sm text-slate-500 shadow-sm shadow-slate-950/5 dark:border-white/10 dark:bg-slate-800/80 dark:text-slate-300">
                                    FitCoach is thinking...
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="mt-3 flex gap-3">
                        <input
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            placeholder="Ask for a meal idea, workout nudge, or daily review"
                            className="min-w-0 flex-1 rounded-lg border border-slate-200/80 bg-white/75 px-4 py-3 text-slate-800 shadow-sm shadow-slate-950/5 outline-none backdrop-blur-xl transition-all duration-300 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/20 dark:border-white/10 dark:bg-slate-900/70 dark:text-white"
                        />
                        <Button type="submit" className="px-4" disabled={isThinking}>
                            <SendIcon className="size-5" />
                            <span className="hidden sm:inline">Send</span>
                        </Button>
                    </form>
                </Card>

                <div className="mt-4 space-y-4 lg:mt-0">
                    <Card>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-cyan-500/10">
                                <SparklesIcon className="size-5 text-cyan-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">Smart Info</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">What the assistant is meant for.</p>
                            </div>
                        </div>

                        <div className="mb-4 grid grid-cols-2 rounded-lg bg-slate-100/80 p-1 dark:bg-slate-950/60">
                            {(["about", "features"] as const).map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setInfoTab(tab)}
                                    className={`rounded-lg px-3 py-2 text-sm font-semibold capitalize transition-all ${infoTab === tab
                                        ? "bg-white text-cyan-700 shadow-sm dark:bg-slate-800 dark:text-cyan-300"
                                        : "text-slate-500 dark:text-slate-400"
                                        }`}>
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {infoTab === "about" ? (
                            <div className="rounded-lg border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-800/60">
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    FitCoach is a lightweight helper for food decisions, workout nudges, and support prompts. It uses your current day logs first, then gives simple next-step suggestions.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {coachFeatureRows.map((feature) => (
                                    <div key={feature.title} className="flex items-start gap-3 rounded-lg border border-slate-200/70 bg-white/60 p-3 dark:border-white/10 dark:bg-slate-800/60">
                                        <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${feature.color}`}>
                                            <feature.icon className="size-4" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 dark:text-white">{feature.title}</p>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{feature.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    <Card>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                                <BrainCircuitIcon className="size-5 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">Today Signal</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Context used by the helper.</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {insightCards.map((item) => (
                                <div key={item.label} className="flex items-center justify-between rounded-lg bg-white/60 p-3 dark:bg-slate-800/60">
                                    <div className="flex items-center gap-3">
                                        <div className={`flex size-9 items-center justify-center rounded-lg ${item.bg}`}>
                                            <item.icon className={`size-4 ${item.color}`} />
                                        </div>
                                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{item.label}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-900 dark:text-white">{item.value}</p>
                                        <p className="text-xs text-slate-400">{item.helper}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-violet-500/10">
                                <MessageCircleIcon className="size-5 text-violet-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">Support Desk</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Fast routes for help.</p>
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <button className="flex items-center gap-3 rounded-lg border border-slate-200/70 bg-white/60 p-3 text-left text-sm font-semibold text-slate-700 transition-all hover:border-violet-300 dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-200">
                                <ShieldCheckIcon className="size-4 text-violet-500" />
                                Report account or data issue
                            </button>
                            <button className="flex items-center gap-3 rounded-lg border border-slate-200/70 bg-white/60 p-3 text-left text-sm font-semibold text-slate-700 transition-all hover:border-violet-300 dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-200">
                                <CalendarCheckIcon className="size-4 text-violet-500" />
                                Prepare weekly check-in
                            </button>
                            <button className="flex items-center gap-3 rounded-lg border border-slate-200/70 bg-white/60 p-3 text-left text-sm font-semibold text-slate-700 transition-all hover:border-violet-300 dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-200">
                                <LightbulbIcon className="size-4 text-violet-500" />
                                Request feature idea
                            </button>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default AiCoach
