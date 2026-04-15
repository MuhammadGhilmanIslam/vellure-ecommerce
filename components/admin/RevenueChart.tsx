'use client';

import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const MOCK_DATA = [
  { day: 'Apr 1', revenue: 850000 },
  { day: 'Apr 5', revenue: 1250000 },
  { day: 'Apr 10', revenue: 980000 },
  { day: 'Apr 12', revenue: 1800000 },
  { day: 'Apr 15', revenue: 1450000 },
  { day: 'Apr 18', revenue: 2100000 },
  { day: 'Apr 20', revenue: 1750000 },
  { day: 'Apr 22', revenue: 2400000 },
  { day: 'Apr 25', revenue: 1900000 },
  { day: 'Apr 28', revenue: 2800000 },
  { day: 'Apr 30', revenue: 3100000 },
];

function formatTooltip(value: any) {
  if (typeof value === 'number') {
    return [`Rp ${(value / 1000).toFixed(0)}k`, 'Revenue'];
  }
  return [String(value), 'Revenue'];
}

export function AdminRevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={MOCK_DATA} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#C8A96E" stopOpacity={0.2} />
            <stop offset="95%" stopColor="#C8A96E" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8E4DE" vertical={false} />
        <XAxis
          dataKey="day"
          tick={{ fontSize: 11, fill: '#8A8680', fontFamily: 'IBM Plex Mono' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`}
          tick={{ fontSize: 11, fill: '#8A8680', fontFamily: 'IBM Plex Mono' }}
          axisLine={false}
          tickLine={false}
          width={48}
        />
        <Tooltip
          formatter={formatTooltip}
          contentStyle={{
            background: '#1A1814',
            border: 'none',
            color: '#F5F0E8',
            fontFamily: 'IBM Plex Mono',
            fontSize: '11px',
            borderRadius: '2px',
          }}
          labelStyle={{ color: '#A8A39A' }}
          cursor={{ stroke: '#C8A96E', strokeWidth: 1, strokeDasharray: '4 2' }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#C8A96E"
          strokeWidth={2}
          fill="url(#revenueGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#C8A96E', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
