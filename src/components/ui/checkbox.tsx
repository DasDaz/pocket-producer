
import * as React from 'react'
type Props = { checked?: boolean, onCheckedChange?: (v:boolean)=>void }
export const Checkbox = ({ checked=false, onCheckedChange }: Props) => (
  <input type="checkbox" checked={checked} onChange={e=>onCheckedChange?.(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
)
