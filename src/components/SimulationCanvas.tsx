import React, { useRef, useEffect, useCallback } from 'react';
import { SimulationEngine } from '../utils/simulation';
import { SimulationConfig, SimulationStats } from '../types/simulation';
import { Vector } from '../utils/vector';

interface SimulationCanvasProps {
  config: SimulationConfig;
  onStatsUpdate: (stats: SimulationStats) => void;
}

export const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ config, onStatsUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<SimulationEngine | null>(null);
  const animationRef = useRef<number>();

  const initializeEngine = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    engineRef.current = new SimulationEngine(canvas.width, canvas.height, config);
  }, [config]);

  const draw = useCallback((timestamp: number) => {
    if (!canvasRef.current || !engineRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with subtle background
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle grid
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 0.5;
    const gridSize = 50;
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw trails
    if (config.showTrails) {
      const trails = engineRef.current.getTrails();
      trails.forEach(trail => {
        if (trail.length > 1) {
          ctx.strokeStyle = '#0EA5E9';
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          trail.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.stroke();
          ctx.globalAlpha = 1;
        }
      });
    }

    // Draw obstacles
    const obstacles = engineRef.current.getObstacles();
    obstacles.forEach(obstacle => {
      ctx.fillStyle = '#EF4444';
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(obstacle.position.x, obstacle.position.y, obstacle.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      
      // Draw obstacle glow
      const gradient = ctx.createRadialGradient(
        obstacle.position.x, obstacle.position.y, 0,
        obstacle.position.x, obstacle.position.y, obstacle.radius + 20
      );
      gradient.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
      gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(obstacle.position.x, obstacle.position.y, obstacle.radius + 20, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw agents
    const agents = engineRef.current.getAgents();
    agents.forEach(agent => {
      // Draw agent glow
      const gradient = ctx.createRadialGradient(
        agent.position.x, agent.position.y, 0,
        agent.position.x, agent.position.y, agent.radius + 8
      );
      gradient.addColorStop(0, agent.color);
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.arc(agent.position.x, agent.position.y, agent.radius + 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      // Draw agent body
      ctx.fillStyle = agent.color;
      ctx.beginPath();
      ctx.arc(agent.position.x, agent.position.y, agent.radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw direction indicator
      if (Vector.magnitude(agent.velocity) > 0.1) {
        const angle = Vector.angle(agent.velocity);
        const length = 8;
        const endX = agent.position.x + Math.cos(angle) * length;
        const endY = agent.position.y + Math.sin(angle) * length;
        
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(agent.position.x, agent.position.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      // Draw force vectors if enabled
      if (config.showForces) {
        const forceScale = 50;
        const forceEndX = agent.position.x + agent.acceleration.x * forceScale;
        const forceEndY = agent.position.y + agent.acceleration.y * forceScale;
        
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(agent.position.x, agent.position.y);
        ctx.lineTo(forceEndX, forceEndY);
        ctx.stroke();
      }
    });

    // Update simulation
    engineRef.current.update();

    // Update stats
    if (Math.floor(timestamp / 100) % 10 === 0) {
      onStatsUpdate(engineRef.current.getStats());
    }

    animationRef.current = requestAnimationFrame(draw);
  }, [config, onStatsUpdate]);

  const handleCanvasClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !engineRef.current) return;
    
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    engineRef.current.addObstacle({ x, y }, 20);
  }, []);

  useEffect(() => {
    initializeEngine();
    
    const handleResize = () => {
      initializeEngine();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initializeEngine]);

  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateConfig(config);
    }
  }, [config]);

  useEffect(() => {
    if (canvasRef.current) {
      animationRef.current = requestAnimationFrame(draw);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-crosshair border border-slate-700 rounded-lg bg-slate-900"
      onClick={handleCanvasClick}
      style={{ width: '100%', height: '100%' }}
    />
  );
};