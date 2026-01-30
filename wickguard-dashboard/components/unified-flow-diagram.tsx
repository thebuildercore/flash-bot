'use client';

import { useEffect, useRef, useState } from 'react';

interface UnifiedFlowDiagramProps {
  stage: number;
  userTokens: number;
  safeVaultTokens: number;
}

export function UnifiedFlowDiagram({ stage, userTokens, safeVaultTokens }: UnifiedFlowDiagramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      timeRef.current += 0.01;

      // Clear canvas
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // Add subtle grid pattern
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Left section - L1 Setup
      const leftX = 100;
      const leftY = height / 2;

      // Draw left box
      drawRoundedRect(ctx, leftX - 80, leftY - 180, 160, 360, 15, 'rgba(100, 150, 255, 0.15)', 'rgba(100, 150, 255, 0.3)');

      // Center section - L2 Bridge
      const centerX = width / 2;
      const centerY = height / 2;

      // Draw large glowing circle
      const circleRadius = 200;
      drawGlowingCircle(ctx, centerX, centerY, circleRadius, 'rgba(100, 200, 100, 0.4)', timeRef.current);

      // Portal in center
      drawPortal(ctx, centerX, centerY, 80, timeRef.current);

      // Right section - Recovery
      const rightX = width - 100;
      const rightY = height / 2;

      // Draw right box
      drawRoundedRect(ctx, rightX - 80, rightY - 180, 160, 360, 15, 'rgba(100, 150, 255, 0.15)', 'rgba(100, 150, 255, 0.3)');

      // Draw animated flows
      if (stage >= 2) {
        drawFlow(ctx, leftX + 80, leftY - 100, centerX - circleRadius - 20, centerY, 'rgba(100, 150, 255, 0.8)', timeRef.current);
      }
      if (stage >= 3) {
        drawFlow(ctx, centerX + circleRadius + 20, centerY, rightX - 80, rightY - 100, 'rgba(255, 150, 100, 0.8)', timeRef.current);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [stage]);

  return (
    <div className="w-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden">
      <canvas
        ref={canvasRef}
        width={1200}
        height={500}
        className="w-full h-auto"
      />
    </div>
  );
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillColor: string,
  strokeColor: string
) {
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  ctx.fill();
  ctx.stroke();
}

function drawGlowingCircle(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  time: number
) {
  // Outer glow
  const gradient = ctx.createRadialGradient(x, y, radius - 10, x, y, radius + 20);
  gradient.addColorStop(0, 'rgba(100, 200, 100, 0)');
  gradient.addColorStop(0.7, 'rgba(100, 200, 100, 0.3)');
  gradient.addColorStop(1, 'rgba(100, 200, 100, 0)');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius + 20, 0, Math.PI * 2);
  ctx.fill();

  // Main circle
  ctx.strokeStyle = 'rgba(100, 200, 100, 0.8)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Animated pulsing ring
  const pulse = Math.sin(time * 3) * 0.2 + 0.8;
  ctx.strokeStyle = `rgba(100, 200, 100, ${pulse * 0.4})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, radius - 30, 0, Math.PI * 2);
  ctx.stroke();
}

function drawPortal(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, time: number) {
  // Portal outer ring - purple to blue gradient
  ctx.strokeStyle = 'rgba(150, 100, 255, 0.8)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.stroke();

  // Rotating inner rings
  const rotation = (time * 2) % (Math.PI * 2);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);

  ctx.strokeStyle = 'rgba(100, 150, 255, 0.6)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(150, 200, 255, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.4, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();

  // Pulsing center
  const pulse = Math.sin(time * 4) * 0.3 + 0.7;
  ctx.fillStyle = `rgba(150, 100, 255, ${pulse * 0.3})`;
  ctx.beginPath();
  ctx.arc(x, y, size * 0.2, 0, Math.PI * 2);
  ctx.fill();
}

function drawFlow(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  color: string,
  time: number
) {
  // Bezier curve path
  const controlX = (startX + endX) / 2;
  const controlY = (startY + endY) / 2 - 100;

  // Draw main line
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.quadraticCurveTo(controlX, controlY, endX, endY);
  ctx.stroke();

  // Animated glow
  ctx.strokeStyle = color.replace('0.8', '0.3');
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.quadraticCurveTo(controlX, controlY, endX, endY);
  ctx.stroke();

  // Moving particles along path
  const t = (time * 0.5) % 1;
  const particleX = Math.pow(1 - t, 2) * startX + 2 * (1 - t) * t * controlX + Math.pow(t, 2) * endX;
  const particleY = Math.pow(1 - t, 2) * startY + 2 * (1 - t) * t * controlY + Math.pow(t, 2) * endY;

  ctx.fillStyle = color.replace('0.8', '0.9');
  ctx.beginPath();
  ctx.arc(particleX, particleY, 4, 0, Math.PI * 2);
  ctx.fill();
}
