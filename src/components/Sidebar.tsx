interface SidebarProps {
  isOpen: boolean
  currentPage: string
  onNavigate: (page: 'dashboard' | 'find-doctors' | 'appointments') => void
}

export default function Sidebar({ isOpen, currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 16l4-4m0 0l4 4m-4-4V5" />
        </svg>
      ),
    },
    {
      id: 'find-doctors',
      label: 'Find Doctors & Clinics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      id: 'appointments',
      label: 'My Appointments',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ]

  return (
    <aside
      className={`fixed left-0 top-14 h-[calc(100vh-56px)] bg-white border-r border-gray-200 transition-all duration-300 z-30 ${
        isOpen ? 'w-64' : '-translate-x-full w-64'
      }`}
    >
      <div className="p-6">
        <div className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as any)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-all ${
                currentPage === item.id
                  ? 'bg-blue-100 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
        <div className="space-y-3">
          <button className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left">
            Settings
          </button>
          <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left">
            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}
