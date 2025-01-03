import React, { useState, useEffect } from "react";
import * as THREE from "three";
import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";
import picture1 from "../public/picture-1.png";
import { useTexture } from "@react-three/drei";

export default function Particles() {
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  const [sizes, setSizes] = useState(
    new THREE.Vector2(
      window.innerWidth * pixelRatio,
      window.innerHeight * pixelRatio
    )
  );

  // Gebruik useLoader om de afbeelding te laden als texture
  const pictureTexture = useTexture(picture1);

  // Update resolution dynamically on window resize
  useEffect(() => {
    const handleResize = () => {
      setSizes(
        new THREE.Vector2(
          window.innerWidth * pixelRatio,
          window.innerHeight * pixelRatio
        )
      );
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <points>
      <planeGeometry args={[10, 10, 128, 128]} />
      <shaderMaterial
        vertexShader={particlesVertexShader}
        fragmentShader={particlesFragmentShader}
        uniforms={{
          uResolution: { value: sizes },
          uPictureTexture: { value: pictureTexture },
        }}
      />
    </points>
  );
}
