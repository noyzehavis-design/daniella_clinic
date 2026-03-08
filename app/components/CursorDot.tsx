"use client";
import { useEffect, useRef } from "react";

export default function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    const move = (e: MouseEvent) => {
      dot.style.left = e.clientX + "px";
      dot.style.top = e.clientY + "px";
    };

    const grow = () => dot.classList.add("scale-[3]");
    const shrink = () => dot.classList.remove("scale-[3]");

    window.addEventListener("mousemove", move);
    document.querySelectorAll("a,button,[role=button]").forEach((el) => {
      el.addEventListener("mouseenter", grow);
      el.addEventListener("mouseleave", shrink);
    });

    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={dotRef}
      className="fixed z-[9999] w-2 h-2 rounded-full bg-primary pointer-events-none
                 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 hidden md:block"
    />
  );
}
