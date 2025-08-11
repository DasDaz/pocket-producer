
import * as React from 'react'

type CtxT = {
  open: boolean;
  setOpen: (v: boolean) => void;
  closeOnItemClick: () => void;
  triggerRef: React.RefObject<HTMLDivElement>;
};
const Ctx = React.createContext<CtxT | null>(null);

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      const root = triggerRef.current?.parentElement;
      if (root && !root.contains(t)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const closeOnItemClick = () => setOpen(false);

  return (
    <div className="relative inline-block">
      <Ctx.Provider value={{ open, setOpen, closeOnItemClick, triggerRef }}>
        {children}
      </Ctx.Provider>
    </div>
  );
};

export const DropdownMenuTrigger = ({
  asChild,
  children,
}: {
  asChild?: boolean;
  children: React.ReactElement;
}) => {
  const ctx = React.useContext(Ctx)!;
  return (
    <div ref={ctx.triggerRef} className="inline-block">
      {React.cloneElement(children, {
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          ctx.setOpen(!ctx.open);
          children.props.onClick?.(e);
        },
        "aria-expanded": ctx.open,
        "aria-haspopup": "menu",
      })}
    </div>
  );
};

export const DropdownMenuContent = ({
  children,
  align = "end",
}: {
  children: React.ReactNode;
  align?: "start" | "end";
}) => {
  const ctx = React.useContext(Ctx)!;
  if (!ctx.open) return null;
  return (
    <div
      role="menu"
      className={[
        "absolute mt-2 min-w-[10rem] rounded-2xl border bg-white shadow-lg",
        "p-1 ring-1 ring-[var(--ring)]/40",
        align === "end" ? "right-0" : "left-0",
      ].join(" ")}
    >
      {children}
    </div>
  );
};

export const DropdownMenuItem = ({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  const ctx = React.useContext(Ctx)!;
  return (
    <button
      type="button"
      role="menuitem"
      onClick={() => {
        onClick?.();
        ctx.closeOnItemClick();
      }}
      className={[
        "w-full text-left px-3 py-2 text-sm",
        "rounded-2xl transition-colors",
        "hover:bg-[var(--primary)]/20",
      ].join(" ")}
    >
      {children}
    </button>
  );
};
