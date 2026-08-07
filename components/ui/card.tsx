import * as React from "react";
import { type LucideIcon, ArrowUpRight, ArrowDownRight, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Base Card Components ---
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverEffect = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-custom-lg border border-border bg-surface text-foreground shadow-soft transition-all duration-200",
          hoverEffect && "hover:shadow-medium hover:-translate-y-1 hover:border-primary/20",
          className
        )}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-heading-s font-bold leading-none tracking-tight", className)} {...props} />
  )
);
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-xs text-muted-foreground", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0 border-t border-border/40 mt-6", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

// --- Feature Card Component ---
export interface FeatureCardProps {
  className?: string;
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ className, title, description, icon: Icon, iconColor = "text-primary", iconBgColor = "bg-primary/10" }, ref) => {
    return (
      <Card ref={ref} className={cn("group overflow-hidden", className)} hoverEffect>
        <CardContent className="p-6 flex flex-col items-start space-y-4 pt-6">
          <div className={cn("p-3 rounded-custom-md transition-colors duration-300", iconBgColor)}>
            <Icon className={cn("h-6 w-6 transition-transform duration-300 group-hover:scale-110", iconColor)} />
          </div>
          <div className="space-y-2">
            <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-200">
              {title}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
);
FeatureCard.displayName = "FeatureCard";

// --- Service Card Component ---
export interface ServiceCardProps {
  className?: string;
  title: string;
  description: string;
  features: string[];
  ctaText?: string;
  onCtaClick?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  className,
  title,
  description,
  features,
  ctaText = "Learn More",
  onCtaClick,
}) => {
  return (
    <Card className={cn("flex flex-col h-full", className)} hoverEffect>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2.5">
          {features.map((f, i) => (
            <li key={i} className="flex items-center text-xs font-semibold text-text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary mr-2.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </CardContent>
      {onCtaClick && (
        <CardFooter className="pt-4 mt-0">
          <button
            onClick={onCtaClick}
            className="text-xs font-bold text-primary hover:text-primary-hover hover:underline flex items-center gap-1 cursor-pointer"
          >
            {ctaText} →
          </button>
        </CardFooter>
      )}
    </Card>
  );
};

// --- Metric Card Component ---
export interface MetricCardProps {
  className?: string;
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  className,
  label,
  value,
  change,
  changeLabel,
  icon: Icon,
}) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card className={cn("overflow-hidden relative", className)}>
      <CardContent className="p-6 pt-6">
        <div className="flex items-center justify-between">
          <span className="text-label text-text-secondary select-none">{label}</span>
          {Icon && (
            <div className="p-2 bg-muted/10 rounded-custom-md text-muted-foreground">
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="mt-3 flex items-baseline space-x-2">
          <span className="text-3xl font-extrabold tracking-tight text-foreground">{value}</span>
        </div>
        {change !== undefined && (
          <div className="mt-4 flex items-center space-x-2 text-xs font-semibold">
            <span
              className={cn(
                "inline-flex items-center px-2 py-0.5 rounded-full",
                isPositive ? "bg-success/10 text-success" : "bg-error/10 text-error"
              )}
            >
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3 mr-0.5" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-0.5" />
              )}
              {isPositive ? "+" : ""}
              {change}%
            </span>
            {changeLabel && <span className="text-muted-foreground">{changeLabel}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// --- Glass Card Component ---
export type GlassCardProps = React.HTMLAttributes<HTMLDivElement>;

export const GlassCard: React.FC<GlassCardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-custom-lg border border-white/20 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md text-foreground shadow-soft p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

// --- Product Card Component ---
export interface ProductCardProps {
  className?: string;
  name: string;
  badge?: string;
  description: string;
  price?: string;
  priceSub?: string;
  onSelect?: () => void;
  ctaText?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  className,
  name,
  badge,
  description,
  price,
  priceSub,
  onSelect,
  ctaText = "Select Product",
}) => {
  return (
    <Card className={cn("flex flex-col h-full overflow-hidden", className)} hoverEffect>
      <CardContent className="p-6 flex-1 space-y-4 pt-6">
        <div className="flex justify-between items-start">
          <h4 className="text-base font-bold text-foreground">{name}</h4>
          {badge && (
            <span className="bg-primary-light dark:bg-primary-light/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
              {badge}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        {price && (
          <div className="pt-2">
            <span className="text-2xl font-extrabold text-foreground">{price}</span>
            {priceSub && <span className="text-xs text-muted-foreground ml-1">{priceSub}</span>}
          </div>
        )}
      </CardContent>
      {onSelect && (
        <CardFooter className="pt-4 mt-0 bg-muted/5 border-t border-border/40">
          <button
            onClick={onSelect}
            className="w-full py-2 bg-primary hover:bg-primary-hover text-white rounded-custom-md text-xs font-bold transition-all cursor-pointer"
          >
            {ctaText}
          </button>
        </CardFooter>
      )}
    </Card>
  );
};

// --- Info Card Component ---
export interface InfoCardProps {
  className?: string;
  title: string;
  description: string;
  variant?: "info" | "warning" | "success" | "error";
}

export const InfoCard: React.FC<InfoCardProps> = ({
  className,
  title,
  description,
  variant = "info",
}) => {
  return (
    <div
      className={cn(
        "flex gap-3.5 p-4 rounded-custom-md border",
        variant === "info" && "bg-info/5 border-info/20 text-info",
        variant === "warning" && "bg-warning/5 border-warning/20 text-warning",
        variant === "success" && "bg-success/5 border-success/20 text-success",
        variant === "error" && "bg-error/5 border-error/20 text-error",
        className
      )}
    >
      <Info className="h-5 w-5 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <h5 className="text-sm font-bold text-foreground">{title}</h5>
        <p className="text-xs text-text-secondary leading-normal">{description}</p>
      </div>
    </div>
  );
};

// --- Dashboard Card Component ---
export interface DashboardCardProps extends CardProps {
  title: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  footerAction?: React.ReactNode;
}

export const DashboardCard = React.forwardRef<HTMLDivElement, DashboardCardProps>(
  ({ className, title, subtitle, headerAction, footerAction, children, ...props }, ref) => {
    return (
      <Card ref={ref} className={cn("flex flex-col h-full", className)} {...props}>
        <div className="flex items-center justify-between p-6 pb-4 border-b border-border/40">
          <div>
            <h4 className="text-base font-bold text-foreground">{title}</h4>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
        <div className="flex-1 p-6">{children}</div>
        {footerAction && (
          <div className="p-4 bg-muted/5 border-t border-border/40 flex items-center justify-end rounded-b-custom-lg">
            {footerAction}
          </div>
        )}
      </Card>
    );
  }
);
DashboardCard.displayName = "DashboardCard";

// Old StatisticCard compatibility wrapper
export interface StatisticCardProps extends CardProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
}

export const StatisticCard = React.forwardRef<HTMLDivElement, StatisticCardProps>(
  ({ className, label, value, change, changeLabel, icon: Icon, ...props }, ref) => {
    return (
      <div ref={ref} {...props} className={className}>
        <MetricCard label={label} value={value} change={change} changeLabel={changeLabel} icon={Icon} />
      </div>
    );
  }
);
StatisticCard.displayName = "StatisticCard";
