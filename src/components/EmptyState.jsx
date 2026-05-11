import React from 'react'
import { PackageOpen } from 'lucide-react'

export default function EmptyState({ icon: Icon = PackageOpen, title = 'Nothing here yet', message = 'Start by adding your first entry', action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-16 h-16 rounded-2xl bg-dark-card border border-dark-border flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-primary mb-1">{title}</h3>
      <p className="text-sm text-muted mb-6">{message}</p>
      {action && (
        <button
          onClick={action}
          className="px-6 py-2.5 bg-accent text-white rounded-xl font-semibold text-sm active:scale-95 transition-transform"
        >
          {actionLabel || 'Get Started'}
        </button>
      )}
    </div>
  )
}
