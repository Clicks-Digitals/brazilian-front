"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { COFFEE_ORIGINS, HOUSE_DESTINATION, type GlobeFocusId } from "@/lib/coffee-origins";

type GlobeApi = GlobeMethods & {
  globeMaterial: () => {
    color: { set: (value: string) => void };
    emissive: { set: (value: string) => void };
    specular?: { set: (value: string) => void };
    emissiveIntensity: number;
    shininess: number;
  };
};

const GOLD = "#d4b46a";
const LAND = "#b7e3c4";
const FOREST = "#1b4a38";
const GLOBE_GREEN = "#2f7a58";
const ATMOSPHERE = "#6fb58a";
const VIEW_ALTITUDE = 2.2;

type LandDot = { lat: number; lng: number };
type Marker = {
  id: string;
  lat: number;
  lng: number;
  label: string;
  kind: "origin" | "house";
};

let landDotsPromise: Promise<LandDot[]> | null = null;

function loadLandDots(rows = 92): Promise<LandDot[]> {
  if (landDotsPromise) return landDotsPromise;
  landDotsPromise = new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve([]);
        return;
      }
      ctx.drawImage(img, 0, 0);
      const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const dots: LandDot[] = [];
      for (let y = 0; y < rows; y += 1) {
        const lat = 90 - (y / (rows - 1)) * 180;
        const count = Math.max(1, Math.round(2 * Math.PI * Math.cos((lat * Math.PI) / 180) * (rows / Math.PI)));
        for (let x = 0; x < count; x += 1) {
          const lng = -180 + (x / count) * 360;
          const px = Math.min(width - 1, Math.floor(((lng + 180) / 360) * width));
          const py = Math.min(height - 1, Math.floor(((90 - lat) / 180) * height));
          const i = (py * width + px) * 4;
          if (data[i] > 18) dots.push({ lat, lng });
        }
      }
      resolve(dots);
    };
    img.onerror = reject;
    img.src = "/assets/earth-topology.png";
  });
  return landDotsPromise;
}

function targetFor(id: GlobeFocusId) {
  if (id === "jordan") return HOUSE_DESTINATION;
  return COFFEE_ORIGINS.find((origin) => origin.id === id);
}

