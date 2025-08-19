"use client"

import React from 'react';

import { CartesianGrid, Line, LineChart as RechartsLineChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export interface LineChartProps {
  title?: string;
  description?: string;
  data: Array<{ label: string; [key: string]: string | number }>;
  width?: number | string;
  className?: string;
}

export function LineChart({
  title,
  description,
  data,
  width,
  className = "",
}: LineChartProps) {
  // Get series names (excluding 'label')
  const seriesNames = data.length > 0 
    ? Object.keys(data[0]).filter(key => key !== 'label')
    : [];

  // Create chart config
  const chartConfig: ChartConfig = seriesNames.reduce((config, seriesName, index) => {
    config[seriesName] = {
      label: seriesName.charAt(0).toUpperCase() + seriesName.slice(1),
      color: `var(--chart-${(index % 5) + 1})`,
    };
    return config;
  }, {} as ChartConfig);

  // Transform data to use 'month' instead of 'label' for shadcn compatibility
  const transformedData = data.map(item => ({
    month: item.label,
    ...Object.fromEntries(
      Object.entries(item).filter(([key]) => key !== 'label')
    ),
  }));

  const cardStyle = {
    width: width === "100%" ? "100%" : width ? `${width}px` : undefined,
  };

  return (
    <Card className={className} style={cardStyle}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <ChartContainer config={chartConfig}>
          <RechartsLineChart
            accessibilityLayer
            data={transformedData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            {seriesNames.map((seriesName, index) => (
              <Line
                key={seriesName}
                dataKey={seriesName}
                type="monotone"
                stroke={`var(--color-${seriesName})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </RechartsLineChart>
                 </ChartContainer>
       </CardContent>
     </Card>
   )
 }
