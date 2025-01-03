import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";

function Particles() {
  const [resolution, setResolution] = useState(
    new THREE.Vector2(
      window.innerWidth * window.devicePixelRatio,
      window.innerHeight * window.devicePixelRatio
    )
  );

  // Update resolution dynamically on window resize
  useEffect(() => {
    const handleResize = () => {
      setResolution(
        new THREE.Vector2(
          window.innerWidth * window.devicePixelRatio,
          window.innerHeight * window.devicePixelRatio
        )
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <points>
      <planeGeometry args={[10, 10, 32, 32]} />
      <shaderMaterial
        vertexShader={particlesVertexShader}
        fragmentShader={particlesFragmentShader}
        uniforms={{
          uResolution: { value: resolution },
        }}
      />
    </points>
  );
}

export default function Experience() {
  return (
    <Canvas
      camera={{ position: [0, 0, 18], fov: 35 }}
      onCreated={({ gl }) => {
        gl.setClearColor("#181818");
      }}
    >
      <ambientLight />
      <PerspectiveCamera makeDefault position={[0, 0, 18]} />
      <OrbitControls />
      <Particles />
    </Canvas>
  );
}
