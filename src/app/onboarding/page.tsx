"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    centerName: "",
    city: "",
    address: "",
    contactPerson: "",
    phone: "",
    stations: "",
    services: [] as string[],
    pricing: "",
  });

  const totalSteps = 7;
  const progress = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox" && name === "services") {
      setFormData(prev => ({
        ...prev,
        services: checked 
          ? [...prev.services, value]
          : prev.services.filter(s => s !== value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleNext = () => currentStep < totalSteps && setCurrentStep(s => s + 1);
  const handlePrev = () => currentStep > 1 && setCurrentStep(s => s - 1);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/success");
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1: return (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-secondary mb-2">01. Center Details</h2>
            <p className="text-text-muted mb-8">Enter your primary center information.</p>
          </div>
          <div>
            <label className="block font-bold text-secondary mb-2">Center Name</label>
            <input name="centerName" value={formData.centerName} onChange={handleInputChange} className="w-full p-4 border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" placeholder="e.g. Apollo Dialysis Center" />
          </div>
          <div>
            <label className="block font-bold text-secondary mb-2">City</label>
            <input name="city" value={formData.city} onChange={handleInputChange} className="w-full p-4 border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" placeholder="e.g. Bangalore" />
          </div>
          <div>
            <label className="block font-bold text-secondary mb-2">Full Address</label>
            <input name="address" value={formData.address} onChange={handleInputChange} className="w-full p-4 border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" placeholder="e.g. 123 Health Ave, Bangalore" />
          </div>
        </div>
      );
      case 2: return (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-secondary mb-2">02. Contact Information</h2>
            <p className="text-text-muted mb-8">How can patients and the network reach you?</p>
          </div>
          <div>
            <label className="block font-bold text-secondary mb-2">Contact Person</label>
            <input name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} className="w-full p-4 border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" placeholder="Full Name" />
          </div>
          <div>
            <label className="block font-bold text-secondary mb-2">Phone</label>
            <input name="phone" type="tel" value={formData.phone} onChange={handleInputChange} className="w-full p-4 border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" placeholder="+91" />
          </div>
        </div>
      );
      case 3: return (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-secondary mb-2">03. Facility Specs</h2>
            <p className="text-text-muted mb-8">Scale of your operations.</p>
          </div>
          <div>
            <label className="block font-bold text-secondary mb-2">Dialysis Stations</label>
            <input name="stations" type="number" value={formData.stations} onChange={handleInputChange} className="w-full p-4 border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" placeholder="e.g. 10" />
          </div>
        </div>
      );
      case 4: return (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-secondary mb-2">04. Services</h2>
            <p className="text-text-muted mb-8">Select all services you provide.</p>
          </div>
          <div className="space-y-4">
            {["Hemodialysis", "HDF", "Isolation Dialysis", "Travel Support"].map(s => (
              <label key={s} className="flex items-center gap-3 p-4 border border-border rounded-xl cursor-pointer hover:border-primary transition-colors">
                <input type="checkbox" name="services" value={s} checked={formData.services.includes(s)} onChange={handleInputChange} className="w-5 h-5 accent-primary" />
                <span className="font-medium">{s}</span>
              </label>
            ))}
          </div>
        </div>
      );
      case 5: return (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-secondary mb-2">05. Pricing</h2>
            <p className="text-text-muted mb-8">Your standard per-session rate.</p>
          </div>
          <div>
            <label className="block font-bold text-secondary mb-2">Pricing per session (₹)</label>
            <input name="pricing" type="number" value={formData.pricing} onChange={handleInputChange} className="w-full p-4 border border-border rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" placeholder="e.g. 2500" />
          </div>
        </div>
      );
      case 6: return (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-secondary mb-2">06. Documents</h2>
            <p className="text-text-muted mb-8">Upload necessary accreditations.</p>
          </div>
          <div className="border-2 border-dashed border-border p-12 text-center rounded-xl bg-surface/50">
            <span className="text-text-muted font-medium">Click or drag files to upload</span>
          </div>
        </div>
      );
      case 7: return (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-black text-secondary mb-2">07. Review & Submit</h2>
            <p className="text-text-muted mb-8">Check your profile preview on the right before submitting.</p>
          </div>
          <label className="flex items-start gap-3 p-4 border border-border rounded-xl cursor-pointer">
            <input type="checkbox" required className="w-5 h-5 mt-0.5 accent-primary" />
            <span className="font-medium text-sm leading-relaxed">I confirm that the information provided is accurate and I am authorized to represent this center.</span>
          </label>
        </div>
      );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)]">
      {/* Form Section */}
      <div className="p-8 md:p-16 max-w-2xl mx-auto w-full">
        
        <div className="mb-12">
          <div className="flex justify-between text-sm font-bold text-secondary mb-3">
            <span>Profile Readiness</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-border rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-1">
            {renderStepContent()}
          </div>
          
          <div className="flex justify-between mt-12 pt-8 border-t border-border">
            <button type="button" onClick={handlePrev} disabled={currentStep === 1} className="px-6 py-3 font-bold text-text-muted hover:text-secondary disabled:opacity-30 transition-colors">
              ← Previous
            </button>
            {currentStep < totalSteps ? (
              <button type="button" onClick={handleNext} className="bg-secondary hover:bg-black text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md">
                Next →
              </button>
            ) : (
              <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Submit Application
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Live Preview Section */}
      <div className="hidden lg:block bg-surface border-l border-border p-16 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto">
        <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-8">Live Preview</h3>
        
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-border w-full max-w-lg mx-auto">
          <div className="h-48 bg-gray-200 relative">
            <div className="absolute -bottom-5 right-8 bg-white px-4 py-2 rounded-full font-bold shadow-md flex items-center gap-2 text-sm">
              <span className="text-yellow-400">★</span> New
            </div>
          </div>
          <div className="p-8">
            <h3 className="text-xl font-bold text-secondary mb-2 flex items-center gap-2">
              {formData.centerName || "Your Center Name"}
            </h3>
            <p className="text-text-muted mb-8 text-sm">📍 {formData.address || "Your Address"}, {formData.city || "City"}</p>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">Services</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.services.length > 0 ? formData.services.map(s => (
                    <span key={s} className="text-xs bg-surface text-secondary px-3 py-1.5 rounded-md border border-border">
                      {s}
                    </span>
                  )) : (
                    <span className="text-xs text-text-muted italic">None selected</span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-text-muted mb-3">Pricing</h4>
                <div className="text-primary font-black text-2xl">
                  {formData.pricing ? (
                    <>₹{formData.pricing} <span className="text-sm font-medium text-text-muted">/ session</span></>
                  ) : (
                    <span className="text-lg">Not currently listed</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
