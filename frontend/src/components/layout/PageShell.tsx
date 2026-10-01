import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { Logo } from '../Logo'
import { 
  LayoutDashboard, 
  Map, 
  LogOut, 
  LineChart, 
  Wrench, 
  FileClock, 
  Cpu, 
  Factory, 
  Shield, 
  Sparkles,
  ClipboardList
} from 'lucide-react'

export const PageShell = () => {
  const logout = useAuthStore(state => state.logout)
  const user = useAuthStore(state => state.user)
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path

  const roleRaw = (user?.role || 'VIEWER').toUpperCase()
  const role = roleRaw.replace('-', '_')

  // Generate role-specific navigation menu
  const getNavLinks = () => {
    switch (role) {
      case 'ADMIN':
        return [
          { to: '/dashboard', label: 'Admin Console', icon: Shield },
          { to: '/floor', label: 'Cleanroom Floor', icon: Map },
          { to: '/analytics', label: 'Defect Intelligence', icon: Cpu },
          { to: '/maintenance', label: 'Maintenance Operations', icon: Wrench },
          { to: '/history', label: 'System Audit Log', icon: FileClock },
        ]
      case 'PRODUCTION_MANAGER':
      case 'PROD_MGR':
        return [
          { to: '/dashboard', label: 'Production Command', icon: Factory },
          { to: '/floor', label: 'Bay & Tool Floor', icon: Map },
          { to: '/analytics', label: 'Yield & Scrap Analytics', icon: LineChart },
          { to: '/maintenance', label: 'Tool Service Queue', icon: Wrench },
        ]
      case 'MAINTENANCE_ENGINEER':
      case 'MAINT_ENG':
        return [
          { to: '/dashboard', label: 'Engineer Command', icon: Wrench },
          { to: '/maintenance', label: 'Work Orders Queue', icon: ClipboardList },
          { to: '/floor', label: 'Chamber Diagnostics Floor', icon: Map },
          { to: '/history', label: 'Service History Log', icon: FileClock },
        ]
      case 'QUALITY_ENGINEER':
      case 'QUAL_ENG':
        return [
          { to: '/dashboard', label: 'Quality & SPC Command', icon: LineChart },
          { to: '/analytics', label: 'SECOM Defect Model', icon: Cpu },
          { to: '/floor', label: 'Cleanroom Tool Health', icon: Map },
        ]
      case 'VIEWER':
      default:
        return [
          { to: '/dashboard', label: 'Executive Intelligence', icon: Sparkles },
          { to: '/floor', label: 'Facility Cleanroom Bays', icon: Map },
          { to: '/analytics', label: 'Yield Trends Overview', icon: LineChart },
        ]
    }
  }

  const navLinks = getNavLinks()

  const getRoleBadgeColor = () => {
    switch (role) {
      case 'ADMIN': return 'bg-brand/20 text-brand border-brand/30'
      case 'PRODUCTION_MANAGER':
      case 'PROD_MGR': return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      case 'MAINTENANCE_ENGINEER':
      case 'MAINT_ENG': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'QUALITY_ENGINEER':
      case 'QUAL_ENG': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      case 'VIEWER':
      default: return 'bg-white/10 text-white border-white/20'
    }
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden text-text-primary">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col glass-panel z-10">
        <div className="p-6 flex items-center gap-3 border-b border-border/50">
          <div className="drop-shadow-lg">
            <Logo className="w-10 h-10" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">
              FABSENSE
            </span>
            <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
              Smart Cleanroom
            </div>
          </div>
        </div>
        
        {/* Role-Specific Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-text-muted">
            {role.replace('_', ' ')} Workspace
          </div>
          {navLinks.map((item, idx) => {
            const Icon = item.icon
            const active = isActive(item.to)
            return (
              <Link 
                key={idx}
                to={item.to} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  active 
                    ? 'bg-white/10 text-brand shadow-inner border border-white/5 font-semibold' 
                    : 'text-text-secondary hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={18} className={active ? 'text-brand drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]' : ''} />
                <span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className="p-4 border-t border-border/50">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-text-muted hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        <header className="h-16 border-b border-border/30 bg-surface/30 backdrop-blur-md flex items-center px-8 justify-between z-10">
          <div className="text-xs font-mono text-text-secondary uppercase tracking-wider flex items-center gap-2">
            <span>Cleanroom Control</span>
            <span className="text-border">/</span>
            <span className="text-white font-bold">{location.pathname.replace('/', '') || 'portal'}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 text-xs font-mono font-bold border rounded-lg tracking-wider uppercase ${getRoleBadgeColor()}`}>
              {role.replace('_', ' ')}
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-status-running/10 border border-status-running/20">
              <div className="w-2 h-2 rounded-full bg-status-running shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></div>
              <span className="text-[11px] font-mono font-bold text-status-running uppercase">Live Sim</span>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-8 relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
