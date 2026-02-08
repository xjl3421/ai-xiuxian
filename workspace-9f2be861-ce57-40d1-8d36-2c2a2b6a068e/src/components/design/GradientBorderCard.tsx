import { ReactNode } from 'react'

interface GradientBorderCardProps {
  children: ReactNode
  className?: string
}

export function GradientBorderCard({ children, className = '' }: GradientBorderCardProps) {
  return (
    <div className={`rounded-xl bg-gradient-to-br from-primary via-[#4D7CFF] to-primary p-[2px] ${className}`}>
      <div className="h-full w-full rounded-[calc(12px-2px)] bg-card">
        {children}
      </div>
    </div>
  )
}
