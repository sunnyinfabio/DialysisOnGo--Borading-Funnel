"use client";

import { useEffect, useRef, useState } from "react";
import Globe from "react-globe.gl";

export default function GlobeComponent() {
  const globeRef = useRef<any>(null);
  const [countries, setCountries] = useState({ features: [] });
  const [windowWidth, setWindowWidth] = useState(600);

  useEffect(() => {
    // Handle window resize for globe responsiveness
    const handleResize = () => setWindowWidth(Math.min(window.innerWidth - 48, 600));
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Fetch India GeoJSON data
    fetch('https://raw.githubusercontent.com/Subhash9325/GeoJson-Data-of-Indian-States/master/Indian_States')
      .then(res => res.json())
      .then(data => setCountries(data))
      .catch(err => console.error("Could not load map data", err));

    if (globeRef.current) {
      // Fix perspective to focus completely on India
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
      globeRef.current.controls().enableZoom = false;
      globeRef.current.pointOfView({ lat: 21, lng: 82, altitude: 0.8 }, 1000);
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cities = [
    { name: "Delhi", lat: 28.6139, lng: 77.2090 },
    { name: "Mumbai", lat: 19.0760, lng: 72.8777 },
    { name: "Bangalore", lat: 12.9716, lng: 77.5946 },
    { name: "Goa", lat: 15.2993, lng: 74.1240 },
    { name: "Udaipur", lat: 24.5854, lng: 73.7125 },
    { name: "Amritsar", lat: 31.6340, lng: 74.8723 },
    { name: "Gurugram", lat: 28.4595, lng: 77.0266 },
    { name: "Katra", lat: 32.9906, lng: 74.9319 }
  ];

  return (
    <div className="flex items-center justify-center cursor-move h-full w-full">
      <Globe
        ref={globeRef}
        width={windowWidth}
        height={600}
        showGlobe={false} // Hide the earth sphere to only show polygons
        showAtmosphere={false}
        backgroundColor="rgba(0,0,0,0)"
        
        // India Polygons
        polygonsData={countries.features}
        polygonAltitude={0.02}
        polygonCapColor={() => '#e12454'} // Primary color
        polygonSideColor={() => 'rgba(225, 36, 84, 0.2)'}
        polygonStrokeColor={() => '#ffffff'}
        
        // Serving Cities Labels
        labelsData={cities}
        labelLat={d => (d as any).lat}
        labelLng={d => (d as any).lng}
        labelText={d => (d as any).name}
        labelSize={1.5}
        labelDotRadius={0.5}
        labelColor={() => 'white'}
        labelResolution={2}
      />
    </div>
  );
}
