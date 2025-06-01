'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { BarChart, Bar, CartesianGrid, XAxis } from 'recharts';
import { TrendingUp, Building2 } from 'lucide-react';

interface BarChartCardProps {
  title: string;
  description?: string;
  data: { name: string; value: number }[];
  height?: number;
  barColor?: string;
}

export function BarChartCard({
  title,
  description,
  data,
  height = 300,
  barColor = 'var(--color-primary)', // shadcn 색상 변수 사용
}: BarChartCardProps) {
  // shadcn ChartConfig 사용
  const chartConfig: ChartConfig = {
    value: {
      label: '금액',
      color: barColor,
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Building2 className="w-4 h-4" />
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="w-full"
          style={{ height }}
        >
          <BarChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: string) => value.slice(0, 5)}
            />
            <ChartTooltip
              cursor={{ fill: '#eee' }}
              content={
                <ChartTooltipContent
                  labelFormatter={(label) => `📦 ${label}`}
                  formatter={(v) => `₩${Number(v).toLocaleString('ko-KR')}`}
                />
              }
            />
            <Bar
              dataKey="value"
              fill={barColor}
              radius={[8, 8, 0, 0]}
              name="금액"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex items-center gap-2 text-sm text-muted-foreground">
        <TrendingUp className="h-4 w-4" />
        자산별 보관처 분포를 나타냅니다.
      </CardFooter>
    </Card>
  );
}
