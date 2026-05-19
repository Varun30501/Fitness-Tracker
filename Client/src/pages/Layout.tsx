import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import BottomNav from "../components/BottomNav"

const Layout = () => {
    return (
        <div className="layout-container">
            <Sidebar />
            <div className="app-scrollbar flex-1 overflow-y-auto">
                <Outlet />
            </div>
            <BottomNav />
        </div>
    )
}

export default Layout
