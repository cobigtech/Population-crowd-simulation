export interface Vector2D {
  x: number;
  y: number;
}

export interface Agent {
  id: string;
  position: Vector2D;
  velocity: Vector2D;
  acceleration: Vector2D;
  maxSpeed: number;
  maxForce: number;
  radius: number;
  color: string;
  age: number;
  energy: number;
  state: 'normal' | 'panic' | 'gathering';
}

export interface Obstacle {
  id: string;
  position: Vector2D;
  radius: number;
  type: 'circle' | 'wall';
}

export interface SimulationConfig {
  populationSize: number;
  separationRadius: number;
  alignmentRadius: number;
  cohesionRadius: number;
  separationWeight: number;
  alignmentWeight: number;
  cohesionWeight: number;
  maxSpeed: number;
  maxForce: number;
  showTrails: boolean;
  showForces: boolean;
  simulationMode: 'normal' | 'panic' | 'gathering';
  language: 'en' | 'ja';
}

export interface SimulationStats {
  averageSpeed: number;
  averageDensity: number;
  clusterCount: number;
  totalDistance: number;
  frameRate: number;
}