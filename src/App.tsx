import { useState, useCallback } from "react";
import { SimulationCanvas } from "./components/SimulationCanvas";
import { ControlPanel } from "./components/ControlPanel";
import { StatsPanel } from "./components/StatsPanel";
import { SimulationConfig, SimulationStats } from "./types/simulation";
import { Users } from "lucide-react";
import { getTranslation } from "./utils/translations";

const defaultConfig: SimulationConfig = {
  populationSize: 200,
  separationRadius: 25,
  alignmentRadius: 50,
  cohesionRadius: 50,
  separationWeight: 1.5,
  alignmentWeight: 1.0,
  cohesionWeight: 1.0,
  maxSpeed: 2.0,
  maxForce: 0.03,
  showTrails: true,
  showForces: false,
  simulationMode: "normal",
  language: "en",
};

const defaultStats: SimulationStats = {
  averageSpeed: 0,
  averageDensity: 0,
  clusterCount: 0,
  totalDistance: 0,
  frameRate: 60,
};

function App() {
  const [config, setConfig] = useState<SimulationConfig>(defaultConfig);
  const [stats, setStats] = useState<SimulationStats>(defaultStats);
  const [isRunning, setIsRunning] = useState(true);

  const handleConfigChange = useCallback((newConfig: SimulationConfig) => {
    setConfig(newConfig);
  }, []);

  const handleStatsUpdate = useCallback((newStats: SimulationStats) => {
    setStats(newStats);
  }, []);

  const handleToggleRunning = useCallback(() => {
    setIsRunning(!isRunning);
  }, [isRunning]);

  const handleReset = useCallback(() => {
    setConfig({ ...defaultConfig });
    setStats(defaultStats);
  }, []);

  const handleClearObstacles = useCallback(() => {
    // This will be handled by the simulation engine
    window.dispatchEvent(new CustomEvent("clearObstacles"));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {getTranslation(config.language, "title")}
                </h1>
                <p className="text-slate-400 text-sm">
                  {getTranslation(config.language, "subtitle")}
                </p>
              </div>
            </div>

            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setConfig({
                    ...config,
                    language: config.language === "en" ? "ja" : "en",
                  })
                }
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  config.language === "en"
                    ? "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    : "bg-blue-600 text-white"
                }`}
              >
                {config.language === "en"
                  ? getTranslation("en", "english")
                  : getTranslation("ja", "japanese")}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-140px)]">
          {/* Simulation Canvas */}
          <div className="lg:col-span-3">
            <div className="h-full bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-4">
              <SimulationCanvas
                config={config}
                onStatsUpdate={handleStatsUpdate}
              />
            </div>
          </div>

          {/* Side Panel */}
          <div className="space-y-6 overflow-y-auto">
            {/* Stats Panel */}
            <StatsPanel stats={stats} language={config.language} />

            {/* Control Panel */}
            <ControlPanel
              config={config}
              onConfigChange={handleConfigChange}
              isRunning={isRunning}
              onToggleRunning={handleToggleRunning}
              onReset={handleReset}
              onClearObstacles={handleClearObstacles}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 backdrop-blur-sm mt-6">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">
              {getTranslation(config.language, "footerDescription")}
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span>
                {getTranslation(config.language, "population")}:{" "}
                {config.populationSize}
              </span>
              <span>
                {getTranslation(config.language, "mode")}:{" "}
                {getTranslation(config.language, config.simulationMode)}
              </span>
              <span>
                {getTranslation(config.language, "fps")}: {stats.frameRate}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
