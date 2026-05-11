import React from 'react'

export function SkeletonCard() {
  return (
    <div className="bg-dark-card rounded-2xl border border-dark-border p-4 space-y-3">
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
      <div className="skeleton h-8 w-full rounded" />
      <div className="flex gap-2">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-3 w-1/4 rounded" />
      </div>
    </div>
  )
}

export function SkeletonList({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonVehicleCard() {
  return (
    <div className="min-w-[280px] bg-dark-card rounded-2xl border border-dark-border p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="skeleton w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="skeleton h-4 w-2/3 rounded" />
          <div className="skeleton h-3 w-1/2 rounded" />
        </div>
      </div>
      <div className="skeleton h-6 w-full rounded" />
      <div className="skeleton h-3 w-1/3 rounded" />
    </div>
  )
}
