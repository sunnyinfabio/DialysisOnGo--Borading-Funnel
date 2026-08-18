"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import * as THREE from "three";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { cities, centers, services } from "@/lib/data";

import EligibilityForm from "@/components/EligibilityForm";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Phase 1 States
  const [centerLocation, setCenterLocation] = useState("");
  
  const [simulating, setSimulating] = useState(false);
  const [mockBookings, setMockBookings] = useState(4);
  const [acceptedBookings, setAcceptedBookings] = useState<number[]>([]);
  const [showAcceptedPopup, setShowAcceptedPopup] = useState(false);
  const [dashboardTab, setDashboardTab] = useState<'bookings' | 'patients' | 'schedules'>('bookings');

  // Phase 2 States
  const [showFormModal, setShowFormModal] = useState(false);

  const handleSimulate = () => {
    if (simulating) return;
    setSimulating(true);
    
    // Animate loader, then show toast
    setTimeout(() => {
      setMockBookings(prev => prev + 1);
      setSimulating(false);
      
      gsap.fromTo('.mock-toast', 
        { y: 20, opacity: 0, scale: 0.9 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' }
      );
      
      setTimeout(() => {
        gsap.to('.mock-toast', { y: -20, opacity: 0, scale: 0.9, duration: 0.4 });
      }, 3500);
    }, 1200);
  };

  const handleBentoMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      (card as HTMLElement).style.setProperty('--mouse-x', `${x}px`);
      (card as HTMLElement).style.setProperty('--mouse-y', `${y}px`);
    });
  };

  const handleMagneticMove = (e: React.MouseEvent<HTMLElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
  };
  
  const handleMagneticLeave = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
  };
  
  useEffect(() => {
    // Lenis Smooth Scroll Setup
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Three.js Network Setup
    if (canvasRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      // Clear existing canvas if strict mode double mounts
      while (canvasRef.current.firstChild) {
        canvasRef.current.removeChild(canvasRef.current.firstChild);
      }
      canvasRef.current.appendChild(renderer.domElement);

      const group = new THREE.Group();
      scene.add(group);

      const primaryColor = new THREE.Color(0xe12454);
      const geometry = new THREE.SphereGeometry(0.06, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color: primaryColor, transparent: true, opacity: 0.8 });
      
      const nodes: any[] = [];
      for (let i = 0; i < 30; i++) {
        const sphere = new THREE.Mesh(geometry, material);
        const radius = Math.random() * 8 + 2;
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 4;
        
        sphere.position.set(Math.cos(angle) * radius, height, Math.sin(angle) * radius);
        sphere.userData = { baseY: height, speed: Math.random() * 0.002 + 0.001 };
        
        group.add(sphere);
        nodes.push(sphere);
      }

      const lineMaterial = new THREE.LineBasicMaterial({ color: primaryColor, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending });
      const lines: any[] = [];
      
      for(let i = 0; i < nodes.length; i++) {
        for(let j = i + 1; j < nodes.length; j++) {
          if (nodes[i].position.distanceTo(nodes[j].position) < 4) {
            const lineGeo = new THREE.BufferGeometry().setFromPoints([nodes[i].position, nodes[j].position]);
            const line = new THREE.Line(lineGeo, lineMaterial);
            line.userData = { nodeA: nodes[i], nodeB: nodes[j] };
            group.add(line);
            lines.push(line);
          }
        }
      }

      camera.position.z = 10;
      camera.position.y = 2;
      camera.lookAt(0, 0, 0);
      group.position.x = 2;
      
      let time = 0;
      let animationFrameId: number;
      
      const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        time += 0.01;
        
        group.rotation.y = time * 0.1;
        
        nodes.forEach(node => {
          node.position.y = node.userData.baseY + Math.sin(time * node.userData.speed * 1000) * 0.5;
        });
        
        lines.forEach(line => {
          const positions = line.geometry.attributes.position.array;
          positions[0] = line.userData.nodeA.position.x;
          positions[1] = line.userData.nodeA.position.y;
          positions[2] = line.userData.nodeA.position.z;
          positions[3] = line.userData.nodeB.position.x;
          positions[4] = line.userData.nodeB.position.y;
          positions[5] = line.userData.nodeB.position.z;
          line.geometry.attributes.position.needsUpdate = true;
        });

        renderer.render(scene, camera);
      };
      
      animate();

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);
      
      // Setup GSAP Animations
      gsap.fromTo(".hero-text > *", 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out", delay: 0.2 }
      );
      
      gsap.utils.toArray('.section-header').forEach((header: any) => {
        gsap.fromTo(header, 
          { y: 40, opacity: 0 },
          { scrollTrigger: { trigger: header, start: "top 85%" }, y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
        );
      });

      gsap.fromTo(".why-card", 
        { y: 50, opacity: 0 },
        { scrollTrigger: { trigger: ".cards-grid", start: "top 80%" }, y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      );
      gsap.fromTo(".timeline-item", 
        { x: -30, opacity: 0 },
        { scrollTrigger: { trigger: ".journey-timeline", start: "top 80%" }, x: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out" }
      );
      gsap.fromTo(".comparison-col", 
        { y: 30, opacity: 0 },
        { scrollTrigger: { trigger: ".comparison-grid", start: "top 75%" }, y: 0, opacity: 1, duration: 0.8, stagger: 0.3, ease: "power3.out" }
      );

      gsap.fromTo(".stat-number",
        { innerHTML: 0 },
        { 
          scrollTrigger: { trigger: ".trust-banner", start: "top 90%" },
          innerHTML: (i: number, el: Element) => el.getAttribute('data-val'),
          duration: 2,
          snap: { innerHTML: 1 },
          ease: "power2.out",
          stagger: 0.2
        }
      );
      
      gsap.fromTo(".bento-card",
        { y: 50, opacity: 0 },
        { scrollTrigger: { trigger: ".bento-grid", start: "top 80%" }, y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }
      );
      
      gsap.fromTo(".testimonial-card", 
        { x: 50, opacity: 0 },
        { scrollTrigger: { trigger: ".testimonials-container", start: "top 75%" }, x: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
      );

      gsap.fromTo(".faq-item", 
        { y: 30, opacity: 0 },
        { scrollTrigger: { trigger: ".faq-section", start: "top 80%" }, y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
      );

      return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
        renderer.dispose();
      };
    }
  }, []);

  const previewCenter = centers[0];
  const bgImage = cities.find(c => c.name === previewCenter.city)?.image;

  return (
    <div className="w-full relative z-0 bg-white">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} ref={canvasRef}></div>
        <div className="max-w-7xl mx-auto px-6 w-full relative hero-text pointer-events-auto flex flex-col items-center text-center" style={{ zIndex: 10 }}>
          <span className="inline-block tracking-widest uppercase text-sm font-bold text-primary mb-4 bg-primary/10 px-4 py-1.5 rounded-full">Partner with DialysisOnGo</span>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl md:leading-[1.1] font-black text-[#1a1f2e] max-w-4xl mb-6">
            Make your <span className="italic text-[#e12454]">Center</span> easier to discover, <br className="hidden md:block" />
            <span className="font-serif italic font-normal text-slate-600">when patients</span> <span className="font-black text-[#1a1f2e]">travel.</span>
          </h1>
          
          <p className="text-xl text-text-muted max-w-2xl mb-10 leading-relaxed">
            Join the DialysisOnGo network and present your center's services, availability and information to patients looking for dialysis care.
          </p>

          <div className="bg-white/90 backdrop-blur-md p-2 rounded-full border border-border shadow-lg flex items-center w-full max-w-lg mb-10 mx-auto">
            <span className="pl-6 text-xl opacity-50">📍</span>
            <input 
              type="text" 
              placeholder="Where is your center located?" 
              value={centerLocation}
              onChange={(e) => setCenterLocation(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-secondary font-medium w-full"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => setShowFormModal(true)}
              className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-bold shadow-lg hover:shadow-xl inline-block"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              Check Your Eligibility →
            </button>
            <a 
              href="#how-it-works" 
              className="bg-white border-2 border-border hover:border-primary text-secondary px-8 py-4 rounded-full font-bold inline-block"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="trust-banner py-12 border-y border-border bg-surface">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-black text-secondary flex items-center justify-center gap-1">
              <span className="stat-number" data-val="50">0</span>+
            </div>
            <p className="text-text-muted mt-2 font-bold uppercase tracking-wider text-sm">Cities Covered</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-secondary flex items-center justify-center gap-1">
              <span className="stat-number" data-val="150">0</span>+
            </div>
            <p className="text-text-muted mt-2 font-bold uppercase tracking-wider text-sm">Verified Centers</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-secondary flex items-center justify-center gap-1">
              <span className="stat-number" data-val="10000">0</span>+
            </div>
            <p className="text-text-muted mt-2 font-bold uppercase tracking-wider text-sm">Successful Sessions</p>
          </div>
        </div>
      </section>

      {/* Why Partner */}
      <section id="why-partner" className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-header text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-secondary">Your center. Connected to the journey.</h2>
          </div>
          <div className="cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Reach", desc: "Help patients discover your center when planning dialysis away from home." },
              { title: "Visibility", desc: "Present your center information in a structured, easy-to-understand profile." },
              { title: "Coordination", desc: "Make relevant information easier for patients and the network to access." },
              { title: "Network", desc: "Become part of a broader dialysis-care ecosystem." }
            ].map((card, i) => (
              <div key={i} className="why-card bg-white p-8 rounded-2xl shadow-sm border border-border hover:-translate-y-2 hover:shadow-xl transition-all">
                <h3 className="text-xl font-bold text-primary mb-3">{card.title}</h3>
                <p className="text-text-muted leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Care Coordination Section */}
      <section id="care-coordination" className="py-24 bg-[#FFF0F3] text-secondary relative overflow-hidden border-y border-[#FCE7EB]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block tracking-widest uppercase text-sm font-bold text-primary mb-4 bg-primary/10 px-4 py-1.5 rounded-full">Clinical Coordination</span>
              <h2 className="text-4xl md:text-5xl font-black text-secondary mb-6">Seamless Care Handoffs.</h2>
              <p className="text-xl text-text-muted mb-10 leading-relaxed">
                We eliminate the administrative friction of accepting traveling patients. Get complete, verified medical profiles before the patient even walks through your doors.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: "📄", title: "Standardized Virology", desc: "Verified recent reports (HIV, HBsAg, HCV) uploaded and checked before booking." },
                  { icon: "⚕️", title: "Precise Prescriptions", desc: "Dialysate flow, dialyzer type, and dry weight specifications shared directly from the home center." },
                  { icon: "🔒", title: "Secure Data Transfer", desc: "HIPAA-compliant sharing of medical histories, ensuring patient privacy and center liability protection." }
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-4 items-start bg-white p-5 rounded-2xl border border-rose-100 shadow-sm hover:border-primary/30 hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-2xl shrink-0">{feature.icon}</div>
                    <div>
                      <h4 className="text-lg font-bold text-secondary mb-1">{feature.title}</h4>
                      <p className="text-text-muted text-sm leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              {/* Visual representation of data flow */}
              <div className="bg-white text-secondary p-8 rounded-[2.5rem] shadow-xl relative border border-rose-100">
                <div className="absolute -top-4 -right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> Patient Verified
                </div>
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                  <div className="w-16 h-16 bg-rose-50 rounded-full flex-shrink-0 overflow-hidden relative">
                     <div className="absolute inset-0 bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">#</div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-secondary">Patient #4928</h3>
                    <p className="text-text-muted text-sm">Traveling from {centers[1].name}, {centers[1].city}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-muted font-medium">Virology Status</span>
                      <span className="text-green-600 font-bold">Negative (Verified 2 days ago)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-green-500 h-full w-full"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-[#FFF5F7] p-3 rounded-xl border border-rose-100/80">
                      <span className="block text-xs text-text-muted uppercase tracking-wider mb-1">Dry Weight</span>
                      <span className="font-bold text-lg text-secondary">65.5 kg</span>
                    </div>
                    <div className="bg-[#FFF5F7] p-3 rounded-xl border border-rose-100/80">
                      <span className="block text-xs text-text-muted uppercase tracking-wider mb-1">Blood Flow</span>
                      <span className="font-bold text-lg text-secondary">300 ml/min</span>
                    </div>
                    <div className="bg-[#FFF5F7] p-3 rounded-xl border border-rose-100/80 col-span-2">
                      <span className="block text-xs text-text-muted uppercase tracking-wider mb-1">Special Instructions</span>
                      <span className="font-bold text-sm text-secondary">{services[1].name} required. High flux dialyzer.</span>
                    </div>
                  </div>
                  
                  <button className="w-full mt-4 bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition-colors shadow-md hover:shadow-lg">
                    Review Full Prescription
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Network Standards */}
      <section id="network-standards" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block tracking-widest uppercase text-sm font-bold text-primary mb-4 bg-primary/10 px-4 py-1.5 rounded-full">Quality Assurance</span>
            <h2 className="text-3xl md:text-5xl font-black text-secondary">Global standards. Local care.</h2>
            <p className="text-xl text-text-muted mt-4 max-w-2xl mx-auto">By joining the DialysisOnGo network, you align your center with a recognized benchmark of quality that patients trust.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Clinical Protocols", desc: "Standardized protocols for machine disinfection, dialyzer reuse (if applicable), and infection control.", icon: "🏥" },
              { title: "Water Quality Assurance", desc: "Rigorous adherence to AAMI standards for water treatment systems and RO plants.", icon: "💧" },
              { title: "Emergency Preparedness", desc: "Mandatory ICU-backup or rapid response agreements with nearby tertiary hospitals for high-risk patients.", icon: "🚑" },
              { title: "Nephrologist Supervision", desc: "Guaranteed on-call or on-site nephrologist availability during all active sessions.", icon: "👨‍⚕️" },
              { title: "Staff Training", desc: "Continuous medical education and verification of dialysis technician certifications.", icon: "📚" },
              { title: "Patient Feedback Loop", desc: "Automated post-session clinical and experiential feedback to maintain center ratings.", icon: "⭐" }
            ].map((standard, i) => (
              <div key={i} className="bg-surface p-8 rounded-2xl border border-border hover:border-primary/30 transition-colors group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left">{standard.icon}</div>
                <h3 className="text-xl font-bold text-secondary mb-3">{standard.title}</h3>
                <p className="text-text-muted leading-relaxed">{standard.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mock Dashboard */}
      <section className="py-24 bg-surface overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block tracking-widest uppercase text-sm font-bold text-primary mb-4 bg-primary/10 px-4 py-1.5 rounded-full">Seamless Operations</span>
              <h2 className="text-4xl md:text-5xl font-black text-secondary mb-6">Manage bookings without the chaos.</h2>
              <p className="text-xl text-text-muted mb-8 leading-relaxed">Our dedicated center dashboard alerts you instantly when a traveling patient requests a slot. Accept, coordinate, and review records in one click.</p>
              
              <button 
                onClick={handleSimulate}
                disabled={simulating}
                className="bg-secondary hover:bg-black text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-colors disabled:opacity-50"
              >
                {simulating ? (
                  <span className="animate-spin inline-block border-2 border-white/20 border-t-white rounded-full w-5 h-5"></span>
                ) : (
                  <span>👋</span>
                )}
                {simulating ? 'Simulating Booking...' : 'Simulate a Booking'}
              </button>
            </div>
            
            {/* Dashboard UI Mock */}
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/10 to-blue-500/10 rounded-full blur-3xl -z-10"></div>
              
              <div className="bg-white rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col h-[500px]">
                {/* Header */}
                <div className="bg-surface border-b border-border p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xs">D</div>
                    <span className="font-bold text-secondary">DialysisOnGo Partner</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  </div>
                </div>
                
                {/* Sidebar + Content */}
                <div className="flex flex-1 overflow-hidden">
                  <div className="w-48 border-r border-border bg-surface/50 p-4 hidden sm:block">
                    <div className="space-y-2">
                      <div onClick={() => setDashboardTab('bookings')} className={`h-8 cursor-pointer rounded text-xs font-medium flex items-center px-3 gap-2 transition-colors ${dashboardTab === 'bookings' ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-black/5 text-text-muted'}`}>
                        {dashboardTab === 'bookings' && <span className="w-2 h-2 rounded-full bg-primary"></span>} Bookings
                      </div>
                      <div onClick={() => setDashboardTab('patients')} className={`h-8 cursor-pointer rounded text-xs font-medium flex items-center px-3 gap-2 transition-colors ${dashboardTab === 'patients' ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-black/5 text-text-muted'}`}>
                        {dashboardTab === 'patients' && <span className="w-2 h-2 rounded-full bg-primary"></span>} Patients
                      </div>
                      <div onClick={() => setDashboardTab('schedules')} className={`h-8 cursor-pointer rounded text-xs font-medium flex items-center px-3 gap-2 transition-colors ${dashboardTab === 'schedules' ? 'bg-primary/10 text-primary font-bold' : 'hover:bg-black/5 text-text-muted'}`}>
                        {dashboardTab === 'schedules' && <span className="w-2 h-2 rounded-full bg-primary"></span>} Schedules
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 p-6 bg-slate-50 relative overflow-hidden">
                    {dashboardTab === 'bookings' && (
                      <>
                        <h3 className="font-bold text-secondary mb-6 text-lg flex justify-between items-center">
                          Pending Requests 
                          <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">{mockBookings}</span>
                        </h3>
                        
                        <div className="space-y-4">
                          {Array.from({length: mockBookings}).map((_, i) => (
                            <div key={i} className="bg-white p-4 rounded-xl border border-border shadow-sm flex justify-between items-center">
                              <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex flex-shrink-0"></div>
                                <div>
                                  <div className="font-bold text-sm text-secondary">Patient #{1024 + i}</div>
                                  <div className="text-xs text-text-muted">Traveling from {['Delhi', 'Mumbai', 'Rajasthan', 'Delhi'][i%4]}</div>
                                </div>
                              </div>
                              <button 
                                onClick={() => {
                                  if(!acceptedBookings.includes(i)) {
                                    setAcceptedBookings(prev => [...prev, i]);
                                    setShowAcceptedPopup(true);
                                    setTimeout(() => setShowAcceptedPopup(false), 3000);
                                  }
                                }}
                                className={`text-xs font-bold px-3 py-1.5 rounded transition-colors ${
                                  acceptedBookings.includes(i) 
                                    ? 'bg-[#e12454] text-white cursor-default' 
                                    : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                                }`}
                              >
                                {acceptedBookings.includes(i) ? 'Accepted' : 'Accept'}
                              </button>
                            </div>
                          ))}
                        </div>
                        
                        {/* Live Toast */}
                        <div className={`mock-toast absolute bottom-6 right-6 left-6 bg-secondary text-white p-4 rounded-xl shadow-2xl flex items-center justify-between pointer-events-none transition-all duration-300 z-20 ${showAcceptedPopup ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xl">✓</div>
                            <div>
                              <div className="font-bold text-sm">Booking Accepted!</div>
                              <div className="text-xs opacity-70">The patient has been notified.</div>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {dashboardTab === 'patients' && (
                      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="font-bold text-secondary mb-6 text-lg flex justify-between items-center">
                          Active Patients
                        </h3>
                        <div className="space-y-4">
                          {[
                            { id: '#4928', name: 'John Doe', status: 'In Treatment', date: 'Today, 2:00 PM' },
                            { id: '#4929', name: 'Sarah Smith', status: 'Completed', date: 'Yesterday' },
                            { id: '#4930', name: 'Michael Raj', status: 'Upcoming', date: 'Tomorrow, 10:00 AM' }
                          ].map((patient, i) => (
                            <div key={i} className="bg-white p-4 rounded-xl border border-border shadow-sm flex justify-between items-center">
                              <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{patient.name.charAt(0)}</div>
                                <div>
                                  <div className="font-bold text-sm text-secondary">{patient.name} <span className="text-xs font-normal text-text-muted">({patient.id})</span></div>
                                  <div className="text-xs text-text-muted">{patient.date}</div>
                                </div>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                patient.status === 'In Treatment' ? 'bg-blue-100 text-blue-600' : 
                                patient.status === 'Completed' ? 'bg-green-100 text-green-600' : 
                                'bg-yellow-100 text-yellow-600'
                              }`}>
                                {patient.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {dashboardTab === 'schedules' && (
                      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <h3 className="font-bold text-secondary mb-6 text-lg flex justify-between items-center">
                          Upcoming Schedule
                        </h3>
                        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                          <div className="grid grid-cols-3 bg-surface p-3 text-xs font-bold text-text-muted uppercase tracking-wider">
                            <div>Time</div>
                            <div>Patient</div>
                            <div>Machine</div>
                          </div>
                          <div className="divide-y divide-border">
                            {[
                              { time: '08:00 AM', name: 'Patient #4920', machine: 'M-01' },
                              { time: '10:00 AM', name: 'Patient #4930', machine: 'M-04' },
                              { time: '02:00 PM', name: 'John Doe', machine: 'M-02' },
                              { time: '04:30 PM', name: 'Patient #4912', machine: 'M-03' }
                            ].map((slot, i) => (
                              <div key={i} className="grid grid-cols-3 p-4 items-center hover:bg-slate-50 transition-colors">
                                <div className="font-bold text-sm text-secondary">{slot.time}</div>
                                <div className="text-sm font-medium">{slot.name}</div>
                                <div className="text-xs bg-surface px-2 py-1 rounded w-fit border border-border">{slot.machine}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Patient Journey */}
      <section id="journey" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-header mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-secondary">The Patient Journey</h2>
            <p className="text-xl text-text-muted mt-4">From planning to care, seamlessly connected.</p>
          </div>
          <div className="journey-timeline flex flex-col md:flex-row gap-8 relative md:border-t-2 md:border-l-0 border-l-2 border-border md:pt-10 pl-6 md:pl-0">
            {[
              { step: "Step 1", title: "Search destination" },
              { step: "Step 2", title: "Compare & choose" },
              { step: "Step 3", title: "Check info & Book" },
              { step: "Step 4", title: "Relax & get treated" }
            ].map((item, i) => (
              <div key={i} className="timeline-item flex-1 relative">
                <div className="absolute -left-[31px] md:left-0 md:-top-[51px] w-4 h-4 rounded-full bg-primary ring-4 ring-white"></div>
                <span className="text-sm font-bold text-primary uppercase tracking-wider">{item.step}</span>
                <h3 className="text-xl font-bold text-secondary mt-2">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Network */}
      <section id="network" className="py-8 sm:py-10 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black text-secondary tracking-tight leading-tight">Put Your Center on the Travel Map</h2>
              <p className="mt-4 text-text-muted text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed opacity-90">Patients are actively searching for dialysis care in top destinations across India. Be the first center they see.</p>
            </div>
          </div>
        </div>
        <div className="relative mt-8 md:mt-16 w-full">
          {/* Fading Edges */}
          <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
          
          <div className="flex gap-6 whitespace-nowrap py-6 overflow-hidden pl-6 select-none">
            <div className="flex gap-6 animate-marquee w-max hover:animation-play-state-paused">
              {[...cities, ...cities].map((city, i) => (
                <div key={`${city.id}-${i}`} className={`flex-none w-[280px] md:w-[380px] pt-2 transition-transform duration-700 hover:scale-[1.02] cursor-pointer ${i % 2 === 0 ? 'md:-mt-8' : 'md:mt-8'}`}>
                  <div className="relative h-[380px] md:h-[440px] overflow-hidden rounded-[2rem] shadow-xl border border-border group">
                    <Image 
                      src={city.image} 
                      alt={city.name} 
                      fill
                      sizes="(max-width: 768px) 280px, 380px"
                      className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                      draggable="false" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent"></div>
                    <div className="absolute top-6 left-6">
                      <div className="flex items-center justify-center px-4 py-2 bg-black/40 border border-white/10 rounded-xl min-h-[32px] md:bg-black/20 md:backdrop-blur-xl">
                        <span className="text-white text-[9px] font-black uppercase tracking-[0.2em] opacity-80 leading-none">{city.state}</span>
                      </div>
                    </div>
                    <div className="absolute bottom-10 left-8 right-8">
                      <h3 className="text-3xl md:text-4xl font-black text-white mb-6 tracking-tight leading-none">{city.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-header text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-secondary">Everything you need. <br/><span className="text-primary italic">Zero</span> hassle.</h2>
          </div>
          <div className="bento-grid grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]" onMouseMove={handleBentoMouseMove}>
            <div className="bento-card col-span-1 md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-border relative overflow-hidden group hover:border-primary/50 transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors"></div>
              <h3 className="text-2xl font-bold text-secondary mb-3">Dedicated Center Dashboard</h3>
              <p className="text-text-muted max-w-sm">Manage all your incoming travel bookings, patient records, and schedules in one unified interface designed specifically for dialysis centers.</p>
              <div className="absolute bottom-6 right-6 w-32 h-32 bg-surface border border-border rounded-xl shadow-lg transform rotate-12 group-hover:rotate-6 transition-transform"></div>
            </div>
            <div className="bento-card col-span-1 bg-gradient-to-br from-primary to-primary-hover rounded-3xl p-8 shadow-sm text-white relative overflow-hidden group">
              <h3 className="text-2xl font-bold mb-3">0% Setup Fees</h3>
              <p className="opacity-90">Joining the network is completely free. No subscription traps, no hidden costs.</p>
            </div>
            <div className="bento-card col-span-1 bg-white rounded-3xl p-8 shadow-sm border border-border relative group hover:border-primary/50 transition-colors">
              <h3 className="text-xl font-bold text-secondary mb-3">Automated Reminders</h3>
              <p className="text-text-muted text-sm">We handle patient follow-ups and appointment reminders so your front desk doesn't have to.</p>
            </div>
            <div className="bento-card col-span-1 md:col-span-2 bg-secondary rounded-3xl p-8 shadow-sm text-white relative overflow-hidden group">
              <div className="absolute inset-0 bg-white opacity-5"></div>
              <h3 className="text-2xl font-bold mb-3">Global Reach</h3>
              <p className="opacity-80 max-w-sm">Patients from all over the world use DialysisOnGo to plan their medical travel. Put your center on the global map today.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Center Preview */}
      <section id="center-preview" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="section-header text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-secondary">Real Center Profile</h2>
            <p className="text-xl text-text-muted mt-4">What patients see when they find you.</p>
          </div>
          <div className="max-w-2xl mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl border border-border">
            <div className="h-64 bg-surface relative" style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <div className="absolute -bottom-5 right-8 bg-white px-4 py-2 rounded-full font-bold shadow-md flex items-center gap-2">
                <span className="text-yellow-400">★</span> {previewCenter.rating} ({previewCenter.reviews})
              </div>
            </div>
            <div className="p-8 md:p-10">
              <h3 className="text-2xl font-bold text-secondary mb-2 flex items-center gap-3">
                {previewCenter.name}
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">✓ Verified</span>
              </h3>
              <p className="text-text-muted mb-8">📍 {previewCenter.address}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">Services</h4>
                  <div className="flex flex-wrap gap-2">
                    {previewCenter.services.map(s => (
                      <span key={s} className="text-xs bg-surface text-secondary px-3 py-1.5 rounded-md border border-border">
                        {s.replace('svc-', '')}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">Pricing</h4>
                  <div className="text-primary font-black text-2xl">
                    ₹{previewCenter.pricing.amount} <span className="text-sm font-medium text-text-muted">/ session</span>
                  </div>
                </div>
              </div>
              <button className="w-full bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-bold transition-colors">
                View Center Profile →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section id="comparison" className="py-24 bg-[#FFF0F3] text-secondary border-y border-[#FCE7EB] relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="comparison-grid grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
            <div className="comparison-col bg-white/70 backdrop-blur-sm p-8 md:p-10 rounded-3xl border border-rose-100/80 shadow-sm flex flex-col justify-between">
              <div>
                <span className="inline-block uppercase tracking-wider text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full mb-4">Old Workflow</span>
                <h3 className="text-2xl font-bold text-slate-600 mb-8">Traditional coordination</h3>
                <ul className="space-y-4 text-base md:text-lg">
                  {["Search", "Call", "Ask availability", "Ask pricing", "Send details", "Wait"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-500 font-medium">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0">→</span> 
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="comparison-col bg-white p-8 md:p-10 rounded-3xl border-2 border-primary/20 shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <span className="inline-block uppercase tracking-wider text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">DialysisOnGo Network</span>
                <h3 className="text-2xl font-black text-secondary mb-8">Connected experience</h3>
                <ul className="space-y-4 text-base md:text-lg">
                  {["Discover", "Compare", "Check information", "Book / Request", "Coordinate"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-secondary font-bold">
                      <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black shrink-0">✓</span> 
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3D Globe Section */}
      <section className="py-20 md:py-24 bg-[#FFF0F3] text-secondary relative overflow-hidden border-y border-[#FCE7EB]">
        <div className="absolute top-1/2 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
          <div>
            <span className="inline-block tracking-widest uppercase text-sm font-bold text-primary mb-4 bg-primary/10 px-4 py-1.5 rounded-full">Pan-India Reach</span>
            <h2 className="text-4xl md:text-5xl font-black text-secondary mb-6">Patients across India are traveling. Are you ready?</h2>
            <p className="text-xl text-text-muted mb-8 leading-relaxed">Watch as patients from across India plan their medical travel to verified DialysisOnGo centers.</p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="bg-white px-6 py-4 rounded-2xl border border-rose-100 shadow-sm">
                <div className="text-3xl md:text-4xl font-black text-primary">2.4k+</div>
                <div className="text-xs text-text-muted uppercase tracking-widest font-bold mt-1">Monthly Travelers</div>
              </div>
              <div className="bg-white px-6 py-4 rounded-2xl border border-rose-100 shadow-sm">
                <div className="text-3xl md:text-4xl font-black text-primary">28+</div>
                <div className="text-xs text-text-muted uppercase tracking-widest font-bold mt-1">States Covered</div>
              </div>
            </div>
          </div>
          <div className="h-[280px] sm:h-[420px] md:h-[550px] w-full relative flex items-center justify-center lg:justify-end mt-4 lg:mt-0">
            <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl border border-rose-100 bg-white/50 backdrop-blur-sm p-4 flex items-center justify-center">
              <Image 
                src="/india-map.jpg" 
                alt="DialysisOnGo India Map" 
                fill 
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-2" 
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Video Testimonials */}
      <section className="py-24 bg-[#FFF0F3] text-secondary overflow-hidden border-y border-[#FCE7EB] relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="section-header text-center mb-16">
            <span className="inline-block tracking-widest uppercase text-sm font-bold text-primary mb-4 bg-primary/10 px-4 py-1.5 rounded-full">Partner Feedback</span>
            <h2 className="text-3xl md:text-5xl font-black text-secondary mb-4">Don't just take our word for it.</h2>
            <p className="text-xl text-text-muted">Hear from centers that have already transformed their booking flow.</p>
          </div>
          
          <div className="testimonials-container flex gap-4 md:gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              { id: 1, city: "Amritsar Care Hospital", quote: `"DialysisOnGo brought us 20 new patients last month without us spending a dime on marketing."`, img: "https://dialysisongo-public.s3.ap-south-1.amazonaws.com/superadmins/97bd407d-99ea-4511-8617-13d221a90dc0/4610a0ae-ad80-402c-9edd-d66cd9a86937-harry-singh-mTBc_h93o-U-unsplash.jpg" },
              { id: 2, city: "LifeLine Dialysis Clinic", quote: `"The platform seamlessly filled our empty afternoon slots with traveling patients. Our revenue has increased by 15%."`, img: "https://dialysisongo-public.s3.ap-south-1.amazonaws.com/superadmins/97bd407d-99ea-4511-8617-13d221a90dc0/f217dc7f-124d-4e8a-a020-40f04ca16c6c-mahadev-ittina-0FXjIXhHSkA-unsplash.jpg" },
              { id: 3, city: "Gurugram Kidney Center", quote: `"Escrow payments and strict cancellation policies mean we never lose out on no-shows. It's a game changer for us."`, img: "https://dialysisongo-public.s3.ap-south-1.amazonaws.com/superadmins/97bd407d-99ea-4511-8617-13d221a90dc0/b2b53434-32a4-4ce6-9eb6-d464be673d49-Gurgaon.jpg" },
              { id: 4, city: "Apex Healthcare Katra", quote: `"Since boarding with DialysisOnGo, managing out-of-town patients has become effortless. Highly recommended!"`, img: "https://dialysisongo-public.s3.ap-south-1.amazonaws.com/superadmins/97bd407d-99ea-4511-8617-13d221a90dc0/c5b4c798-659f-448e-8f3e-2efbf6c01928-dishant-thapa-K0s4LcHtOPQ-unsplash.jpg" }
            ].map((item) => (
              <div key={item.id} className="testimonial-card flex-none w-[280px] sm:w-[300px] h-[350px] sm:h-[400px] relative rounded-3xl overflow-hidden group cursor-pointer snap-center border border-rose-100 shadow-lg hover:w-[320px] sm:hover:w-[400px] hover:shadow-2xl transition-all duration-700 ease-out">
                <div className="absolute inset-0 bg-slate-900">
                  <Image src={item.img} alt={item.city} fill sizes="(max-width: 768px) 300px, 400px" className="object-cover opacity-60 group-hover:opacity-75 transition-opacity duration-700" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-primary text-xs font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md mb-2 inline-block">Verified Partner</span>
                  <h3 className="font-bold text-xl mb-2 text-white">{item.city}</h3>
                  <p className="text-sm text-slate-200 line-clamp-3 group-hover:line-clamp-none transition-all leading-relaxed">{item.quote}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section py-20 md:py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-secondary">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {[
              { q: "How much does it cost to join?", a: "Joining the DialysisOnGo network is completely free for centers. There are no setup fees and no monthly subscriptions. We only charge a small coordination fee to the patient." },
              { q: "How do I get paid?", a: "Patients pay for their sessions directly at your center exactly as they normally would, or through our secure escrow platform depending on their booking preference." },
              { q: "Do I need to change my current software?", a: "No! DialysisOnGo runs alongside your existing HIS/EMR. You will receive booking requests via email and our standalone dashboard." },
              { q: "What if a patient cancels?", a: "We enforce a strict cancellation policy to protect our partner centers. If a patient no-shows without 24 hours notice, you are compensated for the blocked slot." }
            ].map((faq, i) => (
              <div key={i} className={`faq-item border border-border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === i ? 'ring-2 ring-primary/20 shadow-lg bg-white' : 'hover:border-primary/50 bg-white/50'}`}>
                <button 
                  className="w-full text-left p-6 flex justify-between items-center bg-white"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-bold text-secondary">{faq.q}</span>
                  <span className={`text-primary transition-transform duration-300 font-bold ${openFaq === i ? 'rotate-180' : ''}`}>▼</span>
                </button>
                <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-text-muted">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-24 text-center">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-black text-secondary mb-10">Ready to join the network?</h2>
          <button 
            onClick={() => setShowFormModal(true)}
            className="inline-block bg-primary hover:bg-primary-hover text-white px-10 py-5 rounded-full font-bold text-lg shadow-lg hover:shadow-xl"
            onMouseMove={handleMagneticMove}
            onMouseLeave={handleMagneticLeave}
          >
            Check Your Eligibility →
          </button>
        </div>
      </section>

      {/* Cinematic Full-Screen Form */}
      {showFormModal && <EligibilityForm onClose={() => setShowFormModal(false)} />}
    </div>
  );
}
