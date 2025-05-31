import * as React from 'react';
import { DayPicker, type DropdownProps } from 'react-day-picker';

import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import 'react-day-picker/dist/style.css';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function CustomSelectDropdown(props: DropdownProps) {
  const { options, value, onChange } = props;

  const handleValueChange = (newValue: string) => {
    if (onChange) {
      const syntheticEvent = {
        target: {
          value: newValue,
        },
      } as React.ChangeEvent<HTMLSelectElement>;

      onChange(syntheticEvent);
    }
  };

  return (
    <Select value={value?.toString()} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options?.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value.toString()}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <div className="min-w-[340px] max-w-fit rounded-md border bg-background p-4 shadow-sm">
      <DayPicker
        captionLayout="dropdown"
        mode="single"
        numberOfMonths={1}
        showOutsideDays={false}
        locale={ko}
        className={cn('p-3', className)}
        classNames={{
          months: 'flex flex-col sm:flex-row gap-2',
          month: 'flex flex-col gap-4',
          caption: 'flex justify-center pt-1 relative items-center w-full',
          caption_label: 'text-sm font-medium',
          table: 'w-full border-collapse space-x-1',
          head_row: 'flex',
          head_cell:
            'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
          row: 'flex w-full mt-2',
          cell: cn(
            'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md',
            props.mode === 'range'
              ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
              : '[&:has([aria-selected])]:rounded-md',
          ),
          day_range_start:
            'day-range-start aria-selected:bg-primary aria-selected:text-primary-foreground',
          day_range_end:
            'day-range-end aria-selected:bg-primary aria-selected:text-primary-foreground',
          day_selected:
            'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
          day_today: 'bg-accent text-accent-foreground',
          day_outside:
            'day-outside text-muted-foreground aria-selected:text-muted-foreground',
          day_disabled: 'text-muted-foreground opacity-50',
          day_range_middle:
            'aria-selected:bg-accent aria-selected:text-accent-foreground',
          day_hidden: 'invisible',
          selected: cn(
            'bg-primary text-white font-semibold',
            'hover:bg-primary/90 focus:bg-primary/90',
            'rounded-md ring-0 outline-none',
          ),
        }}
        components={{
          Dropdown: CustomSelectDropdown,
          PreviousMonthButton: (props) => (
            <button
              {...props}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'size-7 p-0 text-muted-foreground hover:text-foreground',
              )}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          ),
          NextMonthButton: (props) => (
            <button
              {...props}
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'size-7 p-0 text-muted-foreground hover:text-foreground',
              )}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          ),
        }}
        {...props}
      />
    </div>
  );
}
export { Calendar };
