
import * as React from 'react'
export const DropdownMenu = ({ children }: { children: React.ReactNode }) => <div className="relative inline-block">{children}</div>
export const DropdownMenuTrigger = ({ asChild, children }: { asChild?: boolean, children: React.ReactElement }) => children
export const DropdownMenuContent = ({ children }: { children: React.ReactNode }) => <div className="absolute right-0 mt-2 w-40 rounded-xl border bg-white shadow">{children}</div>
export const DropdownMenuItem = ({ onClick, children }: { onClick?: ()=>void, children: React.ReactNode }) => (
  <button onClick={onClick} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100">{children}</button>
)
