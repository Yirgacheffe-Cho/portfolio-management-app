'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

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
  barColor = '#8884d8',
}: BarChartCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(v: number) => `₩${v.toLocaleString()}`} />
            <Legend />
            <Bar
              dataKey="value"
              fill={barColor}
              name="금액"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex items-center gap-2 text-sm text-muted-foreground">
        <TrendingUp className="h-4 w-4" /> 자산별 보관처 분포를 나타냅니다.
      </CardFooter>
    </Card>
  );
}
