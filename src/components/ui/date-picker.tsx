
import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  disablePastDates?: boolean;
  disableFutureDates?: boolean;
  minDate?: Date;
  maxDate?: Date;
}

// Helper function to create a date from YYYY-MM-DD string in local timezone
const createLocalDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

// Helper function to format date for display without timezone issues
const formatDisplayDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export function DatePicker({
  date,
  onSelect,
  placeholder = "Selecionar data",
  disabled = false,
  className,
  disablePastDates = false,
  disableFutureDates = false,
  minDate,
  maxDate,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const isDateDisabled = (checkDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Create a copy to avoid mutating the original date
    const dateToCheck = new Date(checkDate.getFullYear(), checkDate.getMonth(), checkDate.getDate());

    if (disablePastDates && dateToCheck < today) return true;
    if (disableFutureDates && dateToCheck > today) return true;
    if (minDate) {
      const minDateLocal = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
      if (dateToCheck < minDateLocal) return true;
    }
    if (maxDate) {
      const maxDateLocal = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
      if (dateToCheck > maxDateLocal) return true;
    }
    
    return false;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? formatDisplayDate(date) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate) => {
            onSelect(selectedDate);
            setOpen(false);
          }}
          disabled={isDateDisabled}
          initialFocus
          className="p-3 pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
