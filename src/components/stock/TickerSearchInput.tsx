// components/stock/TickerSearchInput.tsx
import { useEffect, useState } from 'react';
import { useUnifiedTickerSearch } from '@/hooks/stock/useUnifiedTickerSearch';
import { useDebouncedAction } from '@/hooks/common/useDebouncedAction';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { type TickerItem } from '@/types/stock';

type Props = {
  onSelect: (item: TickerItem) => void;
  placeholder?: string;
  autoFocus?: boolean;
};

export function TickerSearchInput({ onSelect, placeholder, autoFocus }: Props) {
  const [input, setInput] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [showDropdown, setShowDropdown] = useState(false);

  const { results, search, loading } = useUnifiedTickerSearch();

  const { trigger: triggerSearch } = useDebouncedAction((q: string) => {
    search(q);
    setShowDropdown(true);
  }, 300);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    triggerSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightIndex((prev) => (prev <= 0 ? results.length - 1 : prev - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = results[highlightIndex];
      if (selected) {
        setInput(selected.name); // ✅ 이름만 입력창에 표시
        setShowDropdown(false);
        onSelect(selected);
      }
    }
  };

  const handleSelect = (item: TickerItem) => {
    setInput(item.name); // ✅ 이름만 입력창에 표시
    setShowDropdown(false);
    onSelect(item);
  };

  return (
    <div className="relative w-full max-w-md">
      <Input
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || '티커 또는 종목명 검색'}
        autoFocus={autoFocus}
        onFocus={() => input && setShowDropdown(true)}
      />

      {loading && (
        <p className="text-sm text-muted-foreground mt-1">🔄 검색 중...</p>
      )}

      {showDropdown && results.length > 0 && (
        <Card className="absolute z-10 w-full mt-2 border p-2 rounded-xl shadow-xl">
          <ul className="divide-y divide-muted max-h-64 overflow-y-auto">
            {results.map((item, index) => (
              <li
                key={item.symbol}
                className={`px-2 py-2 text-sm rounded-md cursor-pointer flex justify-between ${
                  index === highlightIndex
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-muted'
                }`}
                onMouseDown={() => handleSelect(item)}
              >
                <span>
                  {item.country === 'KR' ? '🇰🇷' : '🇺🇸'} {item.name}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {item.symbol}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
