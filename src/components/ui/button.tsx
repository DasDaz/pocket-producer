
import * as React from 'react'
import { cn } from './utils'
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default'|'outline'|'ghost', size?: 'default'|'icon'|'sm' }
export const Button = React.forwardRef<HTMLButtonElement, Props>(function Button({ className, variant='default', size='default', ...props }, ref) {
  const base = 'inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2'
  const variants = { default:'bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90', outline:'border border-gray-300 hover:bg-gray-100', ghost:'hover:bg-gray-100' } as const
  const sizes = { default:'', icon:'h-8 w-8 p-0', sm:'h-8 px-2' } as const
  return <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
})
