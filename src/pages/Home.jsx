import { Link } from 'react-router-dom'
import { Leaf, Map, Trophy, ArrowRight, Sparkles, TreePine, Recycle } from 'lucide-react'
import Countdown from '../components/Countdown'

export default function Home() {
  // Event end time: today at 4PM local
  const today = new Date()
  const eventEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0, 0)

  const features = [
    {
      icon: Leaf,
      title: 'Carbon Tracker',
      desc: 'Calculate your daily carbon footprint and get a personalized eco action plan.',
      to: '/carbon',
      color: '#34d399',
    },
    {
      icon: Trophy,
      title: 'Treasure Hunt',
      desc: 'Check the live leaderboard and see which team is leading the campus hunt!',
      to: '/leaderboard',
      color: '#fbbf24',
    },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Hero Section */}
      <section className="pt-8 sm:pt-16 pb-12 sm:pb-20 text-center relative">
        {/* Decorative icons */}
        <div className="absolute top-4 left-8 opacity-10 animate-bounce" style={{ animationDuration: '3s' }}>
          <TreePine className="w-12 h-12 text-forest-400" />
        </div>
        <div className="absolute top-16 right-12 opacity-10 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
          <Recycle className="w-10 h-10 text-forest-400" />
        </div>

        <div className="fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-500/10 border border-forest-500/20 text-forest-400 text-xs font-semibold mb-6 tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            April 22, 2026
          </div>
        </div>

        <h1 className="fade-in-up font-display text-4xl sm:text-5xl md:text-7xl font-extrabold leading-tight mb-5" style={{ animationDelay: '0.2s' }}>
          <span className="text-white">UCPC </span>
          <span className="eco-gradient-text">Earth Day</span>
          <br />
          <span className="text-white text-3xl sm:text-4xl md:text-5xl font-bold opacity-80">2026</span>
        </h1>

        <p className="fade-in-up text-earth-400 text-base sm:text-lg max-w-xl mx-auto mb-8 leading-relaxed" style={{ animationDelay: '0.35s' }}>
          Track your carbon footprint, compete in the campus treasure hunt, and take action for a greener tomorrow.
        </p>

        {/* Countdown */}
        <div className="fade-in-up mb-10" style={{ animationDelay: '0.45s' }}>
          <p className="text-earth-500 text-xs font-medium tracking-widest uppercase mb-3">Event Countdown</p>
          <div className="inline-flex glass-card rounded-2xl px-6 py-4">
            <Countdown targetDate={eventEnd.toISOString()} />
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="fade-in-up flex flex-col sm:flex-row items-center justify-center gap-3" style={{ animationDelay: '0.55s' }}>
          <Link
            to="/carbon"
            id="cta-carbon-tracker"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl eco-gradient-btn text-white font-semibold text-sm shadow-lg shadow-forest-500/20 hover:shadow-forest-500/30 transition-shadow duration-300"
          >
            <Leaf className="w-4 h-4" />
            Track Your Carbon
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/leaderboard"
            id="cta-leaderboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-2xl glass-card glass-card-hover text-white font-semibold text-sm"
          >
            <Trophy className="w-4 h-4" />
            View Leaderboard
          </Link>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="pb-16 sm:pb-24 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
        {features.map(({ icon: Icon, title, desc, to, color }, i) => (
          <Link
            key={title}
            to={to}
            id={`feature-${title.toLowerCase().replace(/\s/g, '-')}`}
            className="fade-in-up glass-card glass-card-hover rounded-2xl p-6 sm:p-8 group"
            style={{ animationDelay: `${0.6 + i * 0.15}s` }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: `${color}15` }}
            >
              <Icon className="w-6 h-6" style={{ color }} />
            </div>
            <h2 className="font-display font-bold text-lg text-white mb-2">{title}</h2>
            <p className="text-earth-400 text-sm leading-relaxed">{desc}</p>
            <div className="mt-4 flex items-center gap-1.5 text-sm font-medium transition-all duration-300 group-hover:gap-3" style={{ color }}>
              Explore
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </section>

      {/* Stats */}
      <section className="pb-16 sm:pb-24">
        <div className="glass-card rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: '50+', label: 'Students Joined', icon: '🌱' },
              { value: '4', label: 'Eco Challenges', icon: '🗺️' },
              { value: '0', label: 'Carbon Neutral Goal', icon: '🌍' },
            ].map(({ value, label, icon }) => (
              <div key={label}>
                <div className="text-2xl mb-1">{icon}</div>
                <div className="font-display font-bold text-xl sm:text-2xl text-white">{value}</div>
                <div className="text-earth-500 text-xs mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
