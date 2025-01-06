import React from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import Particles from "./Particles";

export default function Experience() {
  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 18], fov: 35 }}
        onCreated={({ gl }) => {
          gl.setClearColor("#181818");
        }}
      >
        <PerspectiveCamera makeDefault position={[0, 0, 18]} />
        <Particles />
      </Canvas>
    </>
  );
}
