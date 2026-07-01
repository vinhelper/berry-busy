import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2 font-semibold', className)}>
      <span className="flex size-8 items-center justify-center rounded-full border border-primary bg-white text-primary">
        <svg
          viewBox="0 0 24 24"
          aria-hidden
          className="size-5"
          fill="currentColor"
        >
          {/* leaves */}
          <path
            d="M12 7c-1.7-.4-2.9-1.7-3.1-3.6 1.9-.2 3.3.9 3.7 2.6"
            className="opacity-55"
          />
          <path
            d="M12 7c1.7-.4 2.9-1.7 3.1-3.6-1.9-.2-3.3.9-3.7 2.6"
            className="opacity-45"
          />
          {/* berry cluster */}
          <circle cx="9" cy="9.6" r="2.6" className="opacity-80" />
          <circle cx="15" cy="9.6" r="2.6" className="opacity-90" />
          <circle cx="6.4" cy="13.7" r="2.6" className="opacity-85" />
          <circle cx="12" cy="13.7" r="2.6" />
          <circle cx="17.6" cy="13.7" r="2.6" className="opacity-80" />
          <circle cx="9.2" cy="17.7" r="2.6" className="opacity-95" />
          <circle cx="14.8" cy="17.7" r="2.6" className="opacity-85" />
          <circle cx="12" cy="21.2" r="2.4" className="opacity-75" />
        </svg>
      </span>
      <span className="tracking-tight">BerryBusy</span>
    </span>
  );
}
