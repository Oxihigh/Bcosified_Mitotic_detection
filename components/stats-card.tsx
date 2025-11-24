"use client"

import type React from "react"

interface StatsCardProps {
  label: string
  value: string | number
  icon?: React.ReactNode
  trend?: "up" | "down"
}

export default function StatsCard({ label, value, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-card rounded-lg p-4 border border-border hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
        </div>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      {trend && (
        <p className={`text-xs mt-2 ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
          {trend === "up" ? "↑" : "↓"} Trend
        </p>
      )}
    </div>
  )
}
