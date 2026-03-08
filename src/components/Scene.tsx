'use client';

import { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

/* ── Animated star field with mouse parallax ──────────────── */
function ParticleField() {
    const groupRef = useRef<THREE.Group>(null);
    const mouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => {
            mouse.current = {
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: -(e.clientY / window.innerHeight) * 2 + 1,
            };
        };
        window.addEventListener('mousemove', onMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', onMouseMove);
    }, []);

    useFrame((_, delta) => {
        if (!groupRef.current) return;

        // Continuous slow rotation
        groupRef.current.rotation.y += delta * 0.05;
        groupRef.current.rotation.x += delta * 0.02;

        // Smooth mouse-driven parallax
        groupRef.current.position.x +=
            (mouse.current.x * 0.5 - groupRef.current.position.x) * 0.05;
        groupRef.current.position.y +=
            (mouse.current.y * 0.5 - groupRef.current.position.y) * 0.05;
    });

    return (
        <group ref={groupRef}>
            <Stars
                radius={60}
                depth={60}
                count={4000}
                factor={5}
                saturation={0.8}
                fade
                speed={1.5}
            />
        </group>
    );
}

/* ── GlobalScene — fixed background canvas ────────────────── */
export default function GlobalScene() {
    const [mounted, setMounted] = useState(false);

    // Only render the Canvas client-side (avoids SSR issues with WebGL)
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                zIndex: -1,
                pointerEvents: 'none',
                background: 'transparent'
            }}
            aria-hidden="true"
        >
            <Canvas
                camera={{ position: [0, 0, 5], fov: 75 }}
                dpr={[1, 1.5]}
                gl={{ antialias: false, powerPreference: 'low-power' }}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.4} />
                    <ParticleField />
                </Suspense>
            </Canvas>
        </div>
    );
}
