import { NavLink, Outlet } from 'react-router-dom'
import { Home, Map, Trophy, Menu, X } from 'lucide-react'
import { useState } from 'react'
import ParticleBackground from './ParticleBackground'

const navItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/carbon', label: 'Carbon Tracker', icon: Map },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
]

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-forest-700/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2.5 group">
              <img
                src="/ucpc-logo.png"
                alt="UCPC Logo"
                className="h-9 w-auto object-contain"
              />
              <div className="hidden sm:block">
                <span className="font-display font-bold text-lg eco-gradient-text">UCPC</span>
                <span className="text-earth-400 text-sm ml-1.5 font-medium">Earth Day '26</span>
              </div>
            </NavLink>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? 'bg-forest-500/15 text-eco-glow eco-glow'
                        : 'text-earth-400 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </NavLink>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-earth-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pb-4 pt-1 space-y-1 border-t border-forest-700/20">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'bg-forest-500/15 text-eco-glow'
                      : 'text-earth-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="pt-20 pb-12 min-h-screen">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-forest-700/20 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-earth-500 text-xs">
            © 2026 UCPC Earth Day. Built for a greener campus.
          </p>
          <div className="flex items-center gap-2 text-xs text-earth-500">
            <img src="/ucpc-logo.png" alt="UCPC" className="h-4 w-auto opacity-60" />
            <span>Powered by green energy & good vibes</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
