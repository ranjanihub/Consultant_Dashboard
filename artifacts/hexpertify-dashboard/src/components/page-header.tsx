import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  badge?: string;
  icon?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, description, badge, icon, children }: PageHeaderProps) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-[#4f28d9] via-[#5e2be2] to-[#3b1799] p-5 md:p-6 text-white shadow-lg overflow-hidden relative mb-6">
      <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-black/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="space-y-1 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {title}
          </h1>
          <p className="text-white/80 text-xs sm:text-sm max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>

        {children && (
          <div className="flex items-center gap-3 shrink-0 pt-2 md:pt-0">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
