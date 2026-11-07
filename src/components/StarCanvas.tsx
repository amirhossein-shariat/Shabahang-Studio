"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import type { Group } from "three";

function Rig({ reduced }: { reduced: boolean }) {
  const group = useRef<Group>(null);
  const target = useRef({ x: 0, y: 0, s: 0 });

  useEffect(() => {
    if (reduced) return;
    const move = (e: PointerEvent) => {
      target.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const scroll = () => {
      target.current.s = window.scrollY / Math.max(1, window.innerHeight);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", scroll);
    };
  }, [reduced]);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const k = 1 - Math.pow(0.001, dt);
    g.rotation.y += (target.current.x * 0.08 - g.rotation.y) * k;
    g.rotation.x += (target.current.y * 0.05 + target.current.s * 0.15 - g.rotation.x) * k;
  });

  return <group ref={group} />;
}

export default function StarCanvas({ count, reduced }: { count: number; reduced: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 1], fov: 75 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      frameloop={reduced ? "demand" : "always"}
      aria-hidden="true"
    >
      <group>
        <Stars radius={100} depth={50} count={count} factor={4} saturation={0} fade speed={reduced ? 0 : 1} />
      </group>
      <Rig reduced={reduced} />
    </Canvas>
  );
}
