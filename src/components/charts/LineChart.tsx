"use client"

import React from 'react';

import { CartesianGrid, Line, LineChart as RechartsLineChart, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export interface LineChartProps {
  title?: string;
  description?: string;
  data: Array<{ [key: string]: string | number }>;
  xKey?: string;
  yKeys?: string[];
  colors?: string[];
  height?: number;
  width?: number | string;
  className?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  showGrid?: boolean;
  strokeWidth?: number;
}

export function LineChart({
  title,
  description,
  data,
  xKey = "label",
  yKeys = [],
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8884d8'],
  height = 300,
  width,
  className = "",
  showTooltip = true,
  showGrid = true,
  strokeWidth = 2,
}: LineChartProps) {
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
        <RechartsLineChart
          accessibilityLayer
          data={transformedData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          {showGrid && <CartesianGrid vertical={false} />}
          <XAxis
            dataKey={xKey}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => typeof value === 'string' ? value.slice(0, 3) : value}
          />
          {showTooltip && (
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          )}
          {seriesNames.map((seriesName, index) => (
            <Line
              key={seriesName}
              dataKey={seriesName}
              type="monotone"
              stroke={colors[index % colors.length]}
              strokeWidth={strokeWidth}
              dot={false}
            />
          ))}
        </RechartsLineChart>
      </ChartContainer>
    </div>
  )
 }
