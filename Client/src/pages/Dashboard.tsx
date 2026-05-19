import { getMotivationalMessage, goalLabels } from "../assets/assets"
import { useAppContext } from "../context/AppContext"
import type { ActivityEntry, FoodEntry } from "../types"
import Card from "../components/ui/Card"
import ProgressBar from "../components/ui/ProgressBar"
import {
    Activity,
    AppleIcon,
    DumbbellIcon,
    FlameIcon,
    GaugeIcon,
    HeartPulseIcon,
    Ruler,
    ScaleIcon,
    SparklesIcon,
    TargetIcon,
    TrendingUpIcon,
    UtensilsIcon,
    ZapIcon,
} from "lucide-react"
import CaloriesChart from "../components/CaloriesChart"


const Dashboard = () => {

    const { user, allActivityLogs, allFoodLogs } = useAppContext()
    const DAILY_CALORIE_LIMIT: number = user?.dailyCalorieIntake || 2000;
    const DAILY_BURN_GOAL: number = user?.dailyCalorieBurn || 400;
    const today = new Date().toISOString().split('T')[0];
    const todayFood: FoodEntry[] = allFoodLogs.filter((f: FoodEntry) => f.createdAt?.split('T')[0] === today)
    const todayActivities: ActivityEntry[] = allActivityLogs.filter((a: ActivityEntry) => a.createdAt?.split('T')[0] === today)

    const totalCalories: number = todayFood.reduce((sum, item) => sum + item.calories, 0)
    const remainingCalories: number = DAILY_CALORIE_LIMIT - totalCalories;
    const totalActivityMinutes: number = todayActivities.reduce((sum, item) => sum + item.duration, 0)
    const totalBurned: number = todayActivities.reduce((sum, item) => sum + (item.calories || 0), 0)
    const netCalories = Math.max(totalCalories - totalBurned, 0)
    const calorieProgress = Math.min(Math.round((totalCalories / DAILY_CALORIE_LIMIT) * 100), 100)
    const burnProgress = Math.min(Math.round((totalBurned / DAILY_BURN_GOAL) * 100), 100)
    const motivation = getMotivationalMessage(totalCalories, totalActivityMinutes, DAILY_CALORIE_LIMIT)

    const bmi = user?.weight && user?.height
        ? Number((user.weight / Math.pow(user.height / 100, 2)).toFixed(1))
        : null

    const bmiStatus = (() => {
        if (!bmi) return null
        if (bmi < 18.5) return { label: "Low", color: "text-blue-500", bg: "bg-blue-500" };
        if (bmi < 25) return { label: "Balanced", color: "text-emerald-500", bg: "bg-emerald-500" };
        if (bmi < 30) return { label: "Elevated", color: "text-orange-500", bg: "bg-orange-500" };
        return { label: "High", color: "text-red-500", bg: "bg-red-500" };
    })()

    const summaryItems = [
        { label: "Meals", value: todayFood.length, helper: "logged today", icon: UtensilsIcon, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Active", value: totalActivityMinutes, helper: "minutes", icon: Activity, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Workouts", value: todayActivities.length, helper: "sessions", icon: ZapIcon, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Net", value: netCalories, helper: "kcal", icon: GaugeIcon, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    ]

    return (
        <div className="page-container">
            <div className="dashboard-header">
                <div className="mx-auto max-w-5xl reveal-up">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-sm font-semibold uppercase text-emerald-50/90">
                                Welcome back
                            </p>
                            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
                                Hi, {user?.username || "athlete"}
                            </h1>
                            <p className="mt-2 max-w-xl text-sm text-white/80">
                                {new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date())}
                            </p>
                        </div>

                        <div className="rounded-lg border border-white/25 bg-white/20 px-4 py-3 shadow-lg shadow-emerald-950/10 backdrop-blur-xl">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-white/20">
                                    <SparklesIcon className="size-5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase text-emerald-50/80">{motivation.tone}</p>
                                    <p className="text-sm font-medium text-white">{motivation.text}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <Card className="col-span-2 overflow-hidden">
                    <div className="grid gap-6 lg:grid-cols-[240px_1fr] lg:items-center">
                        <div className="mx-auto flex size-52 items-center justify-center rounded-full p-3 shadow-inner shadow-emerald-950/10"
                            style={{ background: `conic-gradient(#10b981 ${calorieProgress}%, rgba(226, 232, 240, 0.78) 0)` }}>
                            <div className="flex size-full flex-col items-center justify-center rounded-full bg-white/90 text-center shadow-xl shadow-slate-950/10 backdrop-blur-xl dark:bg-slate-950/90">
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Consumed</p>
                                <p className="text-4xl font-bold text-slate-900 dark:text-white">{totalCalories}</p>
                                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">of {DAILY_CALORIE_LIMIT} kcal</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Daily Energy</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Calories in, activity out, and what remains.</p>
                                </div>
                                <div className={`inline-flex w-fit items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${remainingCalories >= 0
                                    ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-red-500/10 text-red-700 dark:text-red-300'
                                    }`}>
                                    <TargetIcon className="size-4" />
                                    {remainingCalories >= 0 ? `${remainingCalories} kcal left` : `${Math.abs(remainingCalories)} kcal over`}
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-lg border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-800/60">
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                                            <AppleIcon className="size-4 text-emerald-500" />
                                            Intake
                                        </span>
                                        <span className="text-sm font-bold text-slate-800 dark:text-white">{calorieProgress}%</span>
                                    </div>
                                    <ProgressBar value={totalCalories} max={DAILY_CALORIE_LIMIT} />
                                </div>

                                <div className="rounded-lg border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-800/60">
                                    <div className="mb-3 flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                                            <FlameIcon className="size-4 text-orange-500" />
                                            Burn
                                        </span>
                                        <span className="text-sm font-bold text-slate-800 dark:text-white">{burnProgress}%</span>
                                    </div>
                                    <ProgressBar value={totalBurned} max={DAILY_BURN_GOAL} />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="dashboard-card-grid">
                    {summaryItems.map((item) => (
                        <Card key={item.label} className="p-4">
                            <div className="flex items-center gap-3">
                                <div className={`flex size-10 items-center justify-center rounded-lg ${item.bg}`}>
                                    <item.icon className={`size-5 ${item.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                                    <p className="text-2xl font-bold text-slate-900 dark:text-white">{item.value}</p>
                                    <p className="text-xs text-slate-400 dark:text-slate-500">{item.helper}</p>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {user && (
                    <Card className="bg-linear-to-br from-slate-900 to-slate-800 text-white dark:from-slate-800 dark:to-slate-950">
                        <div className="flex items-start gap-4">
                            <div className="flex size-12 items-center justify-center rounded-lg bg-white/10">
                                <TrendingUpIcon className="size-6 text-emerald-300" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm text-slate-300">Current Goal</p>
                                <h3 className="mt-1 text-xl font-bold">{goalLabels[user.goal || 'maintain']}</h3>
                                <p className="mt-2 text-sm text-slate-400">Daily target: {DAILY_CALORIE_LIMIT} kcal intake and {DAILY_BURN_GOAL} kcal burn.</p>
                            </div>
                        </div>
                    </Card>
                )}

                {user && user.weight && (
                    <Card>
                        <div className="mb-6 flex items-center gap-4">
                            <div className="flex size-12 items-center justify-center rounded-lg bg-indigo-500/10">
                                <ScaleIcon className="size-6 text-indigo-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">Body Metrics</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Profile snapshot</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                    <ScaleIcon className="size-4" />
                                    Weight
                                </span>
                                <span className="font-semibold text-slate-800 dark:text-slate-100">{user.weight} kg</span>
                            </div>

                            {user.height && (
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                                        <Ruler className="size-4" />
                                        Height
                                    </span>
                                    <span className="font-semibold text-slate-800 dark:text-slate-100">{user.height} cm</span>
                                </div>
                            )}

                            {bmi && bmiStatus && (
                                <div className="border-t border-slate-200/70 pt-4 dark:border-white/10">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">BMI</span>
                                        <span className={`text-lg font-bold ${bmiStatus.color}`}>{bmi} <span className="text-xs font-semibold">{bmiStatus.label}</span></span>
                                    </div>
                                    <div className="flex h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                                        <div className="flex-1 bg-blue-400/50"></div>
                                        <div className="flex-1 bg-emerald-400/60"></div>
                                        <div className="flex-1 bg-orange-400/60"></div>
                                        <div className="flex-1 bg-red-400/60"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                )}

                <Card>
                    <div className="mb-4 flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-rose-500/10">
                            <HeartPulseIcon className="size-5 text-rose-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">Today's Summary</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Fast scan</p>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between border-b border-slate-200/70 py-2 dark:border-white/10">
                            <span className="text-slate-500 dark:text-slate-400">Meals logged</span>
                            <span className="font-medium text-slate-800 dark:text-slate-100">{todayFood.length}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-200/70 py-2 dark:border-white/10">
                            <span className="text-slate-500 dark:text-slate-400">Total calories</span>
                            <span className="font-medium text-slate-800 dark:text-slate-100">{totalCalories} kcal</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-slate-500 dark:text-slate-400">Active time</span>
                            <span className="font-medium text-slate-800 dark:text-slate-100">{totalActivityMinutes} min</span>
                        </div>
                    </div>
                </Card>

                <Card className="col-span-2">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                            <DumbbellIcon className="size-5 text-emerald-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-900 dark:text-white">This Week's Progress</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Intake and burn trends</p>
                        </div>
                    </div>
                    <CaloriesChart />
                </Card>
            </div>
        </div>
    )
}

export default Dashboard
