
import * as React from 'react'
import { cn } from './utils'
type Props = React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'outline' }
export const Badge = ({ className, variant='default', ...props }: Props) => {
  const styles = variant === 'outline' ? 'border border-gray-300 text-gray-700' : 'bg-gray-900 text-white'
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs', styles, className)} {...props} />
}
