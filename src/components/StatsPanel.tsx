import React from 'react';
import { BarChart3, Users, Zap, Target, Activity } from 'lucide-react';
import { SimulationStats } from '../types/simulation';

interface StatsPanelProps {
  stats: SimulationStats;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const formatNumber = (num: number, decimals: number = 2): string => {
    return num.toFixed(decimals);
  };

  const statItems = [
    {
      icon: Zap,
      label: ' Speed',
      value: formatNumber(stats.averageSpeed),
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      icon: Users,
      label: 'Density',
      value: formatNumber(stats.averageDensity),
      color: 'text-green-400',
      bgColor: 'bg-green-500/20'
    },
    {
      icon: Target,
      label: 'Clusters',
      value: stats.clusterCount.toString(),
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      icon: Activity,
      label: 'Total Distance',
      value: formatNumber(stats.totalDistance, 0),
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20'
    }
  ];

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <div className="flex items-center gap-3 text-white mb-6">
        <BarChart3 className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-semibold">Simulation Statistics</h2>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {statItems.map((item, index) => (
          <div
            key={index}
            className={`${item.bgColor} rounded-lg p-4 border border-slate-700/50`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-slate-800/50`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-slate-400 text-sm">{item.label}</p>
                <p className={`text-xl font-semibold ${item.color}`}>
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
        <h3 className="text-sm font-medium text-slate-300 mb-2">Performance</h3>
        <div className="flex items-center justify-between">
          <span className="text-slate-400 text-sm">Frame Rate</span>
          <span className="text-green-400 font-semibold">
            {stats.frameRate} FPS
          </span>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500">
        <p>💡 Click on the simulation to add obstacles</p>
        <p>🎯 Use controls to adjust crowd behavior</p>
        <p>🔄 Switch modes to see different patterns</p>
      </div>
    </div>
  );
};