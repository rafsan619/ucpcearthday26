import { useState, useMemo, useEffect } from 'react'
import {
  Trophy, Plus, Pencil, Trash2, LogIn, LogOut,
  X, Check, ChevronUp, ChevronDown, Search,
  Shield, Clock, Medal, Star, Crown,
} from 'lucide-react'
import Countdown from '../components/Countdown'

/* ─── Initial Data ─── */
const INITIAL_TEAMS = [
  { id: 1, name: 'Green Goblins', challenges: 8, points: 420 },
  { id: 2, name: 'Eco Warriors', challenges: 7, points: 385 },
  { id: 3, name: 'Planet Protectors', challenges: 6, points: 340 },
  { id: 4, name: 'Leaf Legends', challenges: 5, points: 275 },
  { id: 5, name: 'Terra Force', challenges: 4, points: 220 },
  { id: 6, name: 'Carbon Crushers', challenges: 3, points: 180 },
]

const ADMIN_PASSWORD = 'earthday2026'

const STORAGE_KEY = 'ucpc_leaderboard_teams'

function loadTeams() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return INITIAL_TEAMS
}

function saveTeams(teams) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teams))
}

/* ─── Medal Component ─── */
function RankBadge({ rank }) {
  if (rank === 1) return (
    <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
      <Crown className="w-4 h-4 text-amber-400" />
    </div>
  )
  if (rank === 2) return (
    <div className="w-8 h-8 rounded-full bg-slate-300/15 flex items-center justify-center">
      <Medal className="w-4 h-4 text-slate-300" />
    </div>
  )
  if (rank === 3) return (
    <div className="w-8 h-8 rounded-full bg-amber-700/20 flex items-center justify-center">
      <Medal className="w-4 h-4 text-amber-600" />
    </div>
  )
  return (
    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
      <span className="text-xs font-bold text-earth-500">{rank}</span>
    </div>
  )
}

