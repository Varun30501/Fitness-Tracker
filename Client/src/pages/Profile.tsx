import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext"
import { useTheme } from "../context/ThemeContext";
import type { ProfileFormData } from "../types";
import Card from "../components/ui/Card";
import {
    ActivityIcon,
    Calendar,
    FlameIcon,
    LogOutIcon,
    MoonIcon,
    PencilIcon,
    RulerIcon,
    Scale,
    SunIcon,
    Target,
    User,
    UtensilsIcon
} from "lucide-react";
import Button from "../components/ui/Button";
import { goalLabels, goalOptions } from "../assets/assets";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import toast from "react-hot-toast";
import api from "../configs/api";

const getErrorMessage = (error: unknown, fallback = "Failed to update profile") => {
    if (typeof error === "object" && error !== null) {
        const maybeError = error as { response?: { data?: { error?: { message?: string } } }; message?: string };
        return maybeError.response?.data?.error?.message || maybeError.message || fallback;
    }

    return fallback;
}

const Profile = () => {
    const { user, logout, fetchUser, allFoodLogs, allActivityLogs } = useAppContext();
    const { theme, toggleTheme } = useTheme()

    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<ProfileFormData>({
        age: 0,
        weight: 0,
        height: 0,
        goal: 'maintain',
        dailyCalorieIntake: 2000,
        dailyCalorieBurn: 400
    })

    const fetchUserData = useCallback(() => {
        if (user) {
            setFormData({
                age: user?.age || 0,
                weight: user?.weight || 0,
                height: user?.height || 0,
                goal: user?.goal || 'maintain',
                dailyCalorieIntake: user?.dailyCalorieIntake || 2000,
                dailyCalorieBurn: user?.dailyCalorieBurn || 400,
            })
        }
    }, [user])

    useEffect(() => {
        (() => {
            fetchUserData()
        })();
    }, [fetchUserData])

    const handleSave = async () => {
        try {
            await api.put(`/api/users/${user?.id}`, formData)
            await fetchUser(user?.token || '')
            toast.success('Profile updated successfully')
        } catch (error: unknown) {
            console.log(error);
            toast.error(getErrorMessage(error));
        }
        setIsEditing(false)
    }

    const getStats = () => {
        const totalFoodEntries = allFoodLogs?.length || 0;
        const totalActivities = allActivityLogs?.length || 0;
        const totalBurned = allActivityLogs?.reduce((sum, item) => sum + (item.calories || 0), 0) || 0;
        return { totalFoodEntries, totalActivities, totalBurned }
    }

    const stats = getStats();

    if (!user || !formData) return null

    const joinedDate = user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "recently";

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="mx-auto max-w-5xl">
                    <p className="text-sm font-semibold uppercase text-emerald-600 dark:text-emerald-400">Account</p>
                    <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">Profile</h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage goals, body metrics, and preferences.</p>
                </div>
            </div>

            <div className="profile-content">
                <Card>
                    <div className="mb-6 flex items-center gap-4">
                        <div className="flex size-14 items-center justify-center rounded-lg bg-linear-to-br from-emerald-400 via-teal-500 to-cyan-500 shadow-lg shadow-emerald-600/25">
                            <User className="size-7 text-white" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="truncate text-xl font-bold text-slate-900 dark:text-white">{user.username}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Member since {joinedDate}</p>
                        </div>
                    </div>

                    {isEditing ? (
                        <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Input label="Age" type="number" value={formData.age}
                                    onChange={(v) => setFormData({ ...formData, age: Number(v) })}
                                    min={13} max={120} />

                                <Input label="Weight (kg)" type="number" value={formData.weight}
                                    onChange={(v) => setFormData({ ...formData, weight: Number(v) })}
                                    min={20} max={300} />
                            </div>

                            <Input label="Height (cm)" type="number" value={formData.height}
                                onChange={(v) => setFormData({ ...formData, height: Number(v) })}
                                min={100} max={250} />

                            <Select label="Fitness Goal" value={formData.goal as string}
                                onChange={(v) => setFormData({ ...formData, goal: v as 'lose' | 'maintain' | 'gain' })}
                                options={goalOptions} />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Input label="Daily Intake Target" type="number" value={formData.dailyCalorieIntake}
                                    onChange={(v) => setFormData({ ...formData, dailyCalorieIntake: Number(v) })}
                                    min={1200} max={4000} />
                                <Input label="Daily Burn Target" type="number" value={formData.dailyCalorieBurn}
                                    onChange={(v) => setFormData({ ...formData, dailyCalorieBurn: Number(v) })}
                                    min={100} max={2000} />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button variant="secondary" className="flex-1"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            age: Number(user.age),
                                            weight: Number(user.weight),
                                            height: Number(user.height),
                                            goal: user.goal || 'maintain',
                                            dailyCalorieIntake: user.dailyCalorieIntake || 2000,
                                            dailyCalorieBurn: user.dailyCalorieBurn || 400
                                        })
                                    }}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} className="flex-1">
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3">
                                <div className="profile-info-row">
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10">
                                        <Calendar className="size-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Age</p>
                                        <p className="font-semibold text-slate-800 dark:text-slate-100">{user.age || 0} years</p>
                                    </div>
                                </div>

                                <div className="profile-info-row">
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-indigo-500/10">
                                        <Scale className="size-5 text-indigo-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Weight</p>
                                        <p className="font-semibold text-slate-800 dark:text-slate-100">{user.weight || 0} kg</p>
                                    </div>
                                </div>

                                {Boolean(user.height) && (
                                    <div className="profile-info-row">
                                        <div className="flex size-10 items-center justify-center rounded-lg bg-cyan-500/10">
                                            <RulerIcon className="size-5 text-cyan-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Height</p>
                                            <p className="font-semibold text-slate-800 dark:text-slate-100">{user.height} cm</p>
                                        </div>
                                    </div>
                                )}

                                <div className="profile-info-row">
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-orange-500/10">
                                        <Target className="size-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Goal</p>
                                        <p className="font-semibold text-slate-800 dark:text-slate-100">{goalLabels[user?.goal || 'gain']}</p>
                                    </div>
                                </div>
                            </div>
                            <Button variant="secondary" onClick={() => setIsEditing(true)} className="mt-4 w-full">
                                <PencilIcon className="size-4" />
                                Edit Profile
                            </Button>
                        </>
                    )}
                </Card>

                <div className="space-y-4">
                    <Card>
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                                <ActivityIcon className="size-5 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">Your Stats</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">All-time activity in this account.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="rounded-lg border border-emerald-200/70 bg-emerald-500/10 p-4 text-center dark:border-emerald-500/20">
                                <UtensilsIcon className="mx-auto mb-2 size-5 text-emerald-500" />
                                <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">{stats.totalFoodEntries}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Foods</p>
                            </div>

                            <div className="rounded-lg border border-blue-200/70 bg-blue-500/10 p-4 text-center dark:border-blue-500/20">
                                <ActivityIcon className="mx-auto mb-2 size-5 text-blue-500" />
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">{stats.totalActivities}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Moves</p>
                            </div>

                            <div className="rounded-lg border border-orange-200/70 bg-orange-500/10 p-4 text-center dark:border-orange-500/20">
                                <FlameIcon className="mx-auto mb-2 size-5 text-orange-500" />
                                <p className="text-2xl font-bold text-orange-600 dark:text-orange-300">{stats.totalBurned}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Burned</p>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <h3 className="mb-4 font-semibold text-slate-900 dark:text-white">Daily Targets</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between rounded-lg bg-white/60 p-3 dark:bg-slate-800/60">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Intake</span>
                                <span className="font-bold text-slate-900 dark:text-white">{user.dailyCalorieIntake || 2000} kcal</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg bg-white/60 p-3 dark:bg-slate-800/60">
                                <span className="text-sm text-slate-500 dark:text-slate-400">Burn</span>
                                <span className="font-bold text-slate-900 dark:text-white">{user.dailyCalorieBurn || 400} kcal</span>
                            </div>
                        </div>
                    </Card>

                    <div className="lg:hidden">
                        <button
                            onClick={toggleTheme}
                            className="glass-panel flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-slate-600 transition-all duration-300 hover:-translate-y-0.5 dark:text-slate-300">
                            {theme === 'light' ? <MoonIcon className="size-5" /> : <SunIcon className="size-5" />}
                            <span className="text-base font-semibold">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                        </button>
                    </div>

                    <Button variant="danger" onClick={logout} className="w-full">
                        <LogOutIcon className="size-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Profile
