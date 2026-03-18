"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { animate } from "motion/react";

interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
  variant?: "gold" | "maroon" | "white";
}

const GlowingEffect = memo(
  ({
    blur = 0,
    inactiveZone = 0.7,
    proximity = 0,
    spread = 20,
    glow = false,
    className,
    movementDuration = 2,
    borderWidth = 1,
    disabled = false,
    variant = "gold",
  }: GlowingEffectProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const lastPosition = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef<number>(0);

    const getGradient = () => {
      if (variant === "maroon") {
        return `radial-gradient(circle, #8B1A1A 10%, #8B1A1A00 20%),
          radial-gradient(circle at 40% 40%, #c0392b 5%, #c0392b00 15%),
          radial-gradient(circle at 60% 60%, #FFC72C 10%, #FFC72C00 20%),
          repeating-conic-gradient(
            from 236.84deg at 50% 50%,
            #8B1A1A 0%,
            #c0392b calc(25% / 5),
            #FFC72C calc(50% / 5),
            #8B1A1A calc(75% / 5),
            #8B1A1A calc(100% / 5)
          )`;
      }
      if (variant === "white") {
        return `repeating-conic-gradient(
          from 236.84deg at 50% 50%,
          #ffffff,
          #ffffff calc(25% / 5)
        )`;
      }
      // gold (default)
      return `radial-gradient(circle, #FFC72C 10%, #FFC72C00 20%),
        radial-gradient(circle at 40% 40%, #FFD700 5%, #FFD70000 15%),
        radial-gradient(circle at 60% 60%, #8B1A1A 10%, #8B1A1A00 20%),
        radial-gradient(circle at 40% 60%, #0A0F2C 10%, #0A0F2C00 20%),
        repeating-conic-gradient(
          from 236.84deg at 50% 50%,
          #FFC72C 0%,
          #FFD700 calc(25% / 5),
          #8B1A1A calc(50% / 5),
          #0A0F2C calc(75% / 5),
          #FFC72C calc(100% / 5)
        )`;
    };

    const handleMove = useCallback(
      (e?: MouseEvent | { x: number; y: number }) => {
        if (!containerRef.current) return;

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        animationFrameRef.current = requestAnimationFrame(() => {
          const element = containerRef.current;
          if (!element) return;

          const { left, top, width, height } = element.getBoundingClientRect();
          const mouseX = e?.x ?? lastPosition.current.x;
          const mouseY = e?.y ?? lastPosition.current.y;

          if (e) {
            lastPosition.current = { x: mouseX, y: mouseY };
          }

          const center = [left + width * 0.5, top + height * 0.5];
          const distanceFromCenter = Math.hypot(
            mouseX - center[0],
            mouseY - center[1]
          );
          const inactiveRadius = 0.5 * Math.min(width, height) * inactiveZone;

          if (distanceFromCenter < inactiveRadius) {
            element.style.setProperty("--active", "0");
            return;
          }

          const isActive =
            mouseX > left - proximity &&
            mouseX < left + width + proximity &&
            mouseY > top - proximity &&
            mouseY < top + height + proximity;

          element.style.setProperty("--active", isActive ? "1" : "0");

          if (!isActive) return;

          const currentAngle =
            parseFloat(element.style.getPropertyValue("--start")) || 0;
          let targetAngle =
            (180 * Math.atan2(mouseY - center[1], mouseX - center[0])) /
              Math.PI +
            90;

          const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
          const newAngle = currentAngle + angleDiff;

          animate(currentAngle, newAngle, {
            duration: movementDuration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (value) => {
              element.style.setProperty("--start", String(value));
            },
          });
        });
      },
      [inactiveZone, proximity, movementDuration]
    );

    useEffect(() => {
      if (disabled) return;

      const handleScroll = () => handleMove();
      const handlePointerMove = (e: PointerEvent) => handleMove(e);

      window.addEventListener("scroll", handleScroll, { passive: true });
      document.body.addEventListener("pointermove", handlePointerMove, {
        passive: true,
      });

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        window.removeEventListener("scroll", handleScroll);
        document.body.removeEventListener("pointermove", handlePointerMove);
      };
    }, [handleMove, disabled]);

    return (
      <div
        ref={containerRef}
        style={
          {
            "--blur": `${blur}px`,
            "--spread": spread,
            "--start": "0",
            "--active": "0",
            "--glowingeffect-border-width": `${borderWidth}px`,
            "--repeating-conic-gradient-times": "5",
            "--gradient": getGradient(),
          } as React.CSSProperties
        }
        className={`pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity ${blur > 0 ? "blur-[var(--blur)]" : ""} ${className ?? ""}`}
      >
        <div
          className="rounded-[inherit]"
          style={{
            position: "absolute",
            inset: `calc(-1 * var(--glowingeffect-border-width, 1px))`,
            border: `var(--glowingeffect-border-width, 1px) solid transparent`,
            background: "var(--gradient)",
            backgroundAttachment: "fixed",
            opacity: "var(--active)",
            transition: "opacity 0.3s",
            maskClip: "padding-box, border-box",
            maskComposite: "intersect",
            maskImage: `linear-gradient(#0000, #0000), conic-gradient(from calc((var(--start) - var(--spread)) * 1deg), #00000000 0deg, #fff, #00000000 calc(var(--spread) * 2deg))`,
            borderRadius: "inherit",
          } as React.CSSProperties}
        />
      </div>
    );
  }
);

GlowingEffect.displayName = "GlowingEffect";

export { GlowingEffect };
