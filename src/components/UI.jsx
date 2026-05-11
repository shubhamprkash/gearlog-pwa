import React from 'react'
import { ChevronDown } from 'lucide-react'

// ─── CARD ──────────────────────────────────────
export function Card({ children, className = '', onClick, ...props }) {
  const base = 'bg-[#1e293b] rounded-2xl border border-[#334155]'
  return onClick
    ? <button onClick={onClick} className={`${base} text-left w-full active:scale-[0.98] transition-transform ${className}`} {...props}>{children}</button>
    : <div className={`${base} ${className}`} {...props}>{children}</div>
}

// ─── INPUT ─────────────────────────────────────
export function Input({ label, icon: Icon, suffix, className = '', ...props }) {
  return (
    <div className={`space-y-1 ${className}`}>
      {label && <label className="text-caps text-[#64748b]">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />}
        <input className={`w-full bg-[#1e293b] border border-[#334155] rounded-xl px-4 py-3 text-[#f1f5f9] text-sm placeholder:text-[#64748b]/40 focus:outline-none focus:border-[#f97316]/50 focus:ring-1 focus:ring-[#f97316]/20 transition ${Icon ? 'pl-10' : ''} ${suffix ? 'pr-12' : ''}`} {...props} />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#64748b]">{suffix}</span>}
      </div>
    </div>
  )
}

// ─── TEXTAREA ──────────────────────────────────
export function Textarea({ label, ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="text-caps text-[#64748b]">{label}</label>}
      <textarea className="w-full bg-[#1e293b] border border-[#334155] rounded-xl px-4 py-3 text-[#f1f5f9] text-sm placeholder:text-[#64748b]/40 focus:outline-none focus:border-[#f97316]/50 resize-none" rows={3} {...props} />
    </div>
  )
}

// ─── SELECT ────────────────────────────────────
export function Select({ label, children, ...props }) {
  return (
    <div className="space-y-1">
      {label && <label className="text-caps text-[#64748b]">{label}</label>}
      <div className="relative">
        <select className="w-full bg-[#1e293b] border border-[#334155] rounded-xl px-4 py-3 text-[#f1f5f9] text-sm appearance-none focus:outline-none focus:border-[#f97316]/50 pr-10" {...props}>
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b] pointer-events-none" />
      </div>
    </div>
  )
}

// ─── TOGGLE PILLS ──────────────────────────────
export function Pills({ label, options, value, onChange }) {
  return (
    <div className="space-y-1">
      {label && <label className="text-caps text-[#64748b]">{label}</label>}
      <div className="flex gap-1 bg-[#0f172a] rounded-xl p-1 border border-[#334155]">
        {options.map(o => (
          <button key={o.value} type="button" onClick={() => onChange(o.value)}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${value === o.value ? 'bg-[#f97316] text-white shadow' : 'text-[#64748b]'}`}>
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── CHIP MULTI-SELECT ─────────────────────────
export function ChipSelect({ label, options, selected = [], onChange }) {
  const toggle = v => selected.includes(v) ? onChange(selected.filter(s => s !== v)) : onChange([...selected, v])
  return (
    <div className="space-y-1">
      {label && <label className="text-caps text-[#64748b]">{label}</label>}
      <div className="flex flex-wrap gap-1.5">
        {options.map(o => (
          <button key={o} type="button" onClick={() => toggle(o)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition ${selected.includes(o) ? 'bg-[#f97316]/15 border-[#f97316] text-[#f97316]' : 'bg-[#1e293b] border-[#334155] text-[#64748b]'}`}>
            {o}{selected.includes(o) && ' ✕'}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── HEALTH RING ───────────────────────────────
export function HealthRing({ percent = 75, size = 44, stroke = 3 }) {
  const r = (size - stroke) / 2, c = 2 * Math.PI * r
  const color = percent >= 75 ? '#22c55e' : percent >= 40 ? '#eab308' : '#ef4444'
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#334155" strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c - (percent/100)*c} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset .8s ease' }} />
      </svg>
      <span className="absolute text-[10px] font-bold" style={{ color }}>{percent}%</span>
    </div>
  )
}

// ─── STATUS DOT ────────────────────────────────
export function StatusDot({ status }) {
  const color = status === 'overdue' ? 'bg-[#ef4444]' : status === 'due_soon' ? 'bg-[#eab308]' : status === 'ok' ? 'bg-[#22c55e]' : 'bg-[#64748b]'
  return <div className={`w-2 h-2 rounded-full ${color}`} />
}

// ─── PAGE SHELL (fixed header + scroll + bottom) ──────────
export function PageShell({ header, footer, children }) {
  return (
    <div className="fixed inset-0 bg-[#0f172a] flex flex-col max-w-md mx-auto">
      {header && <div className="flex-shrink-0 z-10">{header}</div>}
      <div className="flex-1 overflow-y-auto min-h-0">{children}</div>
      {footer && <div className="flex-shrink-0 z-10">{footer}</div>}
    </div>
  )
}

// ─── SCROLLABLE PAGE (for tabbed pages) ────────
export function ScrollPage({ children, className = '' }) {
  return <div className={`min-h-screen bg-[#0f172a] pb-20 ${className}`}>{children}</div>
}

// ─── EMPTY STATE ───────────────────────────────
export function Empty({ icon: Icon, title, message, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {Icon && <div className="w-14 h-14 rounded-2xl bg-[#1e293b] border border-[#334155] flex items-center justify-center mb-3"><Icon className="w-7 h-7 text-[#64748b]" /></div>}
      <h3 className="text-base font-semibold text-[#f1f5f9] mb-1">{title}</h3>
      <p className="text-xs text-[#64748b] mb-5">{message}</p>
      {action && <button onClick={action} className="px-5 py-2.5 bg-[#f97316] text-white rounded-xl font-semibold text-sm active:scale-95 transition">{actionLabel || 'Get Started'}</button>}
    </div>
  )
}
