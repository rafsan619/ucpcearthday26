import { useState, useMemo } from 'react'
import {
  Bike, Car, Bus, Salad, Drumstick, Beef,
  Recycle, Trash2, PackageOpen, Leaf, RotateCcw,
  ArrowRight, ArrowLeft, CheckCircle2, Lightbulb, Zap,
} from 'lucide-react'
import GaugeChart from '../components/GaugeChart'

/* ─── Data ─── */
const categories = [
  {
    id: 'transport',
    title: 'How do you commute?',
    subtitle: 'Select your primary mode of transport to campus',
    icon: Car,
    options: [
      { id: 'walk', label: 'Walk / Bike', icon: Bike, points: 0, color: '#34d399' },
      { id: 'transit', label: 'Public Transit', icon: Bus, points: 10, color: '#60a5fa' },
      { id: 'drive', label: 'Driving Solo', icon: Car, points: 50, color: '#f87171' },
    ],
  },
  {
    id: 'dining',
    title: 'What\'s your diet like?',
    subtitle: 'Your food choices have a big impact on CO₂ emissions',
    icon: Salad,
    options: [
      { id: 'plant', label: 'Plant-based', icon: Salad, points: 5, color: '#34d399' },
      { id: 'low-meat', label: 'Low Meat', icon: Drumstick, points: 20, color: '#fbbf24' },
      { id: 'high-meat', label: 'High Meat', icon: Beef, points: 45, color: '#f87171' },
    ],
  },
  {
    id: 'plastic',
    title: 'Plastic usage habits?',
    subtitle: 'Single-use plastics contribute heavily to pollution',
    icon: Recycle,
    options: [
      { id: 'reusable', label: 'Reusable Bottle', icon: Recycle, points: 0, color: '#34d399' },
      { id: 'single-use', label: 'Single-use Plastic', icon: PackageOpen, points: 15, color: '#f87171' },
    ],
  },
]

/* ─── Action Plan Data ─── */
function getActionPlan(selections) {
  const tips = []

  if (selections.transport === 'drive') {
    tips.push({
      icon: Car,
      title: 'Try Carpooling',
      desc: 'Share rides with classmates or use the campus shuttle. You can cut your transport emissions by up to 75%!',
      impact: 'High',
    })
  } else if (selections.transport === 'transit') {
    tips.push({
      icon: Bus,
      title: 'Great Choice!',
      desc: 'Public transit is a solid option. For even lower impact, try biking on nice days!',
      impact: 'Low',
    })
  }

  if (selections.dining === 'high-meat') {
    tips.push({
      icon: Salad,
      title: 'Try Meatless Mondays',
      desc: 'Swapping meat for plant-based meals just one day a week can reduce your food carbon footprint by 15%.',
      impact: 'High',
    })
  } else if (selections.dining === 'low-meat') {
    tips.push({
      icon: Drumstick,
      title: 'Reduce Red Meat',
      desc: 'Switch beef for chicken or fish — the carbon difference is significant.',
      impact: 'Medium',
    })
  }

  if (selections.plastic === 'single-use') {
    tips.push({
      icon: Recycle,
      title: 'Switch to Reusable',
      desc: 'Carry a reusable bottle and bag. Each reusable bottle saves ~150 plastic bottles per year!',
      impact: 'Medium',
    })
  }

  if (tips.length === 0) {
    tips.push({
      icon: Leaf,
      title: 'You\'re an Eco Champion! 🌟',
      desc: 'Your habits are already planet-friendly. Keep inspiring others and spread the word!',
      impact: 'None',
    })
  }

  return tips
}

