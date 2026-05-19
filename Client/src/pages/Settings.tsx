import { useState } from "react"
import { Link } from "react-router-dom"
import {
    BellIcon,
    BluetoothIcon,
    BotIcon,
    ChevronRightIcon,
    CloudIcon,
    DumbbellIcon,
    HeartPulseIcon,
    LockIcon,
    MoonIcon,
    PlugZapIcon,
    ScaleIcon,
    SettingsIcon,
    ShieldIcon,
    SmartphoneIcon,
    SunIcon,
    TrophyIcon,
    UserIcon,
    WatchIcon,
} from "lucide-react"
import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import { useTheme } from "../context/ThemeContext"
import { useAppContext } from "../context/AppContext"

type DeviceConnection = {
    id: string;
    name: string;
    description: string;
    icon: typeof WatchIcon;
    enabled: boolean;
    accent: string;
}

type ToggleRowProps = {
    title: string;
    description: string;
    enabled: boolean;
    onToggle: () => void;
    icon: typeof BellIcon;
}

const ToggleRow = ({ title, description, enabled, onToggle, icon: Icon }: ToggleRowProps) => (
    <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 rounded-lg border border-slate-200/70 bg-white/60 p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 dark:border-white/10 dark:bg-slate-800/60 dark:hover:border-emerald-500/40">
        <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                <Icon className="size-5 text-emerald-500" />
            </div>
            <div className="min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
            </div>
        </div>
        <span className={`relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300 ${enabled ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`}>
            <span className={`absolute top-1 size-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${enabled ? "translate-x-6" : "translate-x-1"}`} />
        </span>
    </button>
)

