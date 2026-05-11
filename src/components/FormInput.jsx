import React from 'react'

export default function FormInput({
  label, value, onChange, type = 'text', placeholder = '',
  icon: Icon, suffix, required, className = '', ...props
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="text-caps text-muted block">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        )}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`w-full bg-dark-input border border-dark-border rounded-xl px-4 py-3 text-primary text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors ${
            Icon ? 'pl-10' : ''
          } ${suffix ? 'pr-12' : ''}`}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

export function FormTextarea({ label, value, onChange, placeholder = '', rows = 3 }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-caps text-muted block">{label}</label>}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-dark-input border border-dark-border rounded-xl px-4 py-3 text-primary text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors resize-none"
      />
    </div>
  )
}

export function FormToggleGroup({ label, options, value, onChange }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-caps text-muted block">{label}</label>}
      <div className="flex gap-1 bg-dark-bg rounded-xl p-1 border border-dark-border">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
              value === opt.value
                ? 'bg-accent text-white shadow-md'
                : 'text-muted hover:text-primary'
            }`}
          >
            {opt.icon && <span className="mr-1">{opt.icon}</span>}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function FormChipSelect({ label, options, selected = [], onChange }) {
  const toggle = (val) => {
    if (selected.includes(val)) {
      onChange(selected.filter(s => s !== val))
    } else {
      onChange([...selected, val])
    }
  }

  return (
    <div className="space-y-1.5">
      {label && <label className="text-caps text-muted block">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              selected.includes(opt)
                ? 'bg-accent/20 border-accent text-accent'
                : 'bg-dark-card border-dark-border text-muted'
            }`}
          >
            {opt}
            {selected.includes(opt) && <span className="ml-1">✕</span>}
          </button>
        ))}
      </div>
    </div>
  )
}
