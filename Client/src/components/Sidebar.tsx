import { ActivityIcon, BotIcon, HomeIcon, MoonIcon, PersonStandingIcon, SettingsIcon, SunIcon, UserIcon, UtensilsIcon, } from "lucide-react"
import { useTheme } from "../context/ThemeContext"
import { NavLink } from "react-router-dom"


const Sidebar = () => {

    const navItems = [
        { path: '/', label: 'Home', icon: HomeIcon },
        { path: '/food', label: 'Food', icon: UtensilsIcon },
        { path: '/activity', label: 'Activity', icon: ActivityIcon },
        { path: '/coach', label: 'AI Coach', icon: BotIcon },
        { path: '/settings', label: 'Settings', icon: SettingsIcon },
        { path: '/profile', label: 'Profile', icon: UserIcon },
    ]

    const { theme, toggleTheme } = useTheme()

    return (
        <nav className="hidden min-h-screen w-72 shrink-0 flex-col border-r border-white/70 bg-white/80 p-6 shadow-xl shadow-emerald-950/10 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/70 dark:shadow-black/25 lg:flex">
            <div className="mb-8 flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-lg bg-linear-to-br from-emerald-400 via-teal-500 to-cyan-500 shadow-lg shadow-emerald-600/25">
                    <PersonStandingIcon className="size-8 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">FitTrack</h1>
                    <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Nutrition OS</p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                    <NavLink key={item.path} to={item.path}
                        className={({ isActive }) => `group flex items-center gap-3 rounded-lg px-4 py-3.5 transition-all duration-300 ${isActive ? 'bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-600/20'
                                : 'text-slate-500 hover:-translate-y-0.5 hover:bg-white/70 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100'}`}>
                        <item.icon className='size-5 transition-transform duration-300 group-hover:scale-110' />
                        <span className="text-base">{item.label}</span>
                    </NavLink>
                ))}
            </div>

            <div className="mt-auto border-t border-slate-200/70 pt-6 dark:border-white/10">
                <button
                    onClick={toggleTheme}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-4 py-3 text-slate-500 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/70 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100">
                    {theme === 'light' ? <MoonIcon className="size-5" /> : <SunIcon className="size-5" />}
                    <span className="text-base">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                </button>
            </div>
        </nav>

    )
}

export default Sidebar
