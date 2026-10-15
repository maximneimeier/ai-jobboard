"use client";

import { useEffect, useState } from "react";

type Example = { role: string; location: string };

export function useRotatingExample(items: readonly Example[], active: boolean) {
  const [index, setIndex] = useState(0);
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [phase, setPhase] = useState<"type" | "delete">("type");

  useEffect(() => {
    if (!active || items.length === 0) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const target = items[index % items.length];

    if (reduce) {
      setRole(target.role);
      setLocation(target.location);
      const id = window.setTimeout(() => {
        setIndex((current) => (current + 1) % items.length);
      }, 2800);
      return () => window.clearTimeout(id);
    }

    if (phase === "type") {
      if (role.length < target.role.length || location.length < target.location.length) {
        const id = window.setTimeout(() => {
          setRole(target.role.slice(0, role.length + 1));
          setLocation(target.location.slice(0, location.length + 1));
        }, 46);
        return () => window.clearTimeout(id);
      }
      const id = window.setTimeout(() => setPhase("delete"), 1500);
      return () => window.clearTimeout(id);
    }

    if (role.length > 0 || location.length > 0) {
      const id = window.setTimeout(() => {
        setRole((value) => value.slice(0, Math.max(0, value.length - 1)));
        setLocation((value) => value.slice(0, Math.max(0, value.length - 1)));
      }, 28);
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(() => {
      setIndex((current) => (current + 1) % items.length);
      setPhase("type");
    }, 160);
    return () => window.clearTimeout(id);
  }, [active, index, items, location.length, phase, role.length]);

  return { role, location };
}
