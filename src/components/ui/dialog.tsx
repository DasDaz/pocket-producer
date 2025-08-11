
import * as React from 'react'
const Ctx = React.createContext<{open:boolean,setOpen:(v:boolean)=>void}>({open:false,setOpen:()=>{}})
export const Dialog = ({ open, onOpenChange, children }: { open?: boolean, onOpenChange?: (v:boolean)=>void, children: React.ReactNode }) => {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const controlled = open !== undefined
  const isOpen = controlled ? !!open : internalOpen
  const setOpen = (v:boolean) => { if(!controlled) setInternalOpen(v); onOpenChange?.(v) }
  return <Ctx.Provider value={{open:isOpen,setOpen}}>{children}</Ctx.Provider>
}
export const DialogTrigger = ({ asChild, children }: { asChild?: boolean, children: React.ReactElement }) => {
  const { setOpen } = React.useContext(Ctx)
  return React.cloneElement(children, { onClick: () => setOpen(true) })
}
export const DialogContent = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  const { open, setOpen } = React.useContext(Ctx)
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onMouseDown={(e)=>{ if(e.target===e.currentTarget) setOpen(false) }}>
      <div className={"w-full max-w-lg rounded-2xl bg-white p-4 shadow " + (className||'')}>{children}</div>
    </div>
  )
}
export const DialogHeader = ({ children }: { children: React.ReactNode }) => <div className="mb-2">{children}</div>
export const DialogTitle = ({ children }: { children: React.ReactNode }) => <h3 className="text-lg font-semibold">{children}</h3>
