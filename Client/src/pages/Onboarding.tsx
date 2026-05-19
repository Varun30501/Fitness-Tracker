// pages/Onboarding.tsx
import { ArrowLeft, ArrowRight, PersonStandingIcon, ScaleIcon, Target, User } from "lucide-react"
import { useState } from "react"
import toast, { Toaster } from "react-hot-toast"
import { useAppContext } from "../context/AppContext"
import type { ProfileFormData } from "../types"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import { ageRanges, goalOptions } from "../assets/assets"
import Slider from "../components/ui/Slider"
import api from "../configs/api"
import { useNavigate } from "react-router-dom"

const getErrorMessage = (error: unknown, fallback = "Failed to update profile") => {
    if (typeof error === "object" && error !== null) {
        const maybeError = error as { response?: { data?: { error?: { message?: string } } }; message?: string };
        return maybeError.response?.data?.error?.message || maybeError.message || fallback;
    }

    return fallback;
}

const Onboarding = () => {

    const [step, setStep] = useState(1)
    const { user, setOnboardingCompleted, fetchUser } = useAppContext()
    const [formData, setFormData] = useState<ProfileFormData>({
        age: 0,
        weight: 0,
        height: 0,
        goal: 'maintain',
        dailyCalorieIntake: 2000,
        dailyCalorieBurn: 400
    })

    const navigate = useNavigate();
    const totalSteps = 3;

    const updateField = (field: keyof ProfileFormData, value: string | number) => {
        setFormData({ ...formData, [field]: value })
    }

    const handleNext = async () => {
        if (step === 1) {
            if (!formData.age || Number(formData.age) < 13 || Number(formData.age) > 120) {
                return toast("Age is required")
            }
        }

        if (step < totalSteps) {
            setStep(step + 1);
            return;
        }

        const userData = {
            ...formData,
            age: formData.age,
            weight: formData.weight,
            height: formData.height ? formData.height : null,
            createdAt: new Date().toISOString()
        };

        localStorage.setItem('fitnessUser', JSON.stringify(userData))

        try {
            const token = localStorage.getItem("token")

            if (!token) {
                return toast.error("Not authenticated")
            }

            if (!user?.id) {
                return toast.error("User not loaded yet")
            }

            await api.put(`/api/users/${user.id}`, userData)
            toast.success('Profile updated successfully')
            setOnboardingCompleted(true)
            await fetchUser(localStorage.getItem("token") || "")
            navigate("/")
        } catch (error: unknown) {
            toast.error(getErrorMessage(error))
        }
    }

    const selectGoal = (goal: string) => {
        const age = Number(formData.age);
        const range = ageRanges.find((r) => age <= r.max) || ageRanges[ageRanges.length - 1]

        let intake = range.maintain;
        let burn = range.burn;

        if (goal === 'lose') {
            intake -= 400;
            burn += 100;
        } else if (goal === 'gain') {
            intake += 500;
            burn -= 100;
        }

        setFormData({
            ...formData,
            goal,
            dailyCalorieIntake: intake,
            dailyCalorieBurn: burn,
        })
    }

    return (
        <>
            <Toaster />
            <div className="onboarding-container">
                <div className="onboarding-wrapper p-6 pt-12">
                    <div className="mb-2 flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-lg bg-linear-to-br from-emerald-400 via-teal-500 to-cyan-500 shadow-lg shadow-emerald-600/25">
                            <PersonStandingIcon className="size-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">FitTrack</h1>
                            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Personal setup</p>
                        </div>
                    </div>
                    <p className="mt-4 text-slate-500 dark:text-slate-400">Let's personalize your experience</p>
                </div>

                <div className="onboarding-wrapper mb-8 px-6">
                    <div className="flex max-w-2xl gap-2">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`h-2 flex-1 rounded-full transition-all duration-300 ${s <= step
                                ? "bg-linear-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/20"
                                : "bg-white/80 dark:bg-slate-800/80"
                                }`} />
                        ))}
                    </div>
                    <p className="mt-3 text-sm text-slate-400">Step {step} of {totalSteps}</p>
                </div>

                <div className="onboarding-wrapper flex-1 px-6">
                    {step === 1 && (
                        <section className="surface-panel reveal-up max-w-2xl rounded-lg p-5 sm:p-6">
                            <div className="mb-8 flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-500/10 dark:border-emerald-500/20">
                                    <User className="size-6 text-emerald-600 dark:text-emerald-400" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">How old are you?</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">This helps us calculate your needs.</p>
                                </div>
                            </div>
                            <Input label="Age" type="number"
                                value={formData.age} onChange={(v) => updateField('age', v)}
                                placeholder="Enter your age" min={13} max={120} required />
                        </section>
                    )}

                    {step === 2 && (
                        <section className="surface-panel reveal-up max-w-2xl rounded-lg p-5 sm:p-6">
                            <div className="mb-8 flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-500/10 dark:border-emerald-500/20">
                                    <ScaleIcon className="size-6 text-emerald-600 dark:text-emerald-400" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Your measurements</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Help us track your progress.</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4">
                                <Input label="Weight (kg)" type="number"
                                    value={formData.weight} onChange={(v) => updateField('weight', v)}
                                    placeholder="Enter your weight" min={20} max={300} required />

                                <Input label="Height (cm) - Optional" type="number"
                                    value={formData.height} onChange={(v) => updateField('height', v)}
                                    placeholder="Enter your height" min={100} max={250} />
                            </div>
                        </section>
                    )}

                    {step === 3 && (
                        <section className="surface-panel reveal-up max-w-2xl rounded-lg p-5 sm:p-6">
                            <div className="mb-8 flex items-center gap-4">
                                <div className="flex size-12 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-500/10 dark:border-emerald-500/20">
                                    <Target className="size-6 text-emerald-600 dark:text-emerald-400" />
                                </div>

                                <div>
                                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">What's your goal?</h2>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">We'll tailor your daily targets.</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {goalOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => selectGoal(option.value)}
                                        className={`onboarding-option-btn ${formData.goal === option.value
                                            ? 'border-emerald-300 bg-emerald-50/80 ring-2 ring-emerald-500/40 dark:border-emerald-500/40 dark:bg-emerald-500/10'
                                            : ''
                                            }`}>
                                        <span className="text-base font-semibold text-slate-700 dark:text-slate-200">
                                            {option.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="my-6 border-t border-slate-200/70 dark:border-white/10"></div>

                            <div className="space-y-6">
                                <h3 className="font-semibold text-slate-900 dark:text-white">Daily targets</h3>

                                <Slider label="Daily Calorie Intake" min={1200} max={4000}
                                    step={50} value={formData.dailyCalorieIntake}
                                    onChange={(v) => updateField('dailyCalorieIntake', v)} unit="kcal"
                                    infoText="The total calories you plan to consume each day." />

                                <Slider label="Daily Calorie Burn" min={100} max={2000}
                                    step={50} value={formData.dailyCalorieBurn}
                                    onChange={(v) => updateField('dailyCalorieBurn', v)} unit="kcal"
                                    infoText="The calories you aim to burn through activity each day." />
                            </div>
                        </section>
                    )}
                </div>

                <div className="onboarding-wrapper p-6 pb-10">
                    <div className="flex gap-3 lg:justify-end">
                        {step > 1 && (
                            <Button variant="secondary" onClick={() => setStep(step > 1 ? step - 1 : 1)}
                                className="max-lg:flex-1 lg:px-10">
                                <span className="flex items-center justify-center gap-2">
                                    <ArrowLeft className="size-5" />
                                    Back
                                </span>
                            </Button>
                        )}
                        <Button onClick={handleNext} className="max-lg:flex-1 lg:px-10">
                            <span className="flex items-center justify-center gap-2">
                                {step === totalSteps ? 'Get Started' : 'Continue'}
                                <ArrowRight className="size-5" />
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Onboarding
