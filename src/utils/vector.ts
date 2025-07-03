import { Vector2D } from '../types/simulation';

export class Vector {
  static create(x: number, y: number): Vector2D {
    return { x, y };
  }

  static add(a: Vector2D, b: Vector2D): Vector2D {
    return { x: a.x + b.x, y: a.y + b.y };
  }

  static subtract(a: Vector2D, b: Vector2D): Vector2D {
    return { x: a.x - b.x, y: a.y - b.y };
  }

  static multiply(v: Vector2D, scalar: number): Vector2D {
    return { x: v.x * scalar, y: v.y * scalar };
  }

  static divide(v: Vector2D, scalar: number): Vector2D {
    return { x: v.x / scalar, y: v.y / scalar };
  }

  static magnitude(v: Vector2D): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  }

  static normalize(v: Vector2D): Vector2D {
    const mag = Vector.magnitude(v);
    return mag > 0 ? Vector.divide(v, mag) : { x: 0, y: 0 };
  }

  static limit(v: Vector2D, max: number): Vector2D {
    const mag = Vector.magnitude(v);
    return mag > max ? Vector.multiply(Vector.normalize(v), max) : v;
  }

  static distance(a: Vector2D, b: Vector2D): number {
    return Vector.magnitude(Vector.subtract(a, b));
  }

  static dot(a: Vector2D, b: Vector2D): number {
    return a.x * b.x + a.y * b.y;
  }

  static angle(v: Vector2D): number {
    return Math.atan2(v.y, v.x);
  }

  static fromAngle(angle: number, magnitude: number = 1): Vector2D {
    return {
      x: Math.cos(angle) * magnitude,
      y: Math.sin(angle) * magnitude
    };
  }

  static lerp(a: Vector2D, b: Vector2D, t: number): Vector2D {
    return {
      x: a.x + (b.x - a.x) * t,
      y: a.y + (b.y - a.y) * t
    };
  }

  static random(magnitude: number = 1): Vector2D {
    const angle = Math.random() * 2 * Math.PI;
    return Vector.fromAngle(angle, magnitude);
  }
}