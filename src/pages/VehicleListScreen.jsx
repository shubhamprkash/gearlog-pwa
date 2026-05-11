import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../contexts/DataContext'
import HealthRing from '../components/HealthRing'
import EmptyState from '../components/EmptyState'
import { SkeletonList } from '../components/Skeleton'
import { Car, Bike, Plus, ChevronRight, Gauge } from 'lucide-react'

export default function VehicleListScreen() {
  const navigate = useNavigate()
  const { vehicles, loading } = useData()

  return (
    <div className="min-h-screen bg-dark-bg pb-24">
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Your Fleet</h1>
          <p className="text-sm text-muted">{vehicles.length} of 4 vehicle slots used</p>
        </div>
        {vehicles.length < 4 && (
          <button
            onClick={() => navigate('/add-vehicle')}
            className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center shadow-md shadow-accent/25"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        )}
      </div>

      <div className="px-5 space-y-3">
        {loading ? (
          <SkeletonList count={3} />
        ) : vehicles.length === 0 ? (
          <EmptyState
            icon={Car}
            title="No vehicles yet"
            message="Add your first vehicle to start tracking"
            action={() => navigate('/add-vehicle')}
            actionLabel="Add Vehicle"
          />
        ) : (
          vehicles.map(v => (
            <button
              key={v.id}
              onClick={() => navigate(`/vehicle/${v.id}`)}
              className="w-full bg-dark-card rounded-2xl border border-dark-border p-4 text-left active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  {v.type === 'bike' ? <Bike className="w-6 h-6 text-accent" /> : <Car className="w-6 h-6 text-accent" />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-primary truncate">{v.nickname}</h3>
                  <p className="text-xs text-muted">{v.make} / {v.model} {v.year && `• ${v.year}`}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Gauge className="w-3 h-3 text-muted" />
                    <span className="text-xs text-muted">{Number(v.current_odometer).toLocaleString()} km</span>
                    <span className="text-[10px] text-muted/50">•</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      v.fuel_type === 'ev' ? 'bg-ok/10 text-ok' :
                      v.fuel_type === 'diesel' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-accent/10 text-accent'
                    }`}>
                      {v.fuel_type?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <HealthRing percent={v.health || 75} size={44} strokeWidth={3} />
                  <ChevronRight className="w-4 h-4 text-muted" />
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}
