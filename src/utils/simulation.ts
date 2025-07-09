import { Agent, Obstacle, SimulationConfig, Vector2D } from '../types/simulation';
import { Vector } from './vector';

export class SimulationEngine {
  private agents: Agent[] = [];
  private obstacles: Obstacle[] = [];
  private config: SimulationConfig;
  private width: number;
  private height: number;
  private trails: Map<string, Vector2D[]> = new Map();

  constructor(width: number, height: number, config: SimulationConfig) {
    this.width = width;
    this.height = height;
    this.config = config;
    this.initializeAgents();
  }

  private initializeAgents(): void {
    this.agents = [];
    for (let i = 0; i < this.config.populationSize; i++) {

        velocity: Vector.random(Math.random() * 2),
        acceleration: { x: 0, y: 0 },
        maxSpeed: this.config.maxSpeed,
        maxForce: this.config.maxForce,
        radius: 3 + Math.random() * 2,
        color: this.getAgentColor(),
        age: Math.random() * 100,
        energy: 50 + Math.random() * 50,
        state: 'normal'
      };
      this.agents.push(agent);
    }
  }

  private getAgentColor(): string {
    const colors = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  public updateConfig(newConfig: SimulationConfig): void {
    this.config = newConfig;
    if (this.agents.length !== newConfig.populationSize) {
      this.initializeAgents();
    }
  }

  public addObstacle(position: Vector2D, radius: number): void {
    this.obstacles.push({
      id: `obstacle-${Date.now()}`,
      position,
      radius,
      type: 'circle'
    });
  }

  public clearObstacles(): void {
    this.obstacles = [];
  }

  public update(): void {
    this.agents.forEach(agent => {
      const forces = this.calculateForces(agent);
      
      // Update physics
      agent.acceleration = forces;
      agent.velocity = Vector.add(agent.velocity, agent.acceleration);
      agent.velocity = Vector.limit(agent.velocity, agent.maxSpeed);
      agent.position = Vector.add(agent.position, agent.velocity);
      
      // Handle boundaries
      this.handleBoundaries(agent);
      
      // Update trails
      this.updateTrails(agent);
      
      // Update agent properties
      agent.age += 0.1;
      agent.energy = Math.max(0, agent.energy - 0.01);
    });
  }

  private calculateForces(agent: Agent): Vector2D {
    const separation = this.separate(agent);
    const alignment = this.align(agent);
    const cohesion = this.cohesion(agent);
    const avoidance = this.avoidObstacles(agent);
    const boundaries = this.avoidBoundaries(agent);

    let totalForce = { x: 0, y: 0 };
    
    totalForce = Vector.add(totalForce, Vector.multiply(separation, this.config.separationWeight));
    totalForce = Vector.add(totalForce, Vector.multiply(alignment, this.config.alignmentWeight));
    totalForce = Vector.add(totalForce, Vector.multiply(cohesion, this.config.cohesionWeight));
    totalForce = Vector.add(totalForce, Vector.multiply(avoidance, 2.0));
    totalForce = Vector.add(totalForce, Vector.multiply(boundaries, 1.5));

    // Apply mode-specific behaviors
    if (this.config.simulationMode === 'panic') {
      const panic = this.panic(agent);
      totalForce = Vector.add(totalForce, Vector.multiply(panic, 1.5));
    } else if (this.config.simulationMode === 'gathering') {
      const gather = this.gather(agent);
      totalForce = Vector.add(totalForce, Vector.multiply(gather, 1.0));
    }

    return Vector.limit(totalForce, this.config.maxForce);
  }

  private separate(agent: Agent): Vector2D {
    const desiredSeparation = this.config.separationRadius;
    let steer = { x: 0, y: 0 };
    let count = 0;

    this.agents.forEach(other => {
      if (other.id !== agent.id) {
        const distance = Vector.distance(agent.position, other.position);
        if (distance > 0 && distance < desiredSeparation) {
          const diff = Vector.subtract(agent.position, other.position);
          const normalized = Vector.normalize(diff);
          const weighted = Vector.divide(normalized, distance);
          steer = Vector.add(steer, weighted);
          count++;
        }
      }
    });

    if (count > 0) {
      steer = Vector.divide(steer, count);
      steer = Vector.normalize(steer);
      steer = Vector.multiply(steer, agent.maxSpeed);
      steer = Vector.subtract(steer, agent.velocity);
    }

    return steer;
  }

  private align(agent: Agent): Vector2D {
    const neighborDistance = this.config.alignmentRadius;
    let sum = { x: 0, y: 0 };
    let count = 0;

    this.agents.forEach(other => {
      if (other.id !== agent.id) {
        const distance = Vector.distance(agent.position, other.position);
        if (distance > 0 && distance < neighborDistance) {
          sum = Vector.add(sum, other.velocity);
          count++;
        }
      }
    });

    if (count > 0) {
      sum = Vector.divide(sum, count);
      sum = Vector.normalize(sum);
      sum = Vector.multiply(sum, agent.maxSpeed);
      const steer = Vector.subtract(sum, agent.velocity);
      return Vector.limit(steer, agent.maxForce);
    }

    return { x: 0, y: 0 };
  }

  private cohesion(agent: Agent): Vector2D {
    const neighborDistance = this.config.cohesionRadius;
    let sum = { x: 0, y: 0 };
    let count = 0;

    this.agents.forEach(other => {
      if (other.id !== agent.id) {
        const distance = Vector.distance(agent.position, other.position);
        if (distance > 0 && distance < neighborDistance) {
          sum = Vector.add(sum, other.position);
          count++;
        }
      }
    });

    if (count > 0) {
      sum = Vector.divide(sum, count);
      return this.seek(agent, sum);
    }

    return { x: 0, y: 0 };
  }

  private seek(agent: Agent, target: Vector2D): Vector2D {
    const desired = Vector.subtract(target, agent.position);
    const normalized = Vector.normalize(desired);
    const scaled = Vector.multiply(normalized, agent.maxSpeed);
    const steer = Vector.subtract(scaled, agent.velocity);
    return Vector.limit(steer, agent.maxForce);
  }

  private avoidObstacles(agent: Agent): Vector2D {
    let steer = { x: 0, y: 0 };
    
    this.obstacles.forEach(obstacle => {
      const distance = Vector.distance(agent.position, obstacle.position);
      const avoidDistance = obstacle.radius + 30;
      
      if (distance < avoidDistance) {
        const diff = Vector.subtract(agent.position, obstacle.position);
        const normalized = Vector.normalize(diff);
        const force = Vector.multiply(normalized, (avoidDistance - distance) / avoidDistance);
        steer = Vector.add(steer, force);
      }
    });

    return steer;
  }

  private avoidBoundaries(agent: Agent): Vector2D {
    const margin = 50;
    const steer = { x: 0, y: 0 };

    if (agent.position.x < margin) {
      steer.x = (margin - agent.position.x) / margin;
    } else if (agent.position.x > this.width - margin) {
      steer.x = -(agent.position.x - (this.width - margin)) / margin;
    }

    if (agent.position.y < margin) {
      steer.y = (margin - agent.position.y) / margin;
    } else if (agent.position.y > this.height - margin) {
      steer.y = -(agent.position.y - (this.height - margin)) / margin;
    }

    return steer;
  }

  private panic(agent: Agent): Vector2D {
    // In panic mode, agents move away from center and increase speed
    const center = { x: this.width / 2, y: this.height / 2 };
    const fromCenter = Vector.subtract(agent.position, center);
    const normalized = Vector.normalize(fromCenter);
    return Vector.multiply(normalized, 2.0);
  }

  private gather(agent: Agent): Vector2D {
    // In gathering mode, agents move toward center
    const center = { x: this.width / 2, y: this.height / 2 };
    return this.seek(agent, center);
  }

  private handleBoundaries(agent: Agent): void {
    const margin = 10;
    
    if (agent.position.x < margin) {
      agent.position.x = margin;
      agent.velocity.x = Math.abs(agent.velocity.x);
    } else if (agent.position.x > this.width - margin) {
      agent.position.x = this.width - margin;
      agent.velocity.x = -Math.abs(agent.velocity.x);
    }

    if (agent.position.y < margin) {
      agent.position.y = margin;
      agent.velocity.y = Math.abs(agent.velocity.y);
    } else if (agent.position.y > this.height - margin) {
      agent.position.y = this.height - margin;
      agent.velocity.y = -Math.abs(agent.velocity.y);
    }
  }

  private updateTrails(agent: Agent): void {
    if (!this.config.showTrails) return;
    
    if (!this.trails.has(agent.id)) {
      this.trails.set(agent.id, []);
    }
    
    const trail = this.trails.get(agent.id)!;
    trail.push({ ...agent.position });
    
    if (trail.length > 20) {
      trail.shift();
    }
  }

  public getAgents(): Agent[] {
    return this.agents;
  }

  public getObstacles(): Obstacle[] {
    return this.obstacles;
  }

  public getTrails(): Map<string, Vector2D[]> {
    return this.trails;
  }

  public getStats() {
    const totalSpeed = this.agents.reduce((sum, agent) => sum + Vector.magnitude(agent.velocity), 0);
    const averageSpeed = totalSpeed / this.agents.length;
    const area = this.width * this.height;
    const density = this.agents.length / area * 10000; // per 100x100 area
    
    return {
      averageSpeed,
      averageDensity: density,
      clusterCount: this.calculateClusters(),
      totalDistance: this.agents.reduce((sum, agent) => sum + agent.age, 0),
      frameRate: 60
    };
  }

  private calculateClusters(): number {
    const visited = new Set<string>();
    let clusters = 0;
    
    this.agents.forEach(agent => {
      if (!visited.has(agent.id)) {
        this.dfsCluster(agent, visited);
        clusters++;
      }
    });
    
    return clusters;
  }

  private dfsCluster(agent: Agent, visited: Set<string>): void {
    visited.add(agent.id);
    
    this.agents.forEach(other => {
      if (!visited.has(other.id) && Vector.distance(agent.position, other.position) < 30) {
        this.dfsCluster(other, visited);
      }
    });
  }
}