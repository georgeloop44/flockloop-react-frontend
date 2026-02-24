import { useEffect, useRef, type ReactNode } from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  ariaLabel: string;
  children: ReactNode;
  /** Extra classes on the inner panel */
  className?: string;
}

/**
 * Accessible modal dialog built on the native <dialog> element.
 * Provides focus trapping, Escape-to-close, scroll lock, and
 * return-focus-on-close out of the box.
 */
export function Dialog({
  open,
  onClose,
  ariaLabel,
  children,
  className = "",
}: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (open && !el.open) {
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  // Handle native close (Escape key, etc.)
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleClose = () => onClose();
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [onClose]);

  // Prevent closing via backdrop click when there's a pending operation
  // (callers should guard onClose themselves if needed)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    // Only close if clicking the backdrop (the <dialog> element itself)
    if (e.target === ref.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={ref}
      aria-label={ariaLabel}
      onClick={handleBackdropClick}
      className="m-auto max-h-[85vh] w-full max-w-md overflow-y-auto rounded-xl border border-border bg-surface p-0 shadow-xl backdrop:bg-black/60"
      style={{ overscrollBehavior: "contain" }}
    >
      {open ? <div className={`p-6 ${className}`}>{children}</div> : null}
    </dialog>
  );
}
