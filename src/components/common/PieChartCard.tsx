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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { TrendingUp, PieChartIcon } from 'lucide-react';
const CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

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
        <CardTitle className="flex items-center gap-2 text-base">
          <PieChartIcon className="w-4 h-4" />
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{
            name: { label: '보관처' },
            value: { label: '금액' }, // ❌ format 제거
          }}
          className="[&_.recharts-pie-label-text]:fill-foreground mx-auto aspect-square max-h-[300px] pb-0"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={outerRadius}
              label={({ name, percent }) => `${(percent * 100).toFixed(1)}%`}
            >
              <LabelList dataKey="name" fontSize={10} />
              {data.map((_, idx) => (
                <Cell
                  key={idx}
                  fill={CHART_COLORS[(idx + colorOffset) % CHART_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex items-center gap-2 text-sm text-muted-foreground">
        <TrendingUp className="h-4 w-4" /> 리밸런싱 판단용 분석입니다.
      </CardFooter>
    </Card>
  );
}
