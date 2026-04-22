import { useState, useMemo, useEffect } from 'react'
import {
  Trophy, Plus, Trash2, LogIn, LogOut,
  X, Check, Search, Shield, Clock,
  Crown, Medal, Play, Square, Gift,
} from 'lucide-react'
import Countdown from '../components/Countdown'

/* ─── Constants ─── */
const NUM_CLUES = 4
const ADMIN_PASSWORD = 'earthday2026'
const STORAGE_KEY = 'ucpc_leaderboard_v3'

/* ─── Helpers ─── */
function createEmptyClues() {
  return Array.from({ length: NUM_CLUES }, () => ({ startTime: null, endTime: null }))
}

function loadTeams() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored).map(t => ({
        ...t,
        clues: t.clues && t.clues.length === NUM_CLUES ? t.clues : createEmptyClues(),
      }))
    }
  } catch { /* ignore */ }
  return []
}

function saveTeams(teams) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(teams))
}

function fmt(ms) {
  if (ms == null || ms < 0) return '--:--'
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(sec).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

function fmtClock(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true,
  })
}

function clueElapsed(c, now) {
  if (!c.startTime) return null
  return (c.endTime || now) - c.startTime
}

function teamStats(t, now) {
  const clues = t.clues || createEmptyClues()
  let total = 0, done = 0, running = false
  for (const c of clues) {
    if (c.startTime) {
      total += (c.endTime || now) - c.startTime
      if (c.endTime) done++
      else running = true
    }
  }
  return { total, done, allDone: done === NUM_CLUES, running }
}

/* ─── Sub-components ─── */
function RankBadge({ rank }) {
  if (rank === 1) return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400/30 to-amber-600/10 flex items-center justify-center ring-2 ring-amber-400/30 shrink-0">
      <Crown className="w-5 h-5 text-amber-400" />
    </div>
  )
  if (rank === 2) return (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-300/20 to-slate-400/10 flex items-center justify-center ring-2 ring-slate-300/20 shrink-0">
      <Medal className="w-5 h-5 text-slate-300" />
    </div>
  )
  return (
    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
      <span className="text-sm font-bold text-earth-500">{rank}</span>
    </div>
  )
}

function CluePill({ idx, clue, now, isAdmin, onStart, onStop }) {
  const status = !clue.startTime ? 'idle' : !clue.endTime ? 'running' : 'done'
  const elapsed = clueElapsed(clue, now)

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-[10px] font-semibold text-earth-500 uppercase tracking-wider">
        Clue {idx + 1}
      </span>
      <div
        className={[
          'px-2.5 py-1.5 rounded-lg text-xs font-mono font-semibold min-w-[4rem] text-center transition-all border',
          status === 'idle' && 'bg-white/5 text-earth-600 border-white/5',
          status === 'running' && 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 animate-pulse',
          status === 'done' && 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
        ].filter(Boolean).join(' ')}
      >
        {elapsed != null ? fmt(elapsed) : '--:--'}
      </div>
      {status === 'done' && (
        <span className="text-[9px] text-earth-600 font-mono">{fmtClock(clue.endTime)}</span>
      )}
      {isAdmin && status === 'idle' && (
        <button
          onClick={onStart}
          className="mt-0.5 flex items-center gap-1 px-2 py-1 rounded-md bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 text-[10px] font-semibold transition-all"
        >
          <Play className="w-3 h-3" /> Start
        </button>
      )}
      {isAdmin && status === 'running' && (
        <button
          onClick={onStop}
          className="mt-0.5 flex items-center gap-1 px-2 py-1 rounded-md bg-red-500/15 text-red-400 hover:bg-red-500/25 text-[10px] font-semibold transition-all"
        >
          <Square className="w-3 h-3" /> Stop
        </button>
      )}
      {isAdmin && status === 'done' && (
        <span className="mt-0.5 flex items-center gap-1 text-[10px] text-earth-600">
          <Check className="w-3 h-3" /> Done
        </span>
      )}
    </div>
  )
}

