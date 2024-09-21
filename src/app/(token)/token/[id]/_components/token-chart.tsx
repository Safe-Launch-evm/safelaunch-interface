'use client';

import { Area, AreaChart, Tooltip, TooltipProps, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { TokenHistoryItem, TokenPriceHistory } from '@/types';
import { formatDate, formatPrice, getDayOfWeek, toIntNumberFormat } from '@/lib/utils';

import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const value = payload[0].payload;
  return (
    <div className="flex flex-col items-start gap-0.5 rounded-md border bg-card p-2 text-foreground">
      <div className="flex w-full items-center justify-between gap-10 text-xs font-medium uppercase">
        <span>{value.created_at}</span>
        {/* <span>{time}</span> */}
      </div>

      <p className="text-xl font-semibold tracking-[-0.72px]">
        <span>{formatPrice(value.price)}</span>
      </p>
    </div>
  );
};

export function TokenChart({ history }: { history: TokenPriceHistory }) {
  type ResultData = { day: string; price: any; date: string };

  const processData = (data: TokenHistoryItem[]) => {
    let result: ResultData[] = [];

    data.forEach(item => {
      const day = getDayOfWeek(item.created_at);
      const price = parseFloat(item.price_per_native_in_usd);
      const date = formatDate(item.created_at);
      result.push({ day, price, date });
    });

    return result;
  };

  const chartData = processData(history.history);
  // console.log({xx:chartData})

  return (
    <Card className="size-full border-[#D9D9D9] shadow-none">
      <CardHeader className="flex flex-row justify-between pb-4">
        <div className="flex items-center gap-1">
          <CardDescription className="text-[1.125rem]/[0.01125rem] text-foreground">
            Current price
          </CardDescription>
          <CardTitle className="text-[1.375rem] font-bold tabular-nums text-foreground">
            {formatPrice(history.currentPricePerNativeInUsd)}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="mt-4 p-0 pt-6">
        <ChartContainer
          config={{
            price: {
              label: 'Price',
              color: 'hsl(var(--chart-1))'
            }
          }}
          className="aspect-auto h-[300px] w-full"
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
            <XAxis
              dataKey="day"
              tick={{ fill: 'rgba(111, 118, 126, 0.75)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              orientation="right"
              tickFormatter={value => formatPrice(value)}
            />
            <defs>
              <linearGradient id="fillPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-price)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-price)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <Area
              dataKey="price"
              type="monotone"
              fill="url(#fillPrice)"
              fillOpacity={0.4}
              stroke="var(--color-price)"
              // strokeWidth={2}
              // clipPath="none"
              // activeDot={{ r: 6.5, stroke: '#fff', strokeWidth: 3 }}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
              formatter={value => (
                <div>${value}</div>
         
              )}
            /> */}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
