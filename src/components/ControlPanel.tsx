import React from 'react';
import { Settings, Play, Pause, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { SimulationConfig } from '../types/simulation';

interface ControlPanelProps {
  config: SimulationConfig;
  onConfigChange: (config: SimulationConfig) => void;
  isRunning: boolean;
  onToggleRunning: () => void;
  onReset: () => void;
  onClearObstacles: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onConfigChange,
  isRunning,
  onToggleRunning,
  onReset,
  onClearObstacles
}) => {
  const handleSliderChange = (key: keyof SimulationConfig, value: number) => {
    onConfigChange({
      ...config,
      [key]: value
    });
  };

  const handleModeChange = (mode: 'normal' | 'panic' | 'gathering') => {
    onConfigChange({
      ...config,
      simulationMode: mode
    });
  };

  const handleToggle = (key: keyof SimulationConfig) => {
    onConfigChange({
      ...config,
      [key]: !config[key]
    });
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-3 text-white">
        <Settings className="w-5 h-5 text-blue-400" />
        <h2 className="text-lg font-semibold">Simulation Controls</h2>
      </div>

      {/* Playback Controls */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={onToggleRunning}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isRunning
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? 'Pause' : 'Play'}
        </button>
        
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        
        <button
          onClick={onClearObstacles}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Simulation Mode */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Simulation Mode
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['normal', 'panic', 'gathering'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                config.simulationMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Population Size */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Population Size: {config.populationSize}
        </label>
        <input
          type="range"
          min="50"
          max="500"
          value={config.populationSize}
          onChange={(e) => handleSliderChange('populationSize', parseInt(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>

      {/* Flocking Parameters */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-slate-300">Flocking Behavior</h3>
        
        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Separation Distance: {config.separationRadius.toFixed(1)}
          </label>
          <input
            type="range"
            min="10"
            max="100"
            step="1"
            value={config.separationRadius}
            onChange={(e) => handleSliderChange('separationRadius', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Alignment Distance: {config.alignmentRadius.toFixed(1)}
          </label>
          <input
            type="range"
            min="20"
            max="150"
            step="1"
            value={config.alignmentRadius}
            onChange={(e) => handleSliderChange('alignmentRadius', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Cohesion Distance: {config.cohesionRadius.toFixed(1)}
          </label>
          <input
            type="range"
            min="30"
            max="200"
            step="1"
            value={config.cohesionRadius}
            onChange={(e) => handleSliderChange('cohesionRadius', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Force Weights */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-slate-300">Force Weights</h3>
        
        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Separation: {config.separationWeight.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={config.separationWeight}
            onChange={(e) => handleSliderChange('separationWeight', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Alignment: {config.alignmentWeight.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={config.alignmentWeight}
            onChange={(e) => handleSliderChange('alignmentWeight', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Cohesion: {config.cohesionWeight.toFixed(1)}
          </label>
          <input
            type="range"
            min="0"
            max="3"
            step="0.1"
            value={config.cohesionWeight}
            onChange={(e) => handleSliderChange('cohesionWeight', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Speed Controls */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-slate-300">Speed & Force</h3>
        
        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Max Speed: {config.maxSpeed.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={config.maxSpeed}
            onChange={(e) => handleSliderChange('maxSpeed', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">
            Max Force: {config.maxForce.toFixed(2)}
          </label>
          <input
            type="range"
            min="0.01"
            max="0.5"
            step="0.01"
            value={config.maxForce}
            onChange={(e) => handleSliderChange('maxForce', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Visual Options */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-300">Visual Options</h3>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Show Trails</span>
          <button
            onClick={() => handleToggle('showTrails')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${
              config.showTrails
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {config.showTrails ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {config.showTrails ? 'On' : 'Off'}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Show Forces</span>
          <button
            onClick={() => handleToggle('showForces')}
            className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors ${
              config.showForces
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {config.showForces ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {config.showForces ? 'On' : 'Off'}
          </button>
        </div>
      </div>
    </div>
  );
};