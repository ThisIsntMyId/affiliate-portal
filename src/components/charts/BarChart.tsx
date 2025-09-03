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
  data: Array<{ [key: string]: string | number }>;
  xKey?: string;
  yKeys?: string[];
  colors?: string[];
  height?: number;
  stacked?: boolean;
  width?: number | string;
  className?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
}

export function BarChart({
  title,
  description,
  data,
  xKey = "label",
  yKeys = [],
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8884d8'],
  height = 300,
  stacked = false,
  width,
  className = "",
  showLegend = false,
  showTooltip = true,
  showGrid = true,
}: BarChartProps) {
  // Get series names from yKeys or auto-detect from data
  const seriesNames = yKeys.length > 0 
    ? yKeys 
    : data.length > 0 
      ? Object.keys(data[0]).filter(key => key !== xKey)
      : [];

  // Create chart config
  const chartConfig: ChartConfig = seriesNames.reduce((config, seriesName, index) => {
    config[seriesName] = {
      label: seriesName.charAt(0).toUpperCase() + seriesName.slice(1),
      color: colors[index % colors.length],
    };
    return config;
  }, {} as ChartConfig);

  // Use data as-is since we're now flexible with xKey
  const transformedData = data;

  const cardStyle = {
    width: width === "100%" ? "100%" : width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
  };

  return (
    <div className={className} style={cardStyle}>
      {(title || description) && (
        <div className="text-center mb-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      <ChartContainer config={chartConfig} style={{ height: `${height}px` }}>
        <RechartsBarChart accessibilityLayer data={transformedData}>
          {showGrid && <CartesianGrid vertical={false} />}
          <XAxis
            dataKey={xKey}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => typeof value === 'string' ? value.slice(0, 3) : value}
          />
          {showTooltip && (
            <ChartTooltip 
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" hideLabel={stacked} />} 
            />
          )}
          {showLegend && seriesNames.length > 1 && (
            <ChartLegend content={<ChartLegendContent />} />
          )}
          {seriesNames.map((seriesName, index) => (
            <Bar
              key={seriesName}
              dataKey={seriesName}
              fill={colors[index % colors.length]}
              stackId={stacked ? "a" : undefined}
              radius={stacked ? 
                (index === 0 ? [0, 0, 4, 4] : index === seriesNames.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]) 
                : 4
              }
            />
          ))}
        </RechartsBarChart>
      </ChartContainer>
    </div>
  )
 }
