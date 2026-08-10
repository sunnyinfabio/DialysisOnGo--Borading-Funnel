import { useState } from 'react';

interface CenterOnboardingFormProps {
  onClose: () => void;
}

export default function CenterOnboardingForm({ onClose }: CenterOnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    centerName: '',
    city: '',
    address: '',
    fullName: '',
    email: '',
    phone: '',
    state: ''
  });
  
  const [consentChecked, setConsentChecked] = useState(false);

  const calculateReadiness = () => {
    let filled = 0;
    if (formData.centerName) filled++;
    if (formData.city) filled++;
    if (formData.address) filled++;
    if (formData.fullName) filled++;
    if (formData.email) filled++;
    if (formData.phone) filled++;
    return Math.round((filled / 6) * 100);
  };

  const readiness = calculateReadiness();

  const handleNext = () => setStep(step + 1);
  const handlePrev = () => setStep(step - 1);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex overflow-hidden">
      {/* Left Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col h-full bg-white relative">
        <div className="p-8 flex justify-between items-center border-b border-slate-100">
          <div className="text-xl font-black text-[#1a2332] tracking-tight">Dialysis<span className="text-primary">OnGo</span></div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-800 text-2xl transition-colors">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 md:p-16">
          <div className="max-w-md mx-auto w-full">
            <div className="flex justify-between text-sm font-bold text-[#1a2332] mb-2">
              <span>Profile Readiness</span>
              <span>{readiness}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full mb-12 overflow-hidden">
              <div className="h-full bg-slate-200 transition-all duration-500 relative">
                <div className="absolute top-0 left-0 h-full bg-[#1e293b] transition-all duration-500" style={{ width: `${readiness}%` }}></div>
              </div>
            </div>

            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <h2 className="text-3xl font-black text-[#1a2332] mb-2">01. Center Details</h2>
                <p className="text-slate-500 mb-10">Enter your primary center information.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-[#1a2332] mb-2">Center Name</label>
                    <input 
                      type="text" 
                      value={formData.centerName}
                      onChange={e => setFormData({...formData, centerName: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-slate-800 placeholder:text-slate-400"
                      placeholder="e.g. City Hospital Dialysis Unit"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1a2332] mb-2">City</label>
                    <input 
                      type="text" 
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-slate-800 placeholder:text-slate-400"
                      placeholder="e.g. Bangalore"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1a2332] mb-2">Full Address</label>
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-slate-800 placeholder:text-slate-400"
                      placeholder="e.g. 123 Health Ave, Bangalore"
                    />
                  </div>
                </div>

                <div className="mt-10 flex justify-end">
                  <button 
                    onClick={handleNext} 
                    disabled={!formData.centerName || !formData.city || !formData.address}
                    className="bg-[#1a2332] text-white px-8 py-3 rounded-lg font-bold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                <h2 className="text-3xl font-black text-[#1a2332] mb-2">02. Contact Info</h2>
                <p className="text-slate-500 mb-10">Who should we contact for booking requests?</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-[#1a2332] mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-slate-800 placeholder:text-slate-400"
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1a2332] mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-slate-800 placeholder:text-slate-400"
                      placeholder="e.g. hello@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-[#1a2332] mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-slate-800 placeholder:text-slate-400"
                      placeholder="+91"
                    />
                  </div>
                  
                  <div className="flex items-start gap-3 mt-6 pt-6 border-t border-slate-100">
                    <input 
                      type="checkbox" 
                      id="consent"
                      checked={consentChecked}
                      onChange={e => setConsentChecked(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="consent" className="text-sm font-medium text-slate-600">
                      I verify these details are correct and consent to joining the DialysisOnGo network.
                    </label>
                  </div>
                </div>

                <div className="mt-10 flex justify-between">
                  <button 
                    onClick={handlePrev} 
                    className="text-[#1a2332] px-6 py-3 rounded-lg font-bold hover:bg-slate-50 transition-colors border border-slate-200"
                  >
                    Back
                  </button>
                  <button 
                    onClick={() => setStep(3)} 
                    disabled={
                      !/^[a-zA-Z\s]+$/.test(formData.fullName.trim()) || 
                      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) || 
                      !/^\+?[\d\s-]{10,}$/.test(formData.phone.trim()) || 
                      !consentChecked
                    }
                    className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-[#c81e4a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Submit Details
                  </button>
                </div>
              </div>
            )}
            
            {step === 3 && (
               <div className="animate-in fade-in zoom-in-95 duration-500 text-center py-20">
                 <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
                 <h2 className="text-3xl font-black text-[#1a2332] mb-4">Application Received!</h2>
                 <p className="text-slate-600 mb-8 leading-relaxed">Thank you for applying to the DialysisOnGo network. Our team will verify your details and reach out shortly.</p>
                 <button onClick={onClose} className="bg-[#1a2332] text-white px-8 py-3 rounded-lg font-bold hover:bg-black transition-colors">Return to Home</button>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Preview Area */}
      <div className="hidden lg:flex w-1/2 bg-[#f8f9fc] flex-col p-8 md:p-16 relative">
        <div className="absolute top-8 left-8 text-sm font-bold tracking-widest uppercase text-slate-400">Live Preview</div>
        
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md bg-white rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-500 hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.15)] transform hover:-translate-y-2 relative group border border-slate-100">
            {/* Mock Image Placeholder */}
            <div className="h-48 bg-slate-200 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-tr from-slate-200 to-slate-300"></div>
            </div>
            
            {/* New Badge */}
            <div className="absolute top-44 right-6 bg-white shadow-md rounded-full px-4 py-1.5 flex items-center gap-1.5 text-sm font-bold text-[#1a2332] z-10 border border-slate-100">
              <span className="text-yellow-400 text-lg leading-none">★</span> New
            </div>
            
            <div className="p-8 pt-10">
              <h3 className="text-2xl font-black text-[#1a2332] mb-2 truncate">
                {formData.centerName || 'Your Center Name'}
              </h3>
              
              <div className="flex items-start gap-2 text-slate-500 mb-8">
                <span className="text-primary mt-1 text-lg leading-none">📍</span>
                <span className="text-sm leading-relaxed truncate">
                  {formData.address ? `${formData.address}${formData.city ? `, ${formData.city}` : ''}` : 'Your Address, City'}
                </span>
              </div>
              
              <div className="space-y-6">
                <div>
                  <div className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">SERVICES</div>
                  <div className="text-sm text-slate-500 italic font-medium">None selected</div>
                </div>
                
                <div>
                  <div className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-2">PRICING</div>
                  <div className="text-primary font-bold">Not currently listed</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