export function CoffeeGlobe({
  labels,
  focusId,
  className,
}: {
  labels: Record<string, string>;
  focusId?: GlobeFocusId | null;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = useState(0);
  const [ready, setReady] = useState(false);
  const [landDots, setLandDots] = useState<LandDot[]>([]);
  const reduceMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
  const globeFill = useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 8;
    canvas.height = 4;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = GLOBE_GREEN;
    ctx.fillRect(0, 0, 8, 4);
    return canvas.toDataURL("image/png");
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const sync = () => {
      const width = Math.round(el.getBoundingClientRect().width);
      if (width > 0) setSize(width);
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    const stop = (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    const stopPinch = (event: TouchEvent) => {
      if (event.touches.length > 1) stop(event);
    };
    el.addEventListener("wheel", stop, { passive: false, capture: true });
    el.addEventListener("touchmove", stopPinch, { passive: false, capture: true });
    el.addEventListener("gesturestart", stop, { capture: true });
    el.addEventListener("gesturechange", stop, { capture: true });
    el.addEventListener("gestureend", stop, { capture: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("wheel", stop, { capture: true });
      el.removeEventListener("touchmove", stopPinch, { capture: true });
      el.removeEventListener("gesturestart", stop, { capture: true });
      el.removeEventListener("gesturechange", stop, { capture: true });
      el.removeEventListener("gestureend", stop, { capture: true });
    };
  }, []);

  useEffect(() => {
    let active = true;
    loadLandDots()
      .then((dots) => {
        if (active) setLandDots(dots);
      })
      .catch(() => {
        if (active) setLandDots([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const markers: Marker[] = useMemo(
    () => [
      ...COFFEE_ORIGINS.map((origin) => ({
        id: origin.id,
        lat: origin.lat,
        lng: origin.lng,
        label: labels[origin.id],
        kind: "origin" as const,
      })),
      {
        id: HOUSE_DESTINATION.id,
        lat: HOUSE_DESTINATION.lat,
        lng: HOUSE_DESTINATION.lng,
        label: labels.jordan,
        kind: "house" as const,
      },
    ],
    [labels],
  );

  const arcs = useMemo(
    () =>
      COFFEE_ORIGINS.map((origin, index) => ({
        startLat: origin.lat,
        startLng: origin.lng,
        endLat: HOUSE_DESTINATION.lat,
        endLng: HOUSE_DESTINATION.lng,
        gap: index * 0.18,
      })),
    [],
  );

  const lockOrbit = useCallback((globe: GlobeApi) => {
    const controls = globe.controls();
    const radius = globe.getGlobeRadius();
    const distance = radius * (1 + VIEW_ALTITUDE);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.zoomSpeed = 0;
    controls.zoomToCursor = false;
    controls.minDistance = distance;
    controls.maxDistance = distance;
    const mouseButtons = controls.mouseButtons as { LEFT?: number; MIDDLE?: number; RIGHT?: number };
    mouseButtons.MIDDLE = -1;
    const touches = controls.touches as { ONE?: number; TWO?: number };
    touches.TWO = -1;
    const dolly = controls as typeof controls & { dollyIn?: (scale?: number) => void; dollyOut?: (scale?: number) => void };
    dolly.dollyIn = () => undefined;
    dolly.dollyOut = () => undefined;
  }, []);

  const flyTo = useCallback(
    (id: GlobeFocusId | null | undefined, duration = 1100) => {
      const globe = globeRef.current as GlobeApi | undefined;
      const target = id ? targetFor(id) : null;
      if (!globe || !target) return;
      globe.controls().autoRotate = false;
      globe.pointOfView({ lat: target.lat, lng: target.lng, altitude: VIEW_ALTITUDE }, duration);
      lockOrbit(globe);
    },
    [lockOrbit],
  );

  const paint = useCallback(() => {
    const globe = globeRef.current as GlobeApi | undefined;
    if (!globe) return;
    const material = globe.globeMaterial();
    material.color.set(GLOBE_GREEN);
    material.emissive.set(GLOBE_GREEN);
    material.specular?.set(FOREST);
    material.emissiveIntensity = 1.35;
    material.shininess = 0;
    const controls = globe.controls();
    controls.autoRotate = !reduceMotion && !focusId;
    controls.autoRotateSpeed = 0.45;
    const opening = (focusId && targetFor(focusId)) || { lat: 8, lng: 8 };
    globe.pointOfView({ lat: opening.lat, lng: opening.lng, altitude: VIEW_ALTITUDE }, 0);
    lockOrbit(globe);
    setReady(true);
  }, [focusId, lockOrbit, reduceMotion]);

  useEffect(() => {
    const globe = globeRef.current as GlobeApi | undefined;
    if (!globe || !ready) return;
    const controls = globe.controls();
    const keepLocked = () => lockOrbit(globe);
    keepLocked();
    controls.addEventListener("change", keepLocked);
    controls.addEventListener("start", keepLocked);
    controls.addEventListener("end", keepLocked);
    return () => {
      controls.removeEventListener("change", keepLocked);
      controls.removeEventListener("start", keepLocked);
      controls.removeEventListener("end", keepLocked);
    };
  }, [lockOrbit, ready, size]);

  useEffect(() => {
    flyTo(focusId);
    if (!focusId || reduceMotion) return;
    const resume = window.setTimeout(() => {
      const globe = globeRef.current;
      if (globe) globe.controls().autoRotate = true;
    }, 4200);
    return () => window.clearTimeout(resume);
  }, [flyTo, focusId, reduceMotion]);

  const htmlElement = useCallback((data: object) => {
    const marker = data as Marker;
    const wrap = document.createElement("div");
    wrap.className = `origin-pin origin-pin-${marker.kind}`;
    wrap.innerHTML = `<span class="origin-pin-dot"></span><span class="origin-pin-name">${marker.label}</span>`;
    return wrap;
  }, []);

  return (
    <div ref={wrapRef} className={className}>
      {size > 0 ? (
      <Globe
        ref={globeRef}
        width={size}
        height={size}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl={globeFill}
        showGlobe
        showAtmosphere
        atmosphereColor={ATMOSPHERE}
        atmosphereAltitude={0.28}
        onGlobeReady={() => {
          let tries = 0;
          const tick = () => {
            if (globeRef.current) {
              paint();
              return;
            }
            tries += 1;
            if (tries < 30) window.requestAnimationFrame(tick);
          };
          tick();
        }}
        pointsData={landDots}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => LAND}
        pointAltitude={0.012}
        pointRadius={0.38}
        pointResolution={4}
        pointsMerge
        pointsTransitionDuration={0}
        arcsData={arcs}
        arcColor={() => [GOLD, LAND]}
        arcStroke={0.45}
        arcDashLength={0.32}
        arcDashGap={0.7}
        arcDashInitialGap="gap"
        arcDashAnimateTime={reduceMotion ? 0 : 2400}
        arcAltitudeAutoScale={0.38}
        ringsData={markers}
        ringColor={(d: object) =>
          (d as Marker).id === focusId ? GOLD : (d as Marker).kind === "house" ? GOLD : "rgba(143,191,154,0.7)"
        }
        ringMaxRadius={(d: object) => ((d as Marker).id === focusId ? 3.4 : (d as Marker).kind === "house" ? 3 : 2.1)}
        ringPropagationSpeed={reduceMotion ? 0 : 1.5}
        ringRepeatPeriod={reduceMotion ? 0 : 1700}
        htmlElementsData={markers}
        htmlLat="lat"
        htmlLng="lng"
        htmlAltitude={0.02}
        htmlElement={htmlElement}
        htmlElementVisibilityModifier={(el, visible) => {
          el.style.opacity = visible ? "1" : "0";
        }}
        enablePointerInteraction
        onZoom={(pov) => {
          const globe = globeRef.current as GlobeApi | undefined;
          if (!globe) return;
          lockOrbit(globe);
          if (Math.abs(pov.altitude - VIEW_ALTITUDE) > 0.05) {
            globe.pointOfView({ lat: pov.lat, lng: pov.lng, altitude: VIEW_ALTITUDE }, 0);
          }
        }}
      />
      ) : null}
    </div>
  );
}
