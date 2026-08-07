import * as React from "react";
import { LogOut } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  className?: string;
  iconClassName?: string;
  label?: string;
  showIconOnly?: boolean;
}

/**
 * Reusable LogoutButton component with support for loading status,
 * click debounce, and theme styles.
 */
export const LogoutButton: React.FC<LogoutButtonProps> = ({
  className,
  iconClassName,
  label = "Logout",
  showIconOnly = false,
}) => {
  const { handleLogout, loading } = useLogout();

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer outline-none",
        className
      )}
      aria-label="Secure Logout"
    >
      <LogOut className={cn("h-4 w-4 shrink-0", loading && "animate-pulse", iconClassName)} />
      {!showIconOnly && <span>{loading ? "Signing Out..." : label}</span>}
    </button>
  );
};
