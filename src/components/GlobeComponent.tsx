"use client";

import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";

export default function GlobeComponent() {
  const globeRef = useRef<any>(null);
  const [arcsData, setArcsData] = useState<any[]>([]);

  useEffect(() => {
    // Generate some mock patient flight paths targeting India region
    const arcs = [];
    for (let i = 0; i < 30; i++) {
      arcs.push({
        startLat: (Math.random() - 0.5) * 60 + 20, 
        startLng: (Math.random() - 0.5) * 60 + 80,
        endLat: 20 + (Math.random() - 0.5) * 15,
        endLng: 80 + (Math.random() - 0.5) * 15,
        color: ['#e12454', '#0a1f44'][Math.round(Math.random())]
      });
    }
    setArcsData(arcs);

    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 1.5;
      globeRef.current.controls().enableZoom = false;
      globeRef.current.pointOfView({ lat: 20, lng: 80, altitude: 2 });
    }
  }, []);

  return (
    <div className="flex items-center justify-center cursor-move h-full w-full">
      <Globe
        ref={globeRef}
        width={600}
        height={600}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        arcsData={arcsData}
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={1500}
        arcsTransitionDuration={0}
      />
    </div>
  );
}
