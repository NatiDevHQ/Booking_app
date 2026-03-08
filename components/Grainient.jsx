import React, { useEffect, useRef, useMemo } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh, Color, Vec2 } from 'ogl';

const vertex = `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0, 1);
  }
`;

const fragment = `
  precision highp float;
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec2 uResolution;
  uniform float uGrainAmount;
  uniform float uWarpStrength;
  uniform float uTimeSpeed;
  
  varying vec2 vUv;

  // Pseudo-random function for noise
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  // 2D Noise function
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 uv = vUv;
    float time = uTime * uTimeSpeed;
    
    // Smooth, slow warp for subtle light movement
    vec2 warpUv = uv;
    warpUv.x += noise(uv * 1.8 + time * 0.5) * uWarpStrength;
    warpUv.y += noise(uv * 1.8 - time * 0.3) * uWarpStrength;
    
    // Increased noise coverage for highlights
    float n1 = noise(warpUv * 2.2 + time * 0.4);
    float n2 = noise(warpUv * 1.4 - time * 0.2);
    
    // PURE BLACK BASE
    vec3 color = vec3(0.0, 0.0, 0.0); 
    
    // BALANCED BLUE HIGHLIGHTS
    float highlight1 = pow(n1, 3.2) * 0.45; 
    float highlight2 = pow(n2, 2.8) * 0.3;
    
    vec3 electricBlue = vec3(0.0, 0.4, 1.0); 
    vec3 royalBlue = vec3(0.0, 0.2, 0.8);
    vec3 ambientBlue = vec3(0.0, 0.04, 0.2); 
    
    color = mix(color, ambientBlue, n1 * 0.25); 
    color += electricBlue * highlight1;         
    color += royalBlue * highlight2;
    
    // Add fine film grain
    float grain = (random(uv + fract(time * 0.5)) - 0.5) * uGrainAmount;
    color += grain * 0.25;
    
    gl_FragColor = vec4(color, 1.0);
  }
`;

/**
 * Grainient Background Component
 * A high-performance animated gradient background with film grain.
 */
const Grainient = ({ 
  className = "", 
  color1 = "#ff6b6b", 
  color2 = "#4ecdc4", 
  color3 = "#45b7d1",
  grainAmount = 0.05,
  warpStrength = 0.4,
  timeSpeed = 0.2
}) => {
  const containerRef = useRef();
  const canvasRef = useRef();
  
  const colors = useMemo(() => ({
    c1: new Color(color1),
    c2: new Color(color2),
    c3: new Color(color3)
  }), [color1, color2, color3]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new Renderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      dpr: window.devicePixelRatio || 1
    });

    const gl = renderer.gl;
    const camera = new Camera(gl);
    camera.position.z = 5;

    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: colors.c1 },
        uColor2: { value: colors.c2 },
        uColor3: { value: colors.c3 },
        uResolution: { value: new Vec2() },
        uGrainAmount: { value: grainAmount },
        uWarpStrength: { value: warpStrength },
        uTimeSpeed: { value: timeSpeed }
      }
    });

    const mesh = new Mesh(gl, { geometry, program });

    let animationId;
    const update = (t) => {
      animationId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
    };

    const resize = () => {
      if (!containerRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      renderer.setSize(width, height);
      program.uniforms.uResolution.value.set(gl.canvas.width, gl.canvas.height);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(containerRef.current);
    
    resize();
    animationId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      // Cleanup OGL resources if needed
    };
  }, [colors, grainAmount, warpStrength, timeSpeed]);

  return (
    <div ref={containerRef} className={`grainient-container ${className}`}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};

export default Grainient;
