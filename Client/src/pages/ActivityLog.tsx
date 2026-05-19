import React, { useState } from "react";
import { useAppContext } from "../context/AppContext"
import type { ActivityEntry } from "../types";
import Card from "../components/ui/Card";
import { quickActivities } from "../assets/assets";
import {
    ActivityIcon,
    BikeIcon,
    DumbbellIcon,
    FlameIcon,
    FootprintsIcon,
    PlusIcon,
    TimerIcon,
    Trash2Icon,
    WavesIcon,
    ZapIcon
} from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";
import api from "../configs/api";


const activityIconMap: Record<string, typeof ActivityIcon> = {
    Walking: FootprintsIcon,
    Running: ZapIcon,
    Cycling: BikeIcon,
    Swimming: WavesIcon,
    Yoga: ActivityIcon,
    "Weight Training": DumbbellIcon,
};

const getErrorMessage = (error: unknown, fallback = "Something went wrong") => {
    if (typeof error === "object" && error !== null) {
        const maybeError = error as { response?: { data?: { error?: { message?: string } } }; message?: string };
        return maybeError.response?.data?.error?.message || maybeError.message || fallback;
    }

    return fallback;
}

const ActivityLog = () => {

    const { allActivityLogs, setAllActivityLogs } = useAppContext();

    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        duration: 0,
        calories: 0
    })
    const [error, setError] = useState('')

    const today = new Date().toISOString().split('T')[0];
    const activities: ActivityEntry[] = allActivityLogs.filter((a: ActivityEntry) =>
        a.createdAt?.split('T')[0] === today)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name.trim() || formData.duration <= 0 || formData.calories < 0) {
            return toast.error('Please enter valid data')
        }
        try {
            const { data } = await api.post('/api/activity-logs', { data: formData })

            setAllActivityLogs(prev => [...prev, data])
            setFormData({ name: '', duration: 0, calories: 0 })
            setShowForm(false)
            setError('')
        } catch (error: unknown) {
            console.log(error);
            toast.error(getErrorMessage(error));
        }
    }

    const handleQuickAdd = (activity: { name: string, rate: number }) => {
        setFormData({
            name: activity.name,
            duration: 30,
            calories: 30 * activity.rate
        })
        setShowForm(true)
    }

    const handleDurationChange = (val: string | number) => {
        const duration = Number(val);
        const activity = quickActivities.find(a => a.name === formData.name)

        let calories = formData.calories
        if (activity) {
            calories = duration * activity.rate
        }

        setFormData({ ...formData, duration, calories })
    }

    const handleDelete = async (documentId: string) => {
        try {
            const confirm = window.confirm('Are you sure you want to delete this entry?');
            if (!confirm) return;
            await api.delete(`/api/activity-logs/${documentId}`);
            setAllActivityLogs(prev => prev.filter((e) => e.documentId !== documentId))
        } catch (error: unknown) {
            console.log(error)
            toast.error(getErrorMessage(error));
        }
    }

    const totalMinutes: number = activities.reduce((sum, a) => sum + a.duration, 0)
    const totalBurned: number = activities.reduce((sum, a) => sum + (a.calories || 0), 0)

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase text-blue-600 dark:text-blue-400">Movement</p>
                        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">Activity Log</h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track workouts, minutes, and calories burned.</p>
                    </div>
                    <div className="rounded-lg border border-blue-200/70 bg-blue-500/10 px-4 py-3 text-right dark:border-blue-500/20">
                        <p className="text-xs font-semibold uppercase text-blue-700 dark:text-blue-300">Active Today</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{totalMinutes}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">minutes</p>
                    </div>
                </div>
            </div>

            <div className="page-content-grid">
                {!showForm && (
                    <div className="space-y-4">
                        <Card>
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                                    <ActivityIcon className="size-5 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Quick Add</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Pick a workout and adjust duration.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                                {quickActivities.map((activity) => {
                                    const Icon = activityIconMap[activity.name] || ActivityIcon;
                                    return (
                                        <button
                                            onClick={() => handleQuickAdd(activity)}
                                            key={activity.name}
                                            className="group flex items-center gap-3 rounded-lg border border-slate-200/70 bg-white/70 px-3 py-3 text-left text-sm font-semibold text-slate-700 shadow-sm shadow-slate-950/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-300 hover:text-blue-700 dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-blue-500/40 dark:hover:text-blue-300">
                                            <span className="flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                                                <Icon className="size-4 transition-transform duration-300 group-hover:scale-110" />
                                            </span>
                                            <span className="min-w-0">{activity.name}</span>
                                        </button>
                                    )
                                })}
                            </div>
                        </Card>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <Card className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10">
                                        <FlameIcon className="size-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Calories Burned</p>
                                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalBurned}</p>
                                    </div>
                                </div>
                            </Card>

                            <Button className="w-full self-stretch" onClick={() => setShowForm(true)}>
                                <PlusIcon className="size-5" />
                                Add Custom Activity
                            </Button>
                        </div>
                    </div>
                )}

                {showForm && (
                    <Card className="border-blue-300/70 dark:border-blue-500/30">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                                <DumbbellIcon className="size-5 text-blue-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">New Activity</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Duration drives calorie estimates for quick activities.</p>
                            </div>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <Input label="Activity Name" placeholder="e.g., Morning run"
                                required value={formData.name} onChange={(v) => setFormData({
                                    ...formData, name: v.toString()
                                })} />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Input label="Duration (min)" type='number'
                                    placeholder="30" min={1} max={300}
                                    required value={formData.duration} onChange={handleDurationChange} />

                                <Input label="Calories Burned" type='number'
                                    placeholder="200" min={0} max={2000}
                                    required value={formData.calories} onChange=
                                    {(v) => setFormData({ ...formData, calories: Number(v) })} />
                            </div>
                            {error && <p className="text-sm text-red-500">{error}</p>}

                            <div className="flex gap-3 pt-2">
                                <Button type="button" variant="secondary"
                                    className="flex-1" onClick={() => {
                                        setShowForm(false);
                                        setError('');
                                        setFormData({ name: '', duration: 0, calories: 0 })
                                    }}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1">
                                    Add Activity
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {activities.length === 0 ? (
                    <Card className="py-12 text-center">
                        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-lg bg-slate-100/80 dark:bg-slate-800/80">
                            <DumbbellIcon className="size-8 text-slate-400 dark:text-slate-500" />
                        </div>
                        <h3 className="mb-2 font-semibold text-slate-800 dark:text-slate-100">No activities logged today</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Start moving and track your progress.</p>
                    </Card>
                ) : (
                    <Card>
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                                    <ActivityIcon className="size-5 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Today's Activities</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{activities.length} logged</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-semibold text-orange-500">{totalBurned} kcal</p>
                                <p className="text-xs text-slate-400">burned</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {activities.map((activity) => (
                                <div key={activity.id} className="activity-entry-item">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                                            <TimerIcon className="size-5 text-blue-500 dark:text-blue-400" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-slate-700 dark:text-slate-200">{activity.name}</p>
                                            <p className="text-sm text-slate-400">{new Date(activity?.createdAt || '').
                                                toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <p className="font-semibold text-slate-700 dark:text-slate-200">{activity.duration} min</p>
                                            <p className="text-xs text-slate-400">{activity.calories} kcal</p>
                                        </div>
                                        <button onClick={() => handleDelete(activity.documentId)}
                                            className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                            aria-label={`Delete ${activity.name}`}>
                                            <Trash2Icon className="size-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between border-t border-slate-200/70 pt-4 dark:border-white/10">
                            <span className="text-slate-500 dark:text-slate-400">Total Active Time</span>
                            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{totalMinutes} minutes</span>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default ActivityLog
