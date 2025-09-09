"use client"

import React from 'react';

import { Pie, PieChart as RechartsPieChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export interface PieChartProps {
  title?: string;
  description?: string;
  data: Array<{ 
    name?: string; 
    label?: string; 
    value: number; 
    color?: string; 
    [key: string]: string | number | undefined 
  }>;
  width?: number | string;
  height?: number;
  className?: string;
  showLegend?: boolean;
  showTooltip?: boolean;
  innerRadius?: number;
  outerRadius?: number;
}

export function PieChart({
  title,
  description,
  data,
  width,
  height = 400,
  className = "",
  showTooltip = true,
  innerRadius = 0,
  outerRadius = 80,
}: PieChartProps) {
  // Transform data for pie chart
  const transformedData = data.map((item, index) => {
    const label = item.name || item.label || `Item ${index + 1}`;
    return {
      name: label,
      value: Number(item.value) || 0,
      fill: item.color || `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
    };
  });

  // Create chart config
  const chartConfig: ChartConfig = transformedData.reduce((config, item) => {
    config[item.name.toLowerCase().replace(/\s+/g, '')] = {
      label: item.name,
      color: item.fill,
    };
    return config;
  }, {} as ChartConfig);

  const cardStyle = {
    width: width === "100%" ? "100%" : width ? `${width}px` : undefined,
    height: height ? `${height}px` : undefined,
  };

  return (
    <div className={`flex flex-col ${className}`} style={cardStyle}>
      {(title || description) && (
        <div className="text-center mb-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
      )}
      <ChartContainer
        config={chartConfig}
        className="[&_.recharts-text]:fill-foreground mx-auto"
        style={{ height: `${height}px` }}
      >
        <RechartsPieChart>
          {showTooltip && (
            <ChartTooltip
              content={<ChartTooltipContent nameKey="name" />}
            />
          )}
          <Pie 
            data={transformedData} 
            dataKey="value"
            nameKey="name"
            cx="50%" 
            cy="50%" 
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            paddingAngle={2}
          />
        </RechartsPieChart>
      </ChartContainer>
    </div>
  );
}
