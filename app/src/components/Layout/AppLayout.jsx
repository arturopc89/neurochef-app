import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import MobileNav from './MobileNav'

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <main className="md:ml-64 pb-20 md:pb-6 px-4 md:px-8 pt-6">
        <Outlet />
      </main>
      <MobileNav />
    </div>
  )
}
