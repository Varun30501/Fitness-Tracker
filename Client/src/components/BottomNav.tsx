import { Activity, BotIcon, Home, SettingsIcon, Utensils } from "lucide-react"
import { NavLink } from "react-router-dom"


const BottomNav = () => {

    const navItems = [
        { path: '/', label: 'Home', icon:Home },
        { path: '/food', label: 'Food', icon:Utensils },
        { path: '/activity', label: 'Activity', icon:Activity },
        { path: '/coach', label: 'Coach', icon:BotIcon },
        { path: '/settings', label: 'Settings', icon:SettingsIcon },
    ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 lg:hidden">
      <div className="glass-panel mx-auto flex h-16 max-w-lg items-center justify-around rounded-lg px-2">
        {navItems.map((item)=>(
            <NavLink key={item.path} to={item.path} className={({ isActive })=>`flex
            flex-col items-center gap-1 rounded-lg px-3 py-2 transition-all
            duration-300 ${isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-600/25' :
                'text-slate-400 hover:bg-white/70 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800/70 dark:hover:text-slate-200'
            }`}>
                <item.icon className="size-5.5" />
                <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav
