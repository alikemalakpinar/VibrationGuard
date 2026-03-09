import { useState, useEffect, useRef, useMemo } from 'react';

const VibrationWaveform = ({ data, threshold = 7 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [waveData, setWaveData] = useState([]);
  const phaseRef = useRef(0);

  const vibValue = data?.value ?? 0;
  const frequency = data?.frequency ?? 50;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const draw = () => {
      phaseRef.current += 0.03;
      ctx.clearRect(0, 0, width, height);

      // Background grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
      ctx.lineWidth = 0.5;
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Center line
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Threshold lines
      const thresholdY1 = height / 2 - (threshold / 15) * (height / 2) * 0.8;
      const thresholdY2 = height / 2 + (threshold / 15) * (height / 2) * 0.8;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.3)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(0, thresholdY1);
      ctx.lineTo(width, thresholdY1);
      ctx.moveTo(0, thresholdY2);
      ctx.lineTo(width, thresholdY2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Threshold labels
      ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.font = '9px Inter, sans-serif';
      ctx.fillText('Eşik', width - 30, thresholdY1 - 4);

      // Danger zone fill
      const dangerGrad = ctx.createLinearGradient(0, 0, 0, thresholdY1);
      dangerGrad.addColorStop(0, 'rgba(239, 68, 68, 0.02)');
      dangerGrad.addColorStop(1, 'rgba(239, 68, 68, 0.06)');
      ctx.fillStyle = dangerGrad;
      ctx.fillRect(0, 0, width, thresholdY1);

      const dangerGrad2 = ctx.createLinearGradient(0, thresholdY2, 0, height);
      dangerGrad2.addColorStop(0, 'rgba(239, 68, 68, 0.06)');
      dangerGrad2.addColorStop(1, 'rgba(239, 68, 68, 0.02)');
      ctx.fillStyle = dangerGrad2;
      ctx.fillRect(0, thresholdY2, width, height - thresholdY2);

      // Draw waveform
      const amplitude = (vibValue / 15) * (height / 2) * 0.8;
      const freq = frequency / 100;
      const phase = phaseRef.current;
      const noise = vibValue > 5 ? 0.3 : 0.1;

      // Glow effect
      ctx.shadowColor = vibValue > threshold
        ? 'rgba(239, 68, 68, 0.5)'
        : vibValue > 4
        ? 'rgba(245, 158, 11, 0.4)'
        : 'rgba(34, 197, 94, 0.3)';
      ctx.shadowBlur = 8;

      // Main waveform
      ctx.beginPath();
      ctx.strokeStyle = vibValue > threshold
        ? '#ef4444'
        : vibValue > 4
        ? '#f59e0b'
        : '#22c55e';
      ctx.lineWidth = 2.5;

      for (let x = 0; x < width; x++) {
        const t = x / width;
        const baseWave = Math.sin(t * Math.PI * 2 * freq * 3 + phase);
        const harmonic = Math.sin(t * Math.PI * 2 * freq * 7 + phase * 1.5) * 0.3;
        const randomNoise = (Math.random() - 0.5) * noise;
        const envelope = Math.sin(t * Math.PI) * 0.8 + 0.2;
        const y = height / 2 + (baseWave + harmonic + randomNoise) * amplitude * envelope;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Secondary waveform (ghost)
      ctx.beginPath();
      ctx.strokeStyle = vibValue > threshold
        ? 'rgba(239, 68, 68, 0.15)'
        : 'rgba(34, 197, 94, 0.1)';
      ctx.lineWidth = 1.5;

      for (let x = 0; x < width; x++) {
        const t = x / width;
        const baseWave = Math.sin(t * Math.PI * 2 * freq * 3 + phase - 0.5);
        const y = height / 2 + baseWave * amplitude * 0.6;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [vibValue, frequency, threshold]);

  return (
    <div className="waveform-container">
      <div className="waveform-header">
        <h4>Vibrasyon Dalga Formu</h4>
        <div className="waveform-legend">
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#22c55e' }} /> Normal
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#f59e0b' }} /> Orta
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#ef4444' }} /> Yüksek
          </span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        width={600}
        height={180}
        style={{
          width: '100%',
          height: '180px',
          borderRadius: '12px',
          background: 'rgba(15, 23, 42, 0.03)',
        }}
      />
      <div className="waveform-stats">
        <div className="wf-stat">
          <span className="wf-stat-label">Anlık</span>
          <span className="wf-stat-value" style={{ color: vibValue > threshold ? '#ef4444' : '#22c55e' }}>
            {vibValue.toFixed(1)} mm/s
          </span>
        </div>
        <div className="wf-stat">
          <span className="wf-stat-label">Frekans</span>
          <span className="wf-stat-value">{frequency} Hz</span>
        </div>
        <div className="wf-stat">
          <span className="wf-stat-label">Peak</span>
          <span className="wf-stat-value">{data?.peak?.toFixed(1) ?? '--'} mm/s</span>
        </div>
        <div className="wf-stat">
          <span className="wf-stat-label">RMS</span>
          <span className="wf-stat-value">{data?.rms?.toFixed(1) ?? '--'} mm/s</span>
        </div>
      </div>
    </div>
  );
};

export default VibrationWaveform;
