'use client';

import { useRouter } from 'next/navigation';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

export function CardModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) router.back();
      }}
    >
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className="max-h-[85vh] overflow-y-auto sm:max-w-3xl"
      >
        <DialogTitle className="sr-only">Card details</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
}
