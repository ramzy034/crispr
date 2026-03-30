import { useEffect, useRef } from "react";

type Props = { color: string };

export default function AnimatedDNA({ color }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let t = 0;

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const rungs = 18;
      const amplitude = 55;
      const cx = W / 2;

      for (let i = 0; i <= rungs; i++) {
        const y = (H / rungs) * i + 10;
        const phase = (i / rungs) * Math.PI * 4 + t;
        const x1 = cx + Math.sin(phase) * amplitude;
        const x2 = cx - Math.sin(phase) * amplitude;
        const alpha = 0.25 + 0.45 * Math.abs(Math.sin(phase));

        // Rung connector
        ctx.strokeStyle = `rgba(164,174,184,${alpha})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x1, y);
        ctx.lineTo(x2, y);
        ctx.stroke();

        // Strand 1 node
        const g1 = ctx.createRadialGradient(x1, y, 0, x1, y, 7);
        g1.addColorStop(0, color);
        g1.addColorStop(1, color + "00");
        ctx.fillStyle = g1;
        ctx.beginPath();
        ctx.arc(x1, y, 7, 0, Math.PI * 2);
        ctx.fill();

        // Strand 2 node
        const g2 = ctx.createRadialGradient(x2, y, 0, x2, y, 7);
        g2.addColorStop(0, "#ef9a9a");
        g2.addColorStop(1, "#ef9a9a00");
        ctx.fillStyle = g2;
        ctx.beginPath();
        ctx.arc(x2, y, 7, 0, Math.PI * 2);
        ctx.fill();
      }

      // Backbone curve — strand 1
      ctx.beginPath();
      for (let i = 0; i <= rungs * 4; i++) {
        const y = (H / (rungs * 4)) * i + 10;
        const phase = (i / (rungs * 4)) * Math.PI * 4 + t;
        const x = cx + Math.sin(phase) * amplitude;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color + "66";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Backbone curve — strand 2
      ctx.beginPath();
      for (let i = 0; i <= rungs * 4; i++) {
        const y = (H / (rungs * 4)) * i + 10;
        const phase = (i / (rungs * 4)) * Math.PI * 4 + t;
        const x = cx - Math.sin(phase) * amplitude;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "#ef9a9a66";
      ctx.lineWidth = 2;
      ctx.stroke();

      t += 0.018;
      rafRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      width={300}
      height={220}
      className="lp-dna-canvas"
    />
  );
}