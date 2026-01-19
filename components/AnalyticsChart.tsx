
import React from 'react';
import { LineChart, BarChart, Area, AreaChart, Bar, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsChartProps {
  data: { date: string; [key: string]: any }[];
  dataKey: string;
  strokeColor: string;
  chartType?: 'line' | 'bar' | 'area';
}

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ data, dataKey, strokeColor, chartType = 'area' }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: 0,
          bottom: 0,
        }}
      >
        <defs>
            <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
            </linearGradient>
        </defs>
        <Tooltip
            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
            contentStyle={{ 
                backgroundColor: 'rgba(5, 15, 30, 0.8)', 
                borderColor: '#374151',
                color: '#F9FAFB'
            }} 
        />
        <Area type="monotone" dataKey={dataKey} stroke={strokeColor} fill={`url(#color-${dataKey})`} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AnalyticsChart;
