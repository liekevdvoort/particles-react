import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import particlesVertexShader from "./shaders/particles/vertex.glsl";
import particlesFragmentShader from "./shaders/particles/fragment.glsl";
import picture1 from "../public/picture-1.png";
import glow from "../public/glow.png";
import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

export default function Particles() {
  const interactivePlane = useRef();
  const pixelRatio = Math.min(window.devicePixelRatio, 2);
  const {
    // gl, // WebGL renderer
    // scene, // Default scene
    // camera, // Default camera
    raycaster, // Default raycaster
    size, // Bounds of the view (which stretches 100% and auto-adjusts)
    // viewport, // Bounds of the viewport in 3d units + factor (size/viewport)
    // aspect, // Aspect ratio (size.width / size.height)
    // mouse, // Current, centered, normalized 2D mouse coordinates
    // raycaster, // Intternal raycaster instance
    // clock, // THREE.Clock (useful for useFrame deltas)
    // invalidate, // Invalidates a single frame (for <Canvas invalidateFrameloop />)
    // intersect, // Calls onMouseMove handlers for objects underneath the cursor
    // setDefaultCamera, // Sets the default camera
  } = useThree();

  /**
   * Displacement.current
   */
  const displacement = useRef({
    canvas: null,
    context: null,
    glowImage: null,
    texture: null,
    screenCursor: new THREE.Vector2(9999, 9999),
    canvasCursor: new THREE.Vector2(9999, 9999),
  });

  useEffect(() => {
    // 2D canvas
    displacement.current.canvas = document.createElement("canvas");
    displacement.current.canvas.width = 128;
    displacement.current.canvas.height = 128;

    // styles
    displacement.current.canvas.style.position = "fixed";
    displacement.current.canvas.style.width = "256px";
    displacement.current.canvas.style.height = "256px";
    displacement.current.canvas.style.top = 0;
    displacement.current.canvas.style.left = 0;
    displacement.current.canvas.style.zIndex = 10;

    document.body.append(displacement.current.canvas);

    // Context
    displacement.current.context = displacement.current.canvas.getContext("2d");
    displacement.current.context.fillRect(
      0,
      0,
      displacement.current.canvas.width,
      displacement.current.canvas.height
    );

    // Glow image
    displacement.current.glowImage = new Image();
    displacement.current.glowImage.src = glow;
  }, []);

  // Gebruik useLoader om de afbeelding te laden als texture
  const pictureTexture = useTexture(picture1);

  const pointerMove = (event) => {
    displacement.current.screenCursor.x = (event.clientX / size.width) * 2 - 1;
    displacement.current.screenCursor.y =
      -(event.clientY / size.height) * 2 + 1;
  };

  displacement.current.texture = new THREE.CanvasTexture(
    displacement.current.canvas
  );

  useFrame(() => {
    /**
     * Raycaster
     */
    const intersections = raycaster.intersectObject(interactivePlane.current);

    if (intersections.length) {
      const uv = intersections[0].uv;
      displacement.current.canvasCursor.x =
        uv.x * displacement.current.canvas.width;
      displacement.current.canvasCursor.y =
        (1 - uv.y) * displacement.current.canvas.height;
    }

    /**
     * Displacement
     */
    // Fade out
    displacement.current.context.globalCompositeOperation = "source-over";
    displacement.current.context.globalAlpha = 0.02;
    displacement.current.context.fillRect(
      0,
      0,
      displacement.current.canvas.width,
      displacement.current.canvas.height
    );
    // Draw glow
    const glowSize = displacement.current.canvas.width * 0.25;
    displacement.current.context.globalCompositeOperation = "lighten";
    displacement.current.context.globalAlpha = 1;
    displacement.current.context.drawImage(
      displacement.current.glowImage,
      displacement.current.canvasCursor.x - glowSize * 0.5,
      displacement.current.canvasCursor.y - glowSize * 0.5,
      glowSize,
      glowSize
    );

    // Texture
    displacement.current.texture.needsUpdate = true;
  });

  return (
    <>
      <points>
        <planeGeometry args={[10, 10, 128, 128]} />
        <shaderMaterial
          vertexShader={particlesVertexShader}
          fragmentShader={particlesFragmentShader}
          uniforms={{
            uResolution: {
              value: new THREE.Vector2(
                size.height * pixelRatio,
                size.width * pixelRatio
              ),
            },
            uPictureTexture: { value: pictureTexture },
            uDisplacementTexture: {
              value: displacement.current.texture,
            },
          }}
        />
      </points>
      <mesh visible={false} ref={interactivePlane} onPointerMove={pointerMove}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial />
      </mesh>
    </>
  );
}
