'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { TokenHistoryItem, TokenPriceHistory } from '@/types';
import { formatDate, formatPrice, getDayOfWeek } from '@/lib/utils';

export const description = 'An area chart with icons';

// const chartData = [
//   { day: 'January', desktop: 186, mobile: 80 },
//   { day: 'February', desktop: 305, mobile: 200 },
//   { day: 'March', desktop: 237, mobile: 120 },
//   { day: 'April', desktop: 73, mobile: 190 },
//   { day: 'May', desktop: 209, mobile: 130 },
//   { day: 'June', desktop: 214, mobile: 140 }
// ];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
    icon: TrendingDown
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(var(--chart-2))',
    icon: TrendingUp
  }
} satisfies ChartConfig;

export function TokenChart({ history }: { history: TokenPriceHistory }) {
  type ResultData = { day: string; price: any; date: string };
  const processData = (data: TokenHistoryItem[]) => {
    let result: ResultData[] = [];

    data.forEach(item => {
      const day = getDayOfWeek(item.created_at);
      const price = parseFloat(item.price_per_native);
      const date = formatDate(item.created_at);
      result.push({ day, price, date });
    });

    return result;
  };

  const chartData = processData(history.history);

  return (
    <Card className="border-0 bg-card-foreground">
      {/* <CardHeader className="space-y-0 pb-0">
        <CardDescription>Time in Bed</CardDescription>
        <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
          8
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            hr
          </span>
          35
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            min
          </span>
        </CardTitle>
      </CardHeader> */}
      <CardContent className="p-4">
        <ChartContainer
          config={{
            time: {
              label: 'Price',
              color: 'hsl(var(--chart-2))'
            }
          }}
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0
            }}
            stackOffset="expand"
          >
            {/* <CartesianGrid vertical={false} /> */}
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickFormatter={value => `${parseFloat(value)}`}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            {/* <YAxis
              domain={[`dataMin - ${chartData[0]}`, `dataMax + ${chartData.length - 1}`]}
            /> */}
            <defs>
              <linearGradient id="fillTime" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-time)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-time)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="price"
              type="natural"
              fill="url(#fillTime)"
              fillOpacity={0.4}
              stroke="var(--color-price)"
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              formatter={value => (
                <div>${value}</div>
                // <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
                //   Time in bed
                //   <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                //     {value}
                //     <span className="font-normal text-muted-foreground">hr</span>
                //   </div>
                // </div>
              )}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
