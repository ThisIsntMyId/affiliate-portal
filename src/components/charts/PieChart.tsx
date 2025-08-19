"use client"

import React from 'react';

import { LabelList, Pie, PieChart as RechartsPieChart } from "recharts"

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

export interface PieChartProps {
  title?: string;
  description?: string;
  data: Array<{ label: string; [key: string]: string | number }>;
  width?: number | string;
  className?: string;
}

export function PieChart({
  title,
  description,
  data,
  width,
  className = "",
}: PieChartProps) {
  // Get series names (excluding 'label') - for pie chart we'll use the first series
  const seriesNames = data.length > 0 
    ? Object.keys(data[0]).filter(key => key !== 'label')
    : [];

  const seriesName = seriesNames[0] || 'value';

  // Create chart config
  const chartConfig: ChartConfig = {
    [seriesName]: {
      label: "Value",
    },
    ...data.reduce((config, item, index) => {
      config[item.label.toLowerCase()] = {
        label: item.label,
        color: `var(--chart-${(index % 5) + 1})`,
      };
      return config;
    }, {} as ChartConfig),
  };

  // Transform data for pie chart
  const transformedData = data.map((item, index) => ({
    browser: item.label.toLowerCase(),
    visitors: Number(item[seriesName]) || 0,
    fill: `var(--color-${item.label.toLowerCase()})`,
  }));

  const cardStyle = {
    width: width === "100%" ? "100%" : width ? `${width}px` : undefined,
  };

  return (
    <Card className={`flex flex-col ${className}`} style={cardStyle}>
      {(title || description) && (
        <CardHeader className="items-center pb-0">
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[250px]"
        >
          <RechartsPieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="visitors" hideLabel />}
            />
            <Pie data={transformedData} dataKey="visitors">
              <LabelList
                dataKey="browser"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
          </RechartsPieChart>
                 </ChartContainer>
       </CardContent>
     </Card>
   )
 }
