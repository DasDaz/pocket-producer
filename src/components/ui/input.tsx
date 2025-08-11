
import * as React from 'react'
import { cn } from './utils'
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cn('w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus-visible:ring-2', className)} {...props} />
})