const Settings = () => {
    const { theme, toggleTheme } = useTheme()
    const { user } = useAppContext()

    const [devices, setDevices] = useState<DeviceConnection[]>([
        {
            id: "google-fit",
            name: "Google Fit",
            description: "Steps, workouts, and active minutes",
            icon: SmartphoneIcon,
            enabled: false,
            accent: "text-blue-500 bg-blue-500/10",
        },
        {
            id: "apple-health",
            name: "Apple Health",
            description: "Activity, body metrics, and sleep",
            icon: HeartPulseIcon,
            enabled: false,
            accent: "text-rose-500 bg-rose-500/10",
        },
        {
            id: "fitbit",
            name: "Fitbit",
            description: "Wearable sync and calorie burn",
            icon: WatchIcon,
            enabled: true,
            accent: "text-cyan-500 bg-cyan-500/10",
        },
        {
            id: "smart-scale",
            name: "Smart Scale",
            description: "Weight and body composition",
            icon: ScaleIcon,
            enabled: false,
            accent: "text-violet-500 bg-violet-500/10",
        },
    ])

    const [preferences, setPreferences] = useState({
        pushReminders: true,
        weeklyReport: true,
        aiSuggestions: true,
        privateProfile: true,
        communitySharing: false,
        deviceAutoSync: true,
    })

    const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric")
    const [energyUnit, setEnergyUnit] = useState<"kcal" | "kj">("kcal")

    const connectedCount = devices.filter((device) => device.enabled).length

    const toggleDevice = (deviceId: string) => {
        setDevices((currentDevices) =>
            currentDevices.map((device) =>
                device.id === deviceId ? { ...device, enabled: !device.enabled } : device
            )
        )
    }

    const togglePreference = (key: keyof typeof preferences) => {
        setPreferences((currentPreferences) => ({
            ...currentPreferences,
            [key]: !currentPreferences[key],
        }))
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase text-emerald-600 dark:text-emerald-400">Control Center</p>
                        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Devices, privacy, AI support, and app preferences.</p>
                    </div>
                    <div className="rounded-lg border border-emerald-200/70 bg-emerald-500/10 px-4 py-3 text-right dark:border-emerald-500/20">
                        <p className="text-xs font-semibold uppercase text-emerald-700 dark:text-emerald-300">Connected</p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">{connectedCount}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">devices</p>
                    </div>
                </div>
            </div>

            <div className="p-4 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:p-6">
                <div className="space-y-4">
                    <Card>
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-lg bg-cyan-500/10">
                                <PlugZapIcon className="size-6 text-cyan-500" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-900 dark:text-white">Device Connections</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Frontend connection states for upcoming integrations.</p>
                            </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                            {devices.map((device) => (
                                <button
                                    key={device.id}
                                    onClick={() => toggleDevice(device.id)}
                                    className="group rounded-lg border border-slate-200/70 bg-white/60 p-4 text-left shadow-sm shadow-slate-950/5 transition-all duration-300 hover:-translate-y-0.5 hover:border-cyan-300 dark:border-white/10 dark:bg-slate-800/60 dark:hover:border-cyan-500/40">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className={`flex size-11 items-center justify-center rounded-lg ${device.accent}`}>
                                            <device.icon className="size-5 transition-transform duration-300 group-hover:scale-110" />
                                        </div>
                                        <span className={`rounded-lg px-2 py-1 text-xs font-semibold ${device.enabled
                                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                                            : "bg-slate-200/80 text-slate-500 dark:bg-slate-700/70 dark:text-slate-300"
                                            }`}>
                                            {device.enabled ? "Connected" : "Connect"}
                                        </span>
                                    </div>
                                    <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{device.name}</h3>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{device.description}</p>
                                </button>
                            ))}
                        </div>
                    </Card>

                    <Card>
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-lg bg-violet-500/10">
                                <SettingsIcon className="size-6 text-violet-500" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-900 dark:text-white">App Preferences</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Units, theme, reminders, and reports.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-lg border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-800/60">
                                    <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Body Units</p>
                                    <div className="grid grid-cols-2 rounded-lg bg-slate-100/80 p-1 dark:bg-slate-950/60">
                                        {(["metric", "imperial"] as const).map((unit) => (
                                            <button
                                                key={unit}
                                                onClick={() => setUnitSystem(unit)}
                                                className={`rounded-lg px-3 py-2 text-sm font-semibold capitalize transition-all ${unitSystem === unit
                                                    ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-300"
                                                    : "text-slate-500 dark:text-slate-400"
                                                    }`}>
                                                {unit}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="rounded-lg border border-slate-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-slate-800/60">
                                    <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Energy Unit</p>
                                    <div className="grid grid-cols-2 rounded-lg bg-slate-100/80 p-1 dark:bg-slate-950/60">
                                        {(["kcal", "kj"] as const).map((unit) => (
                                            <button
                                                key={unit}
                                                onClick={() => setEnergyUnit(unit)}
                                                className={`rounded-lg px-3 py-2 text-sm font-semibold uppercase transition-all ${energyUnit === unit
                                                    ? "bg-white text-emerald-700 shadow-sm dark:bg-slate-800 dark:text-emerald-300"
                                                    : "text-slate-500 dark:text-slate-400"
                                                    }`}>
                                                {unit}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={toggleTheme}
                                className="flex w-full items-center justify-between rounded-lg border border-slate-200/70 bg-white/60 p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-violet-300 dark:border-white/10 dark:bg-slate-800/60 dark:hover:border-violet-500/40">
                                <div className="flex items-center gap-3">
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-violet-500/10">
                                        {theme === "light" ? <MoonIcon className="size-5 text-violet-500" /> : <SunIcon className="size-5 text-amber-400" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">{theme === "light" ? "Dark Mode" : "Light Mode"}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Switch app appearance.</p>
                                    </div>
                                </div>
                                <ChevronRightIcon className="size-5 text-slate-400" />
                            </button>

                            <ToggleRow
                                title="Push Reminders"
                                description="Meal, hydration, and activity nudges"
                                enabled={preferences.pushReminders}
                                onToggle={() => togglePreference("pushReminders")}
                                icon={BellIcon}
                            />
                            <ToggleRow
                                title="Weekly Reports"
                                description="Progress summary and trend review"
                                enabled={preferences.weeklyReport}
                                onToggle={() => togglePreference("weeklyReport")}
                                icon={CloudIcon}
                            />
                            <ToggleRow
                                title="AI Suggestions"
                                description="Coach tips on meals and activity"
                                enabled={preferences.aiSuggestions}
                                onToggle={() => togglePreference("aiSuggestions")}
                                icon={BotIcon}
                            />
                            <ToggleRow
                                title="Auto Sync Devices"
                                description="Refresh connected device data"
                                enabled={preferences.deviceAutoSync}
                                onToggle={() => togglePreference("deviceAutoSync")}
                                icon={BluetoothIcon}
                            />
                        </div>
                    </Card>
                </div>

                <div className="mt-4 space-y-4 lg:mt-0">
                    <Card>
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-lg bg-slate-500/10">
                                <UserIcon className="size-6 text-slate-500 dark:text-slate-300" />
                            </div>
                            <div className="min-w-0">
                                <h2 className="truncate font-semibold text-slate-900 dark:text-white">{user?.username || "Account"}</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Profile, targets, and account controls.</p>
                            </div>
                        </div>

                        <Link
                            to="/profile"
                            className="flex items-center justify-between rounded-lg border border-slate-200/70 bg-white/60 p-4 font-semibold text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-200">
                            Manage Profile
                            <ChevronRightIcon className="size-5 text-slate-400" />
                        </Link>
                    </Card>

                    <Card>
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-lg bg-rose-500/10">
                                <ShieldIcon className="size-6 text-rose-500" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-slate-900 dark:text-white">Privacy</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Sharing and account protection.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <ToggleRow
                                title="Private Profile"
                                description="Hide body metrics from public views"
                                enabled={preferences.privateProfile}
                                onToggle={() => togglePreference("privateProfile")}
                                icon={LockIcon}
                            />
                            <ToggleRow
                                title="Community Sharing"
                                description="Share streaks and challenge progress"
                                enabled={preferences.communitySharing}
                                onToggle={() => togglePreference("communitySharing")}
                                icon={TrophyIcon}
                            />
                        </div>
                    </Card>

                    <Card className="bg-linear-to-br from-slate-900 to-slate-800 text-white dark:from-slate-800 dark:to-slate-950">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-lg bg-white/10">
                                <TrophyIcon className="size-6 text-amber-300" />
                            </div>
                            <div>
                                <h2 className="font-semibold">Community Preview</h2>
                                <p className="text-sm text-slate-300">Challenges, groups, and shared wins.</p>
                            </div>
                        </div>
                        <div className="grid gap-3">
                            <div className="rounded-lg bg-white/10 p-4">
                                <p className="font-semibold">Weekend Steps Club</p>
                                <p className="mt-1 text-sm text-slate-300">12 members ready for the next challenge.</p>
                            </div>
                            <div className="rounded-lg bg-white/10 p-4">
                                <p className="font-semibold">Protein Streak</p>
                                <p className="mt-1 text-sm text-slate-300">Log a protein anchor for 5 days.</p>
                            </div>
                        </div>
                    </Card>

                    <Button className="w-full">
                        <DumbbellIcon className="size-5" />
                        Save Preference Snapshot
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Settings
