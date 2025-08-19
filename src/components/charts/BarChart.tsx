"use client"

import React from 'react';

import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export interface BarChartProps {
  title?: string;
  description?: string;
  data: Array<{ label: string; [key: string]: string | number }>;
  stacked?: boolean;
  width?: number | string;
  className?: string;
}

export function BarChart({
  title,
  description,
  data,
  stacked = false,
  width,
  className = "",
}: BarChartProps) {
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
          <RechartsBarChart accessibilityLayer data={transformedData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip 
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" hideLabel={stacked} />} 
            />
            {seriesNames.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
            {seriesNames.map((seriesName, index) => (
              <Bar
                key={seriesName}
                dataKey={seriesName}
                fill={`var(--color-${seriesName})`}
                stackId={stacked ? "a" : undefined}
                radius={stacked ? 
                  (index === 0 ? [0, 0, 4, 4] : index === seriesNames.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]) 
                  : 4
                }
              />
            ))}
          </RechartsBarChart>
                 </ChartContainer>
       </CardContent>
     </Card>
   )
 }