/* ─── Component ─── */
export default function CarbonCalculator() {
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState({})
  const [showResults, setShowResults] = useState(false)

  const totalScore = useMemo(() => {
    return categories.reduce((sum, cat) => {
      const selected = cat.options.find(o => o.id === selections[cat.id])
      return sum + (selected?.points || 0)
    }, 0)
  }, [selections])

  const allSelected = categories.every(cat => selections[cat.id])
  const currentCat = categories[step]
  const isLastStep = step === categories.length - 1
  const actionPlan = useMemo(() => getActionPlan(selections), [selections])

  function handleSelect(catId, optionId) {
    setSelections(prev => ({ ...prev, [catId]: optionId }))
  }

  function handleNext() {
    if (isLastStep && allSelected) {
      setShowResults(true)
    } else if (step < categories.length - 1) {
      setStep(s => s + 1)
    }
  }

  function handleBack() {
    if (showResults) {
      setShowResults(false)
    } else if (step > 0) {
      setStep(s => s - 1)
    }
  }

  function handleReset() {
    setStep(0)
    setSelections({})
    setShowResults(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      {/* Header */}
      <div className="text-center mb-8 fade-in-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-500/10 border border-forest-500/20 text-forest-400 text-xs font-semibold mb-4 tracking-wider uppercase">
          <Zap className="w-3.5 h-3.5" />
          Carbon Footprint Calculator
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white mb-2">
          What's Your <span className="eco-gradient-text">Impact</span>?
        </h1>
        <p className="text-earth-400 text-sm sm:text-base">
          Answer 3 quick questions to find out your daily carbon score.
        </p>
      </div>

      {/* Progress Bar */}
      {!showResults && (
        <div className="mb-8 fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-earth-500 font-medium">
              Step {step + 1} of {categories.length}
            </span>
            <span className="text-xs text-earth-500 font-medium">
              {Math.round(((step + (selections[currentCat.id] ? 1 : 0)) / categories.length) * 100)}%
            </span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((step + (selections[currentCat.id] ? 1 : 0)) / categories.length) * 100}%`,
                background: 'linear-gradient(90deg, #059669, #34d399)',
              }}
            />
          </div>
          {/* Step dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                id={`step-dot-${cat.id}`}
                onClick={() => setStep(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'bg-eco-glow scale-125 shadow-lg shadow-eco-glow/30'
                    : selections[cat.id]
                    ? 'bg-forest-600'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Question Card */}
      {!showResults ? (
        <div className="fade-in-up" style={{ animationDelay: '0.25s' }} key={step}>
          <div className="glass-card rounded-2xl p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-forest-500/15 flex items-center justify-center">
                <currentCat.icon className="w-5 h-5 text-eco-glow" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-white">{currentCat.title}</h2>
                <p className="text-earth-500 text-xs">{currentCat.subtitle}</p>
              </div>
            </div>

            <div className="grid gap-3">
              {currentCat.options.map(opt => {
                const isSelected = selections[currentCat.id] === opt.id
                return (
                  <button
                    key={opt.id}
                    id={`option-${opt.id}`}
                    onClick={() => handleSelect(currentCat.id, opt.id)}
                    className={`option-card glass-card flex items-center gap-4 p-4 sm:p-5 rounded-xl text-left w-full border ${
                      isSelected
                        ? 'selected border-eco-glow/40'
                        : 'border-transparent hover:border-white/10'
                    }`}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300"
                      style={{
                        backgroundColor: isSelected ? `${opt.color}20` : 'rgba(255,255,255,0.04)',
                      }}
                    >
                      <opt.icon
                        className="w-5 h-5 transition-colors duration-300"
                        style={{ color: isSelected ? opt.color : '#78716c' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`font-semibold text-sm transition-colors duration-300 ${isSelected ? 'text-white' : 'text-earth-300'}`}>
                        {opt.label}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs font-mono" style={{ color: opt.color }}>
                          +{opt.points}
                        </span>
                        <span className="text-earth-600 text-xs">CO₂ pts</span>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-eco-glow shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
              <button
                id="btn-back"
                onClick={handleBack}
                disabled={step === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-earth-400 hover:text-white hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                id="btn-next"
                onClick={handleNext}
                disabled={!selections[currentCat.id]}
                className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed ${
                  isLastStep && allSelected
                    ? 'eco-gradient-btn text-white shadow-lg shadow-forest-500/20'
                    : 'bg-white/10 text-white hover:bg-white/15'
                }`}
              >
                {isLastStep ? 'See Results' : 'Next'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ─── Results View ─── */
        <div className="space-y-6">
          {/* Score Card */}
          <div className="fade-in-up glass-card rounded-2xl p-6 sm:p-8 text-center">
            <h2 className="font-display font-bold text-xl text-white mb-6">Your Carbon Score</h2>
            <GaugeChart score={totalScore} />

            {/* Breakdown */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {categories.map(cat => {
                const sel = cat.options.find(o => o.id === selections[cat.id])
                return (
                  <div key={cat.id} className="bg-white/[0.03] rounded-xl p-3">
                    <cat.icon className="w-4 h-4 text-earth-500 mx-auto mb-1.5" />
                    <div className="text-xs text-earth-400 mb-0.5 truncate">{sel?.label}</div>
                    <div className="text-sm font-bold font-mono" style={{ color: sel?.color }}>
                      +{sel?.points}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Plan */}
          <div className="fade-in-up glass-card rounded-2xl p-6 sm:p-8" style={{ animationDelay: '0.15s' }}>
            <div className="flex items-center gap-2 mb-5">
              <Lightbulb className="w-5 h-5 text-amber-400" />
              <h2 className="font-display font-bold text-lg text-white">Your Action Plan</h2>
            </div>
            <div className="space-y-3">
              {actionPlan.map((tip, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 hover:border-forest-500/20 transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-xl bg-forest-500/10 flex items-center justify-center shrink-0">
                    <tip.icon className="w-5 h-5 text-eco-glow" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white mb-1">{tip.title}</h3>
                    <p className="text-earth-400 text-xs leading-relaxed">{tip.desc}</p>
                    {tip.impact !== 'None' && (
                      <span className={`inline-block mt-2 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                        tip.impact === 'High' ? 'bg-red-500/15 text-red-400' :
                        tip.impact === 'Medium' ? 'bg-amber-500/15 text-amber-400' :
                        'bg-green-500/15 text-green-400'
                      }`}>
                        {tip.impact} Impact
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <div className="fade-in-up text-center" style={{ animationDelay: '0.3s' }}>
            <button
              id="btn-reset"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl glass-card text-earth-300 hover:text-white text-sm font-medium transition-all hover:border-forest-500/30"
            >
              <RotateCcw className="w-4 h-4" />
              Calculate Again
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
