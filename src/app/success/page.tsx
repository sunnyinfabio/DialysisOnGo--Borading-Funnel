import Link from "next/link";

export default function Success() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[calc(100vh-80px)]">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-black text-secondary mb-4">Application received</h1>
        <p className="text-text-muted text-lg mb-10">Your center information has been successfully submitted for review.</p>
        
        <div className="bg-surface border border-dashed border-border rounded-2xl p-8 mb-10">
          <span className="text-sm font-bold uppercase tracking-widest text-text-muted block mb-2">Application Reference</span>
          <div className="text-3xl font-black text-secondary tracking-widest">DO-928475</div>
        </div>

        <Link href="/" className="inline-block border-2 border-border hover:border-primary text-secondary px-8 py-4 rounded-full font-bold transition-all">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
