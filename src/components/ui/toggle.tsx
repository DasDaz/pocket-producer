
import * as React from 'react'
import { cn } from './utils'
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { pressed?: boolean, onPressedChange?: (v:boolean)=>void }
export const Toggle = ({ className, pressed=false, onPressedChange, ...props }: Props) => {
  return (
    <button
      aria-pressed={pressed}
      onClick={() => onPressedChange?.(!pressed)}
      className={cn('rounded-2xl px-3 py-2 border', pressed ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'hover:bg-gray-100', className)}
      {...props}
    />
  )
}
