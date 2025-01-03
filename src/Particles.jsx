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
  const [sizes, setSizes] = useState(
    new THREE.Vector2(
      window.innerWidth * pixelRatio,
      window.innerHeight * pixelRatio
    )
  );

  const {
    // gl, // WebGL renderer
    // scene, // Default scene
    camera, // Default camera
    raycaster, // Default raycaster
    // size, // Bounds of the view (which stretches 100% and auto-adjusts)
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
    raycaster: new THREE.Raycaster(),
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

    window.addEventListener("pointermove", (event) => {
      displacement.current.screenCursor.x = (event.clientX / sizes.x) * 2 - 1;
      displacement.current.screenCursor.y = -(event.clientY / sizes.y) * 2 + 1;
    });
  }, []);

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

  useFrame(() => {
    // console.log(raycaster);
    /**
     * Raycaster
     */
    displacement.current.raycaster.setFromCamera(
      displacement.current.screenCursor,
      camera
    );
    const intersections = displacement.current.raycaster.intersectObject(
      interactivePlane.current
    );

    if (intersections.length) {
      console.log(intersections[0]);
      const uv = intersections[0].uv;
      console.log(uv);
      displacement.current.canvasCursor.x =
        uv.x * displacement.current.canvas.width;
      displacement.current.canvasCursor.y =
        (1 - uv.y) * displacement.current.canvas.height;
    }

    /**
     * Displacement
     */
    // Draw glow
    const glowSize = displacement.current.canvas.width * 0.25;
    displacement.current.context.globalCompositeOperation = "lighten";
    displacement.current.context.drawImage(
      displacement.current.glowImage,
      displacement.current.canvasCursor.x - glowSize * 0.5,
      displacement.current.canvasCursor.y - glowSize * 0.5,
      glowSize,
      glowSize
    );
  });

  return (
    <>
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
      <mesh ref={interactivePlane}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial />
      </mesh>
    </>
  );
}
