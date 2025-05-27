import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface PieChartCardProps {
  title: string;
  description?: string;
  data: { name: string; value: number }[];
  outerRadius?: number;
  colorOffset?: number;
  height?: number;
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#C93C3C',
  '#6A67CE',
];

export function PieChartCard({
  title,
  description,
  data,
  outerRadius = 100,
  colorOffset = 0,
  height = 300,
}: PieChartCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={outerRadius}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(1)}%`
              }
            >
              <LabelList dataKey="name" />
              {data.map((_, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={COLORS[(idx + colorOffset) % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => `₩${v.toLocaleString()}`} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex items-center gap-2 text-sm text-muted-foreground">
        <TrendingUp className="h-4 w-4" /> 리밸런싱 판단용 분석입니다.
      </CardFooter>
    </Card>
  );
}
