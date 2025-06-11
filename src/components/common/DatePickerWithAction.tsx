'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Props {
  label?: string;
  confirmText?: string;
  onConfirm: (date: string) => void;
}

export const DatePickerWithAction = ({
  label = '날짜 선택',
  confirmText = '확인',
  onConfirm,
}: Props) => {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 space-y-3">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
        <Button
          disabled={!date}
          className="w-full"
          onClick={() => {
            if (date) {
              const dateStr = format(date, 'yyyyMMdd');
              onConfirm(dateStr);
              setOpen(false);
            }
          }}
        >
          {confirmText}
        </Button>
      </PopoverContent>
    </Popover>
  );
};
