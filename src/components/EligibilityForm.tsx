"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { cities } from "@/lib/data";
import { useRouter } from "next/navigation";

interface EligibilityFormProps {
  onClose?: () => void;
}

export default function EligibilityForm({ onClose }: EligibilityFormProps) {
  const router = useRouter();
  const [formStep, setFormStep] = useState(0);
  const [locationError, setLocationError] = useState(false);

  const activeStates = Array.from(new Set(cities.map(c => c.state)));
  const totalSteps = 5;
  const [selectedState, setSelectedState] = useState("");
  const [formData, setFormData] = useState({ name: '', center: '', email: '', phone: '' });
  const [consentChecked, setConsentChecked] = useState(false);

  const validateStep = (step: number) => {
    switch(step) {
      case 0: return /^[a-zA-Z\s]+$/.test(formData.name.trim()) && formData.name.trim().length >= 2;
      case 1: return formData.center.trim().length > 0;
      case 2: return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
      case 3: return /^\+?[\d\s-]{10,}$/.test(formData.phone.trim());
      case 4: return selectedState !== "" && selectedState !== "other" && consentChecked;
      default: return false;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) onClose();
      
      // Text Input Steps: 0 to 3
      if ([0, 1, 2, 3].includes(formStep) && e.key === 'Enter') {
        if (validateStep(formStep)) {
          handleNextStep();
        } else {
          // shake animation on invalid
          gsap.fromTo('.cinematic-input', { x: -10 }, { x: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)' });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formStep, onClose, formData, selectedState, consentChecked]);

  const triggerLocationError = () => {
    setLocationError(true);
    setTimeout(() => setLocationError(false), 4000);
  };

  const handleNextStep = () => {
    if (formStep === 4) {
      if (!selectedState) return;
      if (selectedState === 'other') {
        triggerLocationError();
        return;
      }
    }

    setLocationError(false);
    gsap.to('.form-step-container', { 
      z: -100, 
      opacity: 0, 
      duration: 0.4, 
      ease: 'power2.in',
      onComplete: () => {
        setFormStep(s => s + 1);
        gsap.fromTo('.form-step-container', 
          { z: 100, opacity: 0 }, 
          { z: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }
        );
      }
    });
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden" style={{ perspective: '1000px' }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900 animate-in fade-in duration-700" onClick={handleClose}></div>
      
      {/* Header & Progress */}
      <div className="absolute top-0 left-0 w-full p-8 flex justify-between items-center z-20 animate-in fade-in slide-in-from-top-10 duration-700">
        <div className="text-2xl font-black text-white tracking-tight">Dialysis<span className="text-primary">OnGo</span></div>
        <div className="flex items-center gap-6">
          {/* Circular SVG Progress */}
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e12454" strokeWidth="6" strokeDasharray="283" strokeDashoffset={283 - (283 * (formStep / totalSteps))} className="transition-all duration-700 ease-out" />
            </svg>
            <span className="absolute text-white font-bold text-sm">{formStep}/{totalSteps}</span>
          </div>
          <button className="text-white/50 hover:text-white font-bold text-xl transition-colors" onClick={handleClose}>✕</button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="w-full max-w-4xl relative z-10 p-10 md:p-16 bg-gradient-to-b from-rose-100 via-rose-50 to-white rounded-3xl border border-rose-200 shadow-2xl form-step-container">
        {formStep === 0 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="flex items-center justify-center w-8 h-8 rounded bg-primary/20 text-primary font-bold text-sm">1</span>
              <span className="text-secondary/50 font-bold uppercase tracking-widest text-sm">Contact</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-secondary mb-12 leading-tight">What is your <span className="text-primary italic">full name?</span></h2>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Rahul Sharma" 
              className="cinematic-input w-full text-3xl md:text-5xl border-b-2 border-secondary/20 focus:border-primary outline-none py-4 bg-transparent font-medium text-secondary transition-colors placeholder:text-secondary/30" 
              autoFocus 
            />
            <div className="mt-12 flex items-center gap-6">
              <button onClick={() => validateStep(0) && handleNextStep()} disabled={!validateStep(0)} className={`px-8 py-4 rounded-full font-bold text-lg transition-all ${validateStep(0) ? 'bg-primary text-white hover:scale-105' : 'bg-secondary/10 text-secondary/30 cursor-not-allowed'}`}>Next →</button>
              <div className="flex items-center gap-2 text-secondary/50 text-sm"><span>or press</span><span className="px-2 py-1 rounded bg-secondary/10 font-bold">Enter ↵</span></div>
            </div>
          </div>
        )}
        
        {formStep === 1 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="flex items-center justify-center w-8 h-8 rounded bg-primary/20 text-primary font-bold text-sm">2</span>
              <span className="text-secondary/50 font-bold uppercase tracking-widest text-sm">Center</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-secondary mb-12 leading-tight">What is the <span className="text-primary italic">name</span> of your center?</h2>
            <input 
              type="text" 
              value={formData.center}
              onChange={(e) => setFormData({...formData, center: e.target.value})}
              placeholder="e.g. City Hospital Dialysis Unit" 
              className="cinematic-input w-full text-3xl md:text-5xl border-b-2 border-secondary/20 focus:border-primary outline-none py-4 bg-transparent font-medium text-secondary transition-colors placeholder:text-secondary/30" 
              autoFocus 
            />
            <div className="mt-12 flex items-center gap-6">
              <button onClick={() => validateStep(1) && handleNextStep()} disabled={!validateStep(1)} className={`px-8 py-4 rounded-full font-bold text-lg transition-all ${validateStep(1) ? 'bg-primary text-white hover:scale-105' : 'bg-secondary/10 text-secondary/30 cursor-not-allowed'}`}>Next →</button>
              <div className="flex items-center gap-2 text-secondary/50 text-sm"><span>or press</span><span className="px-2 py-1 rounded bg-secondary/10 font-bold">Enter ↵</span></div>
            </div>
          </div>
        )}

        {formStep === 2 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="flex items-center justify-center w-8 h-8 rounded bg-primary/20 text-primary font-bold text-sm">3</span>
              <span className="text-secondary/50 font-bold uppercase tracking-widest text-sm">Email</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-secondary mb-12 leading-tight">What is your <span className="text-primary italic">email address?</span></h2>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="hello@example.com" 
              className="cinematic-input w-full text-3xl md:text-5xl border-b-2 border-secondary/20 focus:border-primary outline-none py-4 bg-transparent font-medium text-secondary transition-colors placeholder:text-secondary/30" 
              autoFocus 
            />
            <div className="mt-12 flex items-center gap-6">
              <button onClick={() => validateStep(2) && handleNextStep()} disabled={!validateStep(2)} className={`px-8 py-4 rounded-full font-bold text-lg transition-all ${validateStep(2) ? 'bg-primary text-white hover:scale-105' : 'bg-secondary/10 text-secondary/30 cursor-not-allowed'}`}>Next →</button>
              <div className="flex items-center gap-2 text-secondary/50 text-sm"><span>or press</span><span className="px-2 py-1 rounded bg-secondary/10 font-bold">Enter ↵</span></div>
            </div>
          </div>
        )}

        {formStep === 3 && (
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="flex items-center justify-center w-8 h-8 rounded bg-primary/20 text-primary font-bold text-sm">4</span>
              <span className="text-secondary/50 font-bold uppercase tracking-widest text-sm">Phone</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-secondary mb-12 leading-tight">What is your <span className="text-primary italic">phone number?</span></h2>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="+91" 
              className="cinematic-input w-full text-3xl md:text-5xl border-b-2 border-secondary/20 focus:border-primary outline-none py-4 bg-transparent font-medium text-secondary transition-colors placeholder:text-secondary/30" 
              autoFocus 
            />
            <div className="mt-12 flex items-center gap-6">
              <button onClick={() => validateStep(3) && handleNextStep()} disabled={!validateStep(3)} className={`px-8 py-4 rounded-full font-bold text-lg transition-all ${validateStep(3) ? 'bg-primary text-white hover:scale-105' : 'bg-secondary/10 text-secondary/30 cursor-not-allowed'}`}>Next →</button>
              <div className="flex items-center gap-2 text-secondary/50 text-sm"><span>or press</span><span className="px-2 py-1 rounded bg-secondary/10 font-bold">Enter ↵</span></div>
            </div>
          </div>
        )}
        
        {formStep === 4 && (
          <div className="relative">
            <div className="flex items-center gap-4 mb-8">
              <span className="flex items-center justify-center w-8 h-8 rounded bg-primary/20 text-primary font-bold text-sm">5</span>
              <span className="text-secondary/50 font-bold uppercase tracking-widest text-sm">Location</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-secondary mb-12 leading-tight">Where are you <span className="text-primary italic">located?</span></h2>
            
            <div className="max-w-2xl relative">
              <select 
                value={selectedState} 
                onChange={(e) => { setSelectedState(e.target.value); setLocationError(false); }}
                className="w-full text-2xl md:text-4xl border-b-2 border-secondary/20 focus:border-primary outline-none py-4 bg-transparent font-medium text-secondary transition-colors appearance-none cursor-pointer"
              >
                <option value="" disabled className="bg-white">Select your state...</option>
                {activeStates.map(state => (
                  <option key={state} value={state} className="bg-white text-secondary text-lg py-2">{state}</option>
                ))}
                <option value="other" className="bg-white text-secondary/50 text-lg py-2">Other / Not Listed</option>
              </select>
              
              {/* Custom Arrow for Select */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-secondary/50 text-2xl">▼</div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${consentChecked ? 'bg-primary border-primary' : 'border-secondary/30 group-hover:border-secondary/50'}`}>
                  {consentChecked && <span className="text-white text-sm font-bold">✓</span>}
                </div>
                <input type="checkbox" className="hidden" checked={consentChecked} onChange={(e) => setConsentChecked(e.target.checked)} />
                <span className="text-secondary/70 text-lg group-hover:text-secondary transition-colors">I verify these details and consent to joining the network.</span>
              </label>
            </div>

            <div className="mt-12">
              <button 
                onClick={handleNextStep}
                disabled={!validateStep(4)}
                className={`px-10 py-5 rounded-full font-bold text-xl transition-all shadow-lg ${!validateStep(4) ? 'bg-secondary/10 text-secondary/30 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-hover hover:scale-105'}`}
              >
                Submit Details →
              </button>
            </div>

            {/* Error Popup */}
            {locationError && (
              <div className="absolute top-full left-0 mt-8 bg-red-500/10 border border-red-500/30 text-red-400 p-6 rounded-2xl animate-in slide-in-from-bottom-5 fade-in duration-300 w-full shadow-[0_0_40px_rgba(239,68,68,0.15)] z-50">
                <h4 className="font-bold text-xl mb-2 flex items-center gap-2">
                  <span>🚧</span> Expanding Soon!
                </h4>
                <p className="text-red-300/80 leading-relaxed">
                  We currently don't operate in your region. DialysisOnGo is aggressively expanding across India. Please leave your details with us and we'll notify you!
                </p>
              </div>
            )}
          </div>
        )}
        
        {formStep === 5 && (
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-10">
              <svg className="w-full h-full text-green-400" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="rgba(74, 222, 128, 0.1)" />
                <path d="M 30 50 L 45 65 L 70 35" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="animate-[draw_0.5s_ease-out_forwards]" strokeDasharray="100" strokeDashoffset="100" />
              </svg>
              <style>{`@keyframes draw { to { stroke-dashoffset: 0; } }`}</style>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-secondary mb-6">You're Eligible!</h2>
            <p className="text-2xl text-secondary/60 mb-12 max-w-2xl mx-auto leading-relaxed">Based on your answers, your center is a perfect fit for the DialysisOnGo network.</p>
            <button onClick={handleClose} className="bg-primary hover:bg-primary-hover text-white font-bold text-xl px-12 py-6 rounded-full transition-all hover:scale-105 shadow-[0_0_40px_rgba(225,36,84,0.4)]">
              Complete Profile Dashboard →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
