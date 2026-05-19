// pages/FoodLog.tsx
import { useRef, useState } from "react"
import { useAppContext } from "../context/AppContext"
import type { FoodEntry, FormData } from "../types"
import Card from "../components/ui/Card"
import { mealColors, mealIcons, mealTypeOptions, quickActivitiesFoodLog } from "../assets/assets"
import Button from "../components/ui/Button"
import { CameraIcon, Loader2Icon, PlusIcon, SparkleIcon, Trash2Icon, UtensilsCrossedIcon } from "lucide-react"
import Input from "../components/ui/Input"
import Select from "../components/ui/Select"
import toast from "react-hot-toast"
import api from "../configs/api"

const getErrorMessage = (error: unknown, fallback = "Something went wrong") => {
    if (typeof error === "object" && error !== null) {
        const maybeError = error as { response?: { data?: { error?: { message?: string } } }; message?: string };
        return maybeError.response?.data?.error?.message || maybeError.message || fallback;
    }

    return fallback;
}

const FoodLog = () => {
    const { allFoodLogs, setAllFoodLogs } = useAppContext()

    const [showForm, setShowForm] = useState(false)
    const [formData, setFormData] = useState<FormData>({
        name: '',
        calories: 0,
        mealType: ''
    })

    const [loading, setLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const today = new Date().toISOString().split('T')[0];
    const entries: FoodEntry[] = allFoodLogs.filter((e: FoodEntry) =>
        e.createdAt?.split('T')[0] === today)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || formData.calories <= 0
            || !formData.mealType) {
            return toast.error('Please enter valid data')
        }

        try {
            const { data } = await api.post('/api/food-logs', { data: formData })
            setAllFoodLogs(prev => [...prev, data])
            setFormData({ name: '', calories: 0, mealType: '' })
            setShowForm(false)
        } catch (error: unknown) {
            console.log(error);
            toast.error(getErrorMessage(error));
        }

    }

    const handleDelete = async (documentId: string) => {
        try {
            const confirm = window.confirm('Are you sure you want to delete this entry?');
            if (!confirm) return;

            await api.delete(`/api/food-logs/${documentId}`)
            setAllFoodLogs(prev => prev.filter((e) => e.documentId !== documentId))
        } catch (error: unknown) {
            console.log(error)
            toast.error(getErrorMessage(error));
        }
    }

    const totalCalories = entries.reduce((sum, e) => sum + e.calories, 0)

    const groupedEntries: Record<'breakfast' | 'lunch' | 'dinner' | 'snack',
        FoodEntry[]> = entries.reduce((acc, entry) => {
            if (!acc[entry.mealType]) acc[entry.mealType] = [];
            acc[entry.mealType].push(entry);
            return acc;
        }, {} as Record<'breakfast' | 'lunch' | 'dinner' | 'snack', FoodEntry[]>)

    const handleQuickAdd = (mealType: string) => {
        setFormData({ ...formData, mealType })
        setShowForm(true)
    }

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLoading(true)
        const formData = new FormData();
        formData.append('image', file)
        try {
            const { data } = await api.post('/api/image-analysis', formData);
            const result = data.result;
            let mealType = '';

            const hour = new Date().getHours()

            if (hour >= 0 && hour < 12) {
                mealType = 'breakfast';
            } else if (hour >= 12 && hour < 16) {
                mealType = 'lunch';
            } else if (hour >= 16 && hour < 18) {
                mealType = 'snack';
            } else if (hour >= 18 && hour < 24) {
                mealType = 'dinner';
            }

            if (!mealType || !result.name || !result.calories) {
                return toast.error('Missing data')
            }

            const { data: newEntry } = await api.post('/api/food-logs', {
                data: {
                    name: result.name,
                    calories: result.calories,
                    mealType
                }
            })
            setAllFoodLogs(prev => [...prev, newEntry])

            if (inputRef.current) {
                inputRef.current.value = ''
            }

        } catch (error: unknown) {
            console.log(error);
            toast.error(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
                    <div>
                        <p className="text-sm font-semibold uppercase text-emerald-600 dark:text-emerald-400">Nutrition</p>
                        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">Food Log</h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track meals, calories, and AI food snaps.</p>
                    </div>
                    <div className="rounded-lg border border-emerald-200/70 bg-emerald-500/10 px-4 py-3 text-right dark:border-emerald-500/20">
                        <p className="text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-300">Today</p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">{totalCalories}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">kcal logged</p>
                    </div>
                </div>
            </div>

            <div className="page-content-grid">
                {!showForm && (
                    <div className="space-y-4">
                        <Card>
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                                    <UtensilsCrossedIcon className="size-5 text-emerald-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white">Quick Add</h3>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Choose a meal slot and enter details.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                {quickActivitiesFoodLog.map((activity) => {
                                    const mealTypeKey = activity.name as keyof typeof mealIcons;
                                    const MealIcon = mealIcons[mealTypeKey];

                                    return (
                                        <button
                                            onClick={() => handleQuickAdd(activity.name)}
                                            className="group flex flex-col items-center gap-2 rounded-lg border border-slate-200/70 bg-white/70 px-3 py-4 text-sm font-semibold text-slate-700 shadow-sm shadow-slate-950/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700 dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:border-emerald-500/40 dark:hover:text-emerald-300"
                                            key={activity.name}>
                                            <span className={`flex size-10 items-center justify-center rounded-lg ${mealColors[mealTypeKey]}`}>
                                                <MealIcon className="size-5 transition-transform duration-300 group-hover:scale-110" />
                                            </span>
                                            {activity.label}
                                        </button>
                                    )
                                })}
                            </div>
                        </Card>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <Button className="w-full" onClick={() => setShowForm(true)}>
                                <PlusIcon className="size-5" />
                                Add Food Entry
                            </Button>

                            <Button className="w-full" onClick={() => { inputRef.current?.click() }}>
                                <CameraIcon className="size-5" />
                                AI Food Snap
                            </Button>
                        </div>

                        <input onChange={handleImageChange}
                            type="file" accept="image/*" hidden ref={inputRef} />
                        {loading && (
                            <div className="fixed inset-0 z-50 grid place-items-center bg-slate-100/50 backdrop-blur-md dark:bg-slate-950/60">
                                <div className="glass-panel reveal-scale flex items-center gap-3 rounded-lg px-5 py-4">
                                    <Loader2Icon className="size-6 animate-spin text-emerald-500" />
                                    <span className="font-medium text-slate-700 dark:text-slate-200">Analyzing food image</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {showForm && (
                    <Card className="border-emerald-300/70 dark:border-emerald-500/30">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/10">
                                <SparkleIcon className="size-5 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white">New Food Entry</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Add the meal name, calories, and slot.</p>
                            </div>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <Input label="Food Name" value={formData.name} onChange={(v) =>
                                setFormData({ ...formData, name: v.toString() })}
                                placeholder="e.g., Grilled chicken salad" required />

                            <Input label="Calories" type="number" value={formData.calories} onChange={(v) =>
                                setFormData({ ...formData, calories: Number(v) })}
                                placeholder="e.g., 350" required min={1} />

                            <Select label="Meal Type" value={formData.mealType} onChange=
                                {(v) => setFormData({ ...formData, mealType: v.toString() })}
                                options={mealTypeOptions} placeholder="Select meal type" required />

                            <div className="flex gap-3 pt-2">
                                <Button className="flex-1" type="button" variant="secondary"
                                    onClick={() => {
                                        setShowForm(false); setFormData({
                                            name: '',
                                            calories: 0,
                                            mealType: ''
                                        })
                                    }}>
                                    Cancel
                                </Button>

                                <Button type="submit" className="flex-1">
                                    Add Entry
                                </Button>
                            </div>
                        </form>
                    </Card>
                )}

                {entries.length === 0 ? (
                    <Card className="py-12 text-center">
                        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-lg bg-slate-100/80 dark:bg-slate-800/80">
                            <UtensilsCrossedIcon className="size-8 text-slate-400 dark:text-slate-500" />
                        </div>
                        <h3 className="mb-2 font-semibold text-slate-800 dark:text-slate-100">No food logged today</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Start tracking meals to stay on target.</p>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
                            const mealTypeKey = mealType as keyof typeof groupedEntries;
                            if (!groupedEntries[mealTypeKey]) return null;

                            const MealIcon = mealIcons[mealTypeKey];
                            const mealCalories = groupedEntries[mealTypeKey].reduce((sum, e) => sum + e.calories, 0);

                            return (
                                <Card key={mealType}>
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`flex size-10 items-center justify-center rounded-lg ${mealColors[mealTypeKey]}`}>
                                                <MealIcon className="size-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold capitalize text-slate-900 dark:text-white">{mealType}</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{groupedEntries[mealTypeKey].length} items</p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-slate-800 dark:text-slate-100">{mealCalories} kcal</p>
                                    </div>
                                    <div className="space-y-2">
                                        {groupedEntries[mealTypeKey].map((entry) => (
                                            <div key={entry.id} className="food-entry-item">
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate font-medium text-slate-700 dark:text-slate-200">{entry.name}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{entry.calories} kcal</span>

                                                    <button
                                                        onClick={() => entry.documentId && handleDelete(entry.documentId)}
                                                        className="rounded-lg p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                                                        aria-label={`Delete ${entry.name}`}>
                                                        <Trash2Icon className="size-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default FoodLog
