import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EnumSelectProps<T extends string> {
  label?: string;
  value: T;
  options: readonly T[];
  onChange: (val: T) => void;
  placeholder?: string;
  description?: string;
  iconMap?: Partial<Record<T, React.ReactNode>>; // 아이콘 매핑
  className?: string; // ✅ 선택창 커스텀 너비용 className 추가
}

export const EnumSelect = <T extends string>({
  label,
  value,
  options,
  onChange,
  placeholder = '선택...',
  description,
  iconMap = {},
  className, // ✅ 전달 받기
}: EnumSelectProps<T>) => {
  return (
    <div className="space-y-1">
      {label && (
        <span className="text-sm font-medium text-gray-700">{label}</span>
      )}

      <Select value={value} onValueChange={(val) => onChange(val as T)}>
        <SelectTrigger className={`w-full h-9 ${className ?? ''}`}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option}>
              <div className="flex items-center gap-2">
                {iconMap[option] && (
                  <span className="w-4 h-4">{iconMap[option]}</span>
                )}
                <span>{option}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
};