/* ─── Main ─── */
export default function Leaderboard() {
  const [teams, setTeams] = useState(loadTeams)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [addName, setAddName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [now, setNow] = useState(Date.now())

  const today = new Date()
  const eventEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0, 0)

  /* live tick every second when any timer is running */
  useEffect(() => {
    const hasRunning = teams.some(t => (t.clues || []).some(c => c.startTime && !c.endTime))
    if (!hasRunning) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [teams])

  useEffect(() => { saveTeams(teams) }, [teams])

  /* sorted & filtered */
  const sortedTeams = useMemo(() => {
    let r = [...teams]
    if (searchQuery) r = r.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    r.sort((a, b) => {
      const sa = teamStats(a, now), sb = teamStats(b, now)
      if (sa.allDone && !sb.allDone) return -1
      if (!sa.allDone && sb.allDone) return 1
      if (sa.allDone && sb.allDone) return sa.total - sb.total
      if (sa.done !== sb.done) return sb.done - sa.done
      return sa.total - sb.total
    })
    return r
  }, [teams, searchQuery, now])

  /* handlers */
  function handleLogin(e) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true); setShowLogin(false); setPassword(''); setLoginError('')
    } else setLoginError('Incorrect password')
  }

  function addTeam(e) {
    e.preventDefault()
    if (!addName.trim()) return
    const id = Math.max(0, ...teams.map(t => t.id)) + 1
    setTeams(p => [...p, { id, name: addName.trim(), clues: createEmptyClues() }])
    setAddName(''); setShowAddForm(false)
  }

  function startClue(tid, ci) {
    setNow(Date.now())
    setTeams(p => p.map(t => {
      if (t.id !== tid) return t
      const cl = [...t.clues]; cl[ci] = { ...cl[ci], startTime: Date.now() }
      return { ...t, clues: cl }
    }))
  }

  function stopClue(tid, ci) {
    setTeams(p => p.map(t => {
      if (t.id !== tid) return t
      const cl = [...t.clues]; cl[ci] = { ...cl[ci], endTime: Date.now() }
      return { ...t, clues: cl }
    }))
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6">
      {/* ── Header ── */}
      <div className="text-center mb-6 fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-4 tracking-wider uppercase">
          <Trophy className="w-3.5 h-3.5" /> Treasure Hunt
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-2">
          Live <span className="eco-gradient-text">Leaderboard</span>
        </h1>
        <p className="text-earth-400 text-sm sm:text-base mb-4">
          Race through {NUM_CLUES} clues — fastest total time wins! 🏆
        </p>
        <div className="inline-flex glass-card rounded-2xl px-5 py-3 items-center gap-3">
          <Clock className="w-4 h-4 text-earth-500" />
          <Countdown targetDate={eventEnd.toISOString()} />
        </div>
      </div>

      {/* ── Prize Info ── */}
      <div className="fade-in-up flex items-center justify-center gap-4 mb-5" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/15">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs font-semibold text-amber-300">1st — Prize</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-300/10 border border-slate-300/15">
          <Medal className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-xs font-semibold text-slate-300">2nd — Prize</span>
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="fade-in-up flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5" style={{ animationDelay: '0.15s' }}>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-500" />
          <input
            id="search-teams" type="text" placeholder="Search teams..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-earth-600 focus:outline-none focus:border-forest-500/40 focus:ring-1 focus:ring-forest-500/20 transition-all"
          />
        </div>
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <button id="btn-add-team" onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl eco-gradient-btn text-white text-sm font-semibold shadow-lg shadow-forest-500/20">
              <Plus className="w-4 h-4" /> Add Team
            </button>
            <button id="btn-logout" onClick={() => { setIsAdmin(false); setShowAddForm(false) }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-earth-400 hover:text-white text-sm font-medium transition-all hover:border-red-500/30">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button id="btn-admin-login" onClick={() => setShowLogin(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-earth-400 hover:text-white text-sm font-medium transition-all hover:border-forest-500/30">
            <Shield className="w-4 h-4" /> Admin
          </button>
        )}
      </div>

      {/* ── Login Modal ── */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl p-6 sm:p-8 w-full max-w-sm relative">
            <button id="btn-close-login"
              onClick={() => { setShowLogin(false); setLoginError(''); setPassword('') }}
              className="absolute top-4 right-4 text-earth-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-forest-500/15 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-eco-glow" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Admin Access</h3>
              <p className="text-earth-500 text-xs mt-1">Enter admin password to manage the hunt</p>
            </div>
            <form onSubmit={handleLogin}>
              <input id="admin-password" type="password" placeholder="Password"
                value={password} onChange={e => { setPassword(e.target.value); setLoginError('') }}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-earth-600 focus:outline-none focus:border-forest-500/40 focus:ring-1 focus:ring-forest-500/20 transition-all mb-3"
                autoFocus />
              {loginError && <p className="text-red-400 text-xs mb-3 text-center">{loginError}</p>}
              <button type="submit" id="btn-submit-login"
                className="w-full py-3 rounded-xl eco-gradient-btn text-white font-semibold text-sm shadow-lg shadow-forest-500/20">
                <span className="flex items-center justify-center gap-2"><LogIn className="w-4 h-4" /> Login</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Team ── */}
      {showAddForm && isAdmin && (
        <div className="fade-in-up glass-card rounded-2xl p-5 mb-4">
          <form onSubmit={addTeam} className="flex gap-3">
            <input id="add-team-name" type="text" placeholder="Team Name"
              value={addName} onChange={e => setAddName(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-earth-600 focus:outline-none focus:border-forest-500/40 transition-all"
              required />
            <button type="submit" id="btn-confirm-add"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl eco-gradient-btn text-white text-sm font-semibold">
              <Check className="w-4 h-4" /> Add
            </button>
            <button type="button" onClick={() => setShowAddForm(false)}
              className="px-3 py-2.5 rounded-xl bg-white/5 text-earth-400 hover:text-white text-sm transition-colors">
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* ── Team Cards ── */}
      <div className="space-y-3 fade-in-up" style={{ animationDelay: '0.25s' }}>
        {sortedTeams.length === 0 ? (
          <div className="glass-card rounded-2xl py-16 text-center">
            <Trophy className="w-10 h-10 text-earth-600 mx-auto mb-3" />
            <p className="text-earth-500 text-sm">No teams yet. Admin can add teams to start the hunt!</p>
          </div>
        ) : (
          sortedTeams.map((team, idx) => {
            const rank = idx + 1
            const stats = teamStats(team, now)
            const isPrizeWinner = rank <= 2 && stats.allDone

            return (
              <div
                key={team.id}
                className={[
                  'glass-card rounded-2xl p-4 sm:p-5 transition-all duration-300',
                  rank === 1 && stats.allDone && 'ring-1 ring-amber-400/30 bg-amber-500/[0.03]',
                  rank === 2 && stats.allDone && 'ring-1 ring-slate-300/20 bg-slate-300/[0.02]',
                ].filter(Boolean).join(' ')}
              >
                {/* Top row: rank, name, total, actions */}
                <div className="flex items-center gap-3 mb-4">
                  <RankBadge rank={rank} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-semibold text-sm sm:text-base truncate ${rank <= 2 ? 'text-white' : 'text-earth-300'}`}>
                        {team.name}
                      </h3>
                      {isPrizeWinner && (
                        <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                          <Gift className="w-3 h-3" /> Prize
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs text-earth-500">
                        {stats.done}/{NUM_CLUES} clues solved
                      </span>
                      {stats.allDone && (
                        <span className="text-xs font-semibold text-emerald-400">
                          ✓ Finished
                        </span>
                      )}
                      {stats.running && (
                        <span className="text-xs text-amber-400 animate-pulse">
                          ⏱ In progress
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Total time */}
                  <div className="text-right shrink-0">
                    <div className="text-[10px] text-earth-500 uppercase tracking-wider font-semibold mb-0.5">Total</div>
                    <div className={`text-base sm:text-lg font-mono font-bold ${
                      stats.allDone
                        ? rank === 1 ? 'text-amber-400' : rank === 2 ? 'text-slate-300' : 'text-emerald-400'
                        : stats.done > 0 ? 'text-white' : 'text-earth-600'
                    }`}>
                      {stats.done > 0 || stats.running ? fmt(stats.total) : '--:--'}
                    </div>
                  </div>
                  {/* Delete button */}
                  {isAdmin && (
                    <button
                      id={`btn-delete-${team.id}`}
                      onClick={() => setTeams(p => p.filter(t => t.id !== team.id))}
                      className="p-2 rounded-lg bg-white/5 text-earth-500 hover:text-red-400 hover:bg-red-500/10 transition-all shrink-0"
                      title="Delete team"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Clue pills row */}
                <div className="grid grid-cols-4 gap-2 sm:gap-4">
                  {(team.clues || createEmptyClues()).map((clue, ci) => (
                    <CluePill
                      key={ci} idx={ci} clue={clue} now={now} isAdmin={isAdmin}
                      onStart={() => startClue(team.id, ci)}
                      onStop={() => stopClue(team.id, ci)}
                    />
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ── Footer ── */}
      <div className="mt-5 flex items-center justify-between text-xs text-earth-600 fade-in-up" style={{ animationDelay: '0.35s' }}>
        <span>{sortedTeams.length} team{sortedTeams.length !== 1 ? 's' : ''}</span>
        <span>Sorted by fastest finish time</span>
      </div>

      {!isAdmin && (
        <p className="text-center text-earth-600 text-xs mt-3 fade-in-up" style={{ animationDelay: '0.4s' }}>
          💡 Admins can log in to manage teams and control clue timers
        </p>
      )}
    </div>
  )
}
