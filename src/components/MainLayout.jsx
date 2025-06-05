import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 md:ml-64 min-h-screen flex flex-col">
        <Header />
        <main className="p-6 bg-gray-50 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default MainLayout