/* ─── Component ─── */
export default function Leaderboard() {
  const [teams, setTeams] = useState(loadTeams)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ name: '', challenges: 0, points: 0 })
  const [showAddForm, setShowAddForm] = useState(false)
  const [addForm, setAddForm] = useState({ name: '', challenges: 0, points: 0 })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState('points')
  const [sortDir, setSortDir] = useState('desc')

  // Event end time: today at 6PM local
  const today = new Date()
  const eventEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0, 0)

  // Persist teams
  useEffect(() => {
    saveTeams(teams)
  }, [teams])

  // Sorted & filtered teams
  const sortedTeams = useMemo(() => {
    let result = [...teams]
    if (searchQuery) {
      result = result.filter(t =>
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    result.sort((a, b) => {
      const mul = sortDir === 'desc' ? -1 : 1
      return (a[sortField] - b[sortField]) * mul
    })
    return result
  }, [teams, searchQuery, sortField, sortDir])

  function handleLogin(e) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      setShowLogin(false)
      setPassword('')
      setLoginError('')
    } else {
      setLoginError('Incorrect password')
    }
  }

  function handleLogout() {
    setIsAdmin(false)
    setEditingId(null)
    setShowAddForm(false)
  }

  function handleSort(field) {
    if (sortField === field) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  function startEdit(team) {
    setEditingId(team.id)
    setEditForm({ name: team.name, challenges: team.challenges, points: team.points })
  }

  function saveEdit() {
    setTeams(prev =>
      prev.map(t => t.id === editingId ? { ...t, ...editForm } : t)
    )
    setEditingId(null)
  }

  function deleteTeam(id) {
    setTeams(prev => prev.filter(t => t.id !== id))
  }

  function addTeam(e) {
    e.preventDefault()
    if (!addForm.name.trim()) return
    const newId = Math.max(0, ...teams.map(t => t.id)) + 1
    setTeams(prev => [...prev, { id: newId, ...addForm, name: addForm.name.trim() }])
    setAddForm({ name: '', challenges: 0, points: 0 })
    setShowAddForm(false)
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronDown className="w-3 h-3 opacity-30" />
    return sortDir === 'desc'
      ? <ChevronDown className="w-3 h-3 text-eco-glow" />
      : <ChevronUp className="w-3 h-3 text-eco-glow" />
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-6 fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4 tracking-wider uppercase">
          <Trophy className="w-3.5 h-3.5" />
          Treasure Hunt
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Live <span className="eco-gradient-text">Leaderboard</span>
        </h1>
        <p className="text-earth-400 text-sm sm:text-base mb-4">
          Real-time scores from the campus treasure hunt.
        </p>

        {/* Countdown */}
        <div className="inline-flex glass-card rounded-2xl px-5 py-3 items-center gap-3">
          <Clock className="w-4 h-4 text-earth-500" />
          <Countdown targetDate={eventEnd.toISOString()} />
        </div>
      </div>

      {/* Controls Bar */}
      <div className="fade-in-up flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4" style={{ animationDelay: '0.15s' }}>
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-500" />
          <input
            id="search-teams"
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-earth-600 focus:outline-none focus:border-forest-500/40 focus:ring-1 focus:ring-forest-500/20 transition-all"
          />
        </div>

        {/* Admin Controls */}
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <button
              id="btn-add-team"
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl eco-gradient-btn text-white text-sm font-semibold shadow-lg shadow-forest-500/20"
            >
              <Plus className="w-4 h-4" />
              Add Team
            </button>
            <button
              id="btn-logout"
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-earth-400 hover:text-white text-sm font-medium transition-all hover:border-red-500/30"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            id="btn-admin-login"
            onClick={() => setShowLogin(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-earth-400 hover:text-white text-sm font-medium transition-all hover:border-forest-500/30"
          >
            <Shield className="w-4 h-4" />
            Admin
          </button>
        )}
      </div>

      {/* Admin Login Overlay */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 sm:p-8 w-full max-w-sm relative">
            <button
              id="btn-close-login"
              onClick={() => { setShowLogin(false); setLoginError(''); setPassword('') }}
              className="absolute top-4 right-4 text-earth-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-forest-500/15 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-eco-glow" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Admin Access</h3>
              <p className="text-earth-500 text-xs mt-1">Enter the admin password to manage scores</p>
            </div>
            <form onSubmit={handleLogin}>
              <input
                id="admin-password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => { setPassword(e.target.value); setLoginError('') }}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-earth-600 focus:outline-none focus:border-forest-500/40 focus:ring-1 focus:ring-forest-500/20 transition-all mb-3"
                autoFocus
              />
              {loginError && (
                <p className="text-red-400 text-xs mb-3 text-center">{loginError}</p>
              )}
              <button
                type="submit"
                id="btn-submit-login"
                className="w-full py-3 rounded-xl eco-gradient-btn text-white font-semibold text-sm shadow-lg shadow-forest-500/20"
              >
                <span className="flex items-center justify-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Login
                </span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Team Form */}
      {showAddForm && isAdmin && (
        <div className="fade-in-up glass-card rounded-2xl p-5 mb-4">
          <form onSubmit={addTeam} className="flex flex-col sm:flex-row gap-3">
            <input
              id="add-team-name"
              type="text"
              placeholder="Team Name"
              value={addForm.name}
              onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-earth-600 focus:outline-none focus:border-forest-500/40 transition-all"
              required
            />
            <input
              id="add-team-challenges"
              type="number"
              min="0"
              placeholder="Challenges"
              value={addForm.challenges || ''}
              onChange={e => setAddForm(f => ({ ...f, challenges: parseInt(e.target.value) || 0 }))}
              className="w-full sm:w-28 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-earth-600 focus:outline-none focus:border-forest-500/40 transition-all"
            />
            <input
              id="add-team-points"
              type="number"
              min="0"
              placeholder="Points"
              value={addForm.points || ''}
              onChange={e => setAddForm(f => ({ ...f, points: parseInt(e.target.value) || 0 }))}
              className="w-full sm:w-28 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-earth-600 focus:outline-none focus:border-forest-500/40 transition-all"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                id="btn-confirm-add"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl eco-gradient-btn text-white text-sm font-semibold"
              >
                <Check className="w-4 h-4" />
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2.5 rounded-xl bg-white/5 text-earth-400 hover:text-white text-sm transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="fade-in-up glass-card rounded-2xl overflow-hidden" style={{ animationDelay: '0.25s' }}>
        {/* Table Header */}
        <div className="grid grid-cols-[auto_1fr_auto_auto] sm:grid-cols-[3rem_1fr_7rem_7rem_auto] gap-2 sm:gap-4 px-4 sm:px-6 py-3 border-b border-white/5 bg-white/[0.02]">
          <span className="text-xs text-earth-500 font-medium">#</span>
          <span className="text-xs text-earth-500 font-medium">Team</span>
          <button
            onClick={() => handleSort('challenges')}
            className="hidden sm:flex items-center gap-1 text-xs text-earth-500 font-medium hover:text-white transition-colors"
          >
            Challenges <SortIcon field="challenges" />
          </button>
          <button
            onClick={() => handleSort('points')}
            className="flex items-center gap-1 text-xs text-earth-500 font-medium hover:text-white transition-colors"
          >
            Points <SortIcon field="points" />
          </button>
          {isAdmin && <span className="text-xs text-earth-500 font-medium text-right">Actions</span>}
        </div>

        {/* Rows */}
        {sortedTeams.length === 0 ? (
          <div className="py-12 text-center text-earth-500 text-sm">
            No teams found.
          </div>
        ) : (
          sortedTeams.map((team, idx) => {
            const rank = idx + 1
            const isEditing = editingId === team.id
            const isTop3 = rank <= 3

            return (
              <div
                key={team.id}
                className={`grid grid-cols-[auto_1fr_auto_auto] sm:grid-cols-[3rem_1fr_7rem_7rem_auto] gap-2 sm:gap-4 px-4 sm:px-6 py-3.5 items-center border-b border-white/[0.03] transition-all duration-300 ${
                  isTop3 ? 'bg-white/[0.02]' : 'hover:bg-white/[0.02]'
                }`}
              >
                {/* Rank */}
                <RankBadge rank={rank} />

                {/* Team Name */}
                {isEditing ? (
                  <input
                    id={`edit-name-${team.id}`}
                    type="text"
                    value={editForm.name}
                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-forest-500/30 text-white text-sm focus:outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`font-semibold text-sm truncate ${isTop3 ? 'text-white' : 'text-earth-300'}`}>
                      {team.name}
                    </span>
                    {rank === 1 && <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />}
                  </div>
                )}

                {/* Challenges */}
                {isEditing ? (
                  <input
                    id={`edit-challenges-${team.id}`}
                    type="number"
                    min="0"
                    value={editForm.challenges}
                    onChange={e => setEditForm(f => ({ ...f, challenges: parseInt(e.target.value) || 0 }))}
                    className="hidden sm:block w-full px-3 py-1.5 rounded-lg bg-white/5 border border-forest-500/30 text-white text-sm focus:outline-none"
                  />
                ) : (
                  <span className="hidden sm:block text-sm text-earth-400 font-mono">{team.challenges}</span>
                )}

                {/* Points */}
                {isEditing ? (
                  <input
                    id={`edit-points-${team.id}`}
                    type="number"
                    min="0"
                    value={editForm.points}
                    onChange={e => setEditForm(f => ({ ...f, points: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-forest-500/30 text-white text-sm focus:outline-none"
                  />
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-bold font-mono ${
                      rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-slate-300' : rank === 3 ? 'text-amber-600' : 'text-white'
                    }`}>
                      {team.points.toLocaleString()}
                    </span>
                    <span className="text-earth-600 text-xs">pts</span>
                  </div>
                )}

                {/* Admin Actions */}
                {isAdmin && (
                  <div className="flex items-center justify-end gap-1">
                    {isEditing ? (
                      <>
                        <button
                          id={`btn-save-${team.id}`}
                          onClick={saveEdit}
                          className="p-1.5 rounded-lg bg-forest-500/15 text-eco-glow hover:bg-forest-500/25 transition-colors"
                          title="Save"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="p-1.5 rounded-lg bg-white/5 text-earth-400 hover:text-white transition-colors"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          id={`btn-edit-${team.id}`}
                          onClick={() => startEdit(team)}
                          className="p-1.5 rounded-lg bg-white/5 text-earth-400 hover:text-white hover:bg-white/10 transition-all"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          id={`btn-delete-${team.id}`}
                          onClick={() => deleteTeam(team.id)}
                          className="p-1.5 rounded-lg bg-white/5 text-earth-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 bg-white/[0.02] border-t border-white/5 flex items-center justify-between">
          <span className="text-xs text-earth-600">{sortedTeams.length} team{sortedTeams.length !== 1 ? 's' : ''}</span>
          <span className="text-xs text-earth-600">Auto-sorted by {sortField}</span>
        </div>
      </div>

      {/* Admin hint */}
      {!isAdmin && (
        <p className="text-center text-earth-600 text-xs mt-4 fade-in-up" style={{ animationDelay: '0.4s' }}>
          💡 Admins can log in to edit scores in real-time
        </p>
      )}
    </div>
  )
}
