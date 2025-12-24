import { useState, useEffect, useRef } from 'react';

export default function CommercialProductionTemplate() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const main = canvasRef.current;
    if (!main) return;

    const handleMouseDown = (e) => {
      if (
        e.target.closest('.draggable') ||
        e.target.closest('button') ||
        e.target.closest('input') ||
        e.target.closest('textarea') ||
        e.target.closest('select')
      ) {
        return;
      }

      setIsDragging(true);
      main.classList.add('cursor-grabbing');
      main.classList.remove('cursor-default');
      setStartPos({
        x: e.pageX - main.offsetLeft,
        y: e.pageY - main.offsetTop,
      });
      setScrollPos({
        x: main.scrollLeft,
        y: main.scrollTop,
      });
    };

    const handleMouseLeave = () => {
      setIsDragging(false);
      main.classList.remove('cursor-grabbing');
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      main.classList.remove('cursor-grabbing');
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - main.offsetLeft;
      const y = e.pageY - main.offsetTop;
      const walkX = (x - startPos.x) * 1;
      const walkY = (y - startPos.y) * 1;
      main.scrollLeft = scrollPos.x - walkX;
      main.scrollTop = scrollPos.y - walkY;
    };

    main.addEventListener('mousedown', handleMouseDown);
    main.addEventListener('mouseleave', handleMouseLeave);
    main.addEventListener('mouseup', handleMouseUp);
    main.addEventListener('mousemove', handleMouseMove);

    return () => {
      main.removeEventListener('mousedown', handleMouseDown);
      main.removeEventListener('mouseleave', handleMouseLeave);
      main.removeEventListener('mouseup', handleMouseUp);
      main.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isDragging, startPos, scrollPos]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F5F5F4] text-[#1F2937] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-14 bg-white border-b border-[#E5E5E5] flex items-center justify-between px-4 z-40 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#6B46C1]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="text-[#6B46C1]">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.2 6 3 11l-.9-2.4c-.5-1.1.2-2.4 1.3-2.9C5.3 5.1 8 4 8 4M4 11l16 9c.5 1.1-.2 2.4-1.3 2.9-.6.3-4.3 1.2-4.3 1.2"></path>
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 10.6L18 2l2 4.6l-16 8.6"></path>
            </svg>
            <span className="font-serif font-bold text-lg tracking-tight text-gray-900">Flow Pro</span>
          </div>
          <div className="h-4 w-px bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Campaigns /</span>
            <span className="text-sm font-semibold text-gray-900">Nexus SmartHome Launch</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[#6B46C1] text-[10px] font-bold tracking-wide uppercase border border-purple-100">
              Commercial TVC
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">
              JD
            </div>
            <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-xs font-bold text-purple-600">
              MK
            </div>
          </div>
          <button className="px-3 py-1.5 bg-[#6B46C1] text-white text-sm font-medium rounded-md hover:bg-[#553C9A] transition-colors shadow-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m22 2-7 20-4-9-9-4 20-7z"></path>
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 2 11 13"></path>
            </svg>
            Send for Approval
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="absolute left-4 top-20 flex flex-col gap-2 bg-white p-1.5 rounded-lg shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-[#E5E5E5] z-30">
        <button className="p-2 hover:bg-gray-50 rounded-md text-[#6B46C1] transition-colors" title="Select">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m12 6l-6 13.5l3.5-1.5l2.5 5l2.5-5l3.5 1.5Z"></path>
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-50 rounded-md text-gray-500 transition-colors" title="Brief">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></polyline>
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-50 rounded-md text-gray-500 transition-colors" title="Storyboard">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <rect width="18" height="18" x="3" y="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" rx="2" ry="2"></rect>
            <circle cx="9" cy="9" r="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></circle>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-50 rounded-md text-gray-500 transition-colors" title="Comment">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </button>
      </div>

      {/* Main Canvas Area */}
      <main
        ref={canvasRef}
        className="flex-1 overflow-auto relative bg-[#F5F5F4]"
        style={{
          backgroundImage: 'linear-gradient(#E5E5E5 1px, transparent 1px), linear-gradient(90deg, #E5E5E5 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      >
        {/* Infinite Canvas Container */}
        <div className="relative w-[3800px] h-[1600px] p-10 transform origin-top-left">
          {/* SVG Connections Layer */}
          <svg className="absolute inset-0 pointer-events-none z-0 opacity-20" width="100%" height="100%">
            <path d="M500 200 C 600 200, 600 200, 700 200" stroke="#6B46C1" strokeWidth="2" fill="none" strokeDasharray="4,4"></path>
            <path d="M1150 200 C 1250 200, 1250 200, 1350 200" stroke="#6B46C1" strokeWidth="2" fill="none" strokeDasharray="4,4"></path>
            <path d="M1800 200 C 1900 200, 1900 200, 2000 200" stroke="#6B46C1" strokeWidth="2" fill="none" strokeDasharray="4,4"></path>
            <path d="M2450 200 C 2550 200, 2550 200, 2650 200" stroke="#6B46C1" strokeWidth="2" fill="none" strokeDasharray="4,4"></path>
          </svg>

          {/* SECTION 1: CLIENT & BRIEF */}
          <div className="absolute top-10 left-10 w-[480px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg text-[#6B46C1]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                  <circle cx="12" cy="12" r="6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                  <circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Client & Brief</h2>
            </div>

            {/* Client Info */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable group hover:border-[#6B46C1]/30 transition-colors">
              <div className="mb-4 pb-3 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Client</label>
                    <div className="text-lg font-bold text-gray-900">Nexus Tech</div>
                  </div>
                  <div className="text-right">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Budget</label>
                    <div className="text-lg font-mono font-bold text-green-600">$85,000</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-[10px] font-bold text-gray-600">SJ</div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Sarah Jenkins</p>
                    <p className="text-[10px] text-gray-500">Marketing Lead</p>
                  </div>
                  <span className="ml-auto text-[10px] bg-purple-50 text-[#6B46C1] px-2 py-0.5 rounded border border-purple-100">
                    Decision Maker
                  </span>
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Timeline</p>
                  <p className="text-xs text-gray-700 font-medium">Kickoff: Oct 1 • Delivery: Nov 15</p>
                </div>
              </div>
            </div>

            {/* Creative Brief */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="text-[#6B46C1]">
                  <rect width="8" height="4" x="8" y="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" rx="1" ry="1"></rect>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11h4"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16h4"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11h.01"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16h.01"></path>
                </svg>
                Project Objectives
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Key Message</span>
                  <p className="text-xs text-gray-800 mt-0.5 leading-relaxed bg-purple-50 p-2 rounded border border-purple-100">
                    "Smart living isn't complicated. It's simply Nexus."
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Target Audience</span>
                    <p className="text-xs text-gray-700 mt-0.5">Millennials, Tech-curious, Urban</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">Goal</span>
                    <p className="text-xs text-gray-700 mt-0.5">Brand Awareness & Trust</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Guidelines */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">Brand Assets</h3>
              <div className="flex gap-2 mb-3">
                <div className="h-8 w-8 rounded bg-[#000000] shadow-sm border border-gray-100" title="Primary Black"></div>
                <div className="h-8 w-8 rounded bg-[#3B82F6] shadow-sm border border-gray-100" title="Tech Blue"></div>
                <div className="h-8 w-8 rounded bg-[#F59E0B] shadow-sm border border-gray-100" title="Accent Amber"></div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-gray-100 text-[10px] text-gray-600 rounded border border-gray-200">Font: Helvetica Now</span>
                <span className="px-2 py-1 bg-gray-100 text-[10px] text-gray-600 rounded border border-gray-200">Tone: Minimalist</span>
                <span className="px-2 py-1 bg-red-50 text-[10px] text-red-600 rounded border border-red-100 font-medium">NO: Comedy/Slapstick</span>
              </div>
            </div>

            {/* Client Notes */}
            <div className="absolute -right-6 top-96 bg-green-100 p-4 w-48 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] -rotate-1 rounded-sm border-t-8 border-green-200/50 draggable text-gray-800 z-10">
              <p className="text-[10px] font-bold text-green-800 mb-1 uppercase tracking-wide">CLIENT PREFS:</p>
              <ul className="text-xs leading-relaxed list-disc list-inside space-y-1">
                <li>Loves the "Apple" aesthetic</li>
                <li>Avoid showing messy cables</li>
                <li>Approvals: Tue/Thu only</li>
              </ul>
            </div>
          </div>

          {/* SECTION 2: CREATIVE DEVELOPMENT */}
          <div className="absolute top-10 left-[600px] w-[500px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg text-[#6B46C1]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 14c.2-1 .7-1.7 1.5-2.5c1-1 1.5-2.4 1.5-3.8c0-3.2-2.7-5.7-6-5.7s-6 2.5-6 5.7c0 1.4.5 2.8 1.5 3.8c.8.8 1.3 1.5 1.5 2.5"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 18h6"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 22h4"></path>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Creative Development</h2>
            </div>

            {/* Concept Selection */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">Concept Options</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border-2 border-[#6B46C1] bg-purple-50/50 relative">
                  <div className="absolute top-2 right-2 text-[#6B46C1]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="currentColor" stroke="none" className="opacity-20"></circle>
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 12l2 2l4-4"></path>
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                    </svg>
                  </div>
                  <span className="text-[10px] font-bold text-[#6B46C1] uppercase">Selected</span>
                  <p className="font-bold text-sm text-gray-900 mt-1">Concept A: "Day in the Life"</p>
                  <p className="text-[10px] text-gray-600 mt-1">Fast cuts showing the product solving morning chaos.</p>
                </div>
                <div className="p-3 rounded-lg border border-gray-200 bg-white opacity-60">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Rejected</span>
                  <p className="font-bold text-sm text-gray-500 mt-1">Concept B: "Tech Talk"</p>
                  <p className="text-[10px] text-gray-400 mt-1">Direct-to-camera monologue. Too corporate.</p>
                </div>
              </div>
            </div>

            {/* Script */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800 text-sm">TVC Script (:30)</h3>
                <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                  Approved v3
                </span>
              </div>
              <div className="bg-gray-50 rounded border border-gray-200 p-0 overflow-hidden font-mono text-xs">
                <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-100">
                  <div className="p-2 font-bold text-gray-500 text-[10px] uppercase">Video</div>
                  <div className="p-2 font-bold text-gray-500 text-[10px] uppercase border-l border-gray-200">Audio</div>
                </div>
                <div className="grid grid-cols-2 border-b border-gray-200">
                  <div className="p-3 text-gray-800">
                    0:00 - 0:05<br />
                    WIDE SHOT. Modern living room. Dawn light.<br />
                    Lights slowly brighten automatically.
                  </div>
                  <div className="p-3 text-gray-600 border-l border-gray-200">
                    SFX: Gentle birdsong.<br />
                    MUSIC: Soft, acoustic build begins.<br />
                    VO: "Morning usually starts with chaos."
                  </div>
                </div>
                <div className="grid grid-cols-2">
                  <div className="p-3 text-gray-800">
                    0:05 - 0:15<br />
                    CU Smartphone. Finger taps "Morning Mode".<br />
                    Blinds open, coffee maker starts.
                  </div>
                  <div className="p-3 text-gray-600 border-l border-gray-200">
                    SFX: Satisfying 'ping'.<br />
                    VO: "But with Nexus, it starts with a tap."
                  </div>
                </div>
              </div>
            </div>

            {/* Approval Tracker */}
            <div className="relative bg-green-100 p-4 shadow-sm rounded-lg border border-green-200 draggable mb-4">
              <h3 className="font-bold text-green-900 text-xs mb-2 uppercase">Approval Status</h3>
              <div className="space-y-2">
                {[
                  { label: 'Concept', approved: true },
                  { label: 'Script', approved: true },
                  { label: 'Storyboard (Pending)', approved: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    {item.approved ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="text-green-700">
                        <polyline points="9 11 12 14 22 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline>
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                      </svg>
                    ) : (
                      <div className="w-3.5 h-3.5 border-2 border-green-600 rounded-sm"></div>
                    )}
                    <span className={`text-xs font-medium ${item.approved ? 'text-green-800 line-through' : 'text-green-900 font-bold'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3: PRE-PRODUCTION */}
          <div className="absolute top-10 left-[1200px] w-[450px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg text-[#6B46C1]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <rect width="8" height="4" x="8" y="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" rx="1" ry="1"></rect>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11h4"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16h4"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11h.01"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16h.01"></path>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Pre-Production</h2>
            </div>

            {/* Casting */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">Casting</h3>
              <div className="flex gap-3">
                <div className="flex-1 bg-gray-50 p-2 rounded border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Lead Role</div>
                  <div className="font-medium text-xs text-gray-900 mt-1">"The Professional"</div>
                  <div className="text-[10px] text-gray-500">Female, 30s, Relatable</div>
                  <div className="mt-2 text-[10px] text-[#6B46C1] font-bold">Option: Sarah M. (Booked)</div>
                </div>
                <div className="flex-1 bg-gray-50 p-2 rounded border border-gray-100">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Voiceover</div>
                  <div className="font-medium text-xs text-gray-900 mt-1">Warm/Confident</div>
                  <div className="text-[10px] text-gray-500">Non-announcer style</div>
                  <div className="mt-2 text-[10px] text-amber-600 font-bold">Auditions: Oct 5</div>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">Shoot Schedule: Oct 12</h3>
              <div className="space-y-2 border-l-2 border-[#6B46C1] pl-4 relative">
                {[
                  { time: '07:00 AM', desc: 'Crew Call / Load In', active: true },
                  { time: '09:00 AM', desc: 'Talent on Set / Rehearsal', active: false },
                  { time: '12:00 PM', desc: 'Lunch Break', active: false },
                  { time: '05:00 PM', desc: 'Product Beauty Shots', active: false },
                ].map((item) => (
                  <div key={item.time} className="relative">
                    <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full ${item.active ? 'bg-[#6B46C1]' : 'bg-gray-300'} ring-4 ring-white`}></div>
                    <span className="text-xs font-bold text-gray-900">{item.time}</span>
                    <span className="text-xs text-gray-500 ml-2">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Checklist */}
            <div className="relative bg-purple-50 rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-4 border border-purple-100 draggable">
              <h3 className="font-semibold text-[#6B46C1] mb-2 text-xs uppercase tracking-wider">Product Props</h3>
              <ul className="text-xs text-gray-700 space-y-2">
                <li className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked className="accent-[#6B46C1]" /> 3x Hero Units (Unopened)
                </li>
                <li className="flex items-center gap-2">
                  <input type="checkbox" className="accent-[#6B46C1]" /> Mobile App Demo Build (Beta)
                </li>
              </ul>
            </div>
          </div>

          {/* SECTION 4: POST & DELIVERY */}
          <div className="absolute top-10 left-[1800px] w-[450px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg text-[#6B46C1]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="6" cy="6" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                  <circle cx="6" cy="18" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Post & Delivery</h2>
            </div>

            {/* Deliverables */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">Deliverables Checklist</h3>
              <div className="space-y-2">
                {[
                  { label: '16:9 Master (TV/Web)', duration: ':30' },
                  { label: '9:16 Vertical (Social)', duration: ':15' },
                  { label: '1:1 Square (Feed)', duration: ':15' },
                ].map((item) => (
                  <label key={item.label} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded border border-transparent hover:border-gray-200">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" className="accent-[#6B46C1] rounded" />
                      <span className="font-medium text-gray-900">{item.label}</span>
                    </div>
                    <span className="text-gray-400 font-mono">{item.duration}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">Edit Timeline</h3>
              <div className="flex gap-1 text-xs text-center">
                {[
                  { week: 'WK 1', phase: 'Assembly', color: 'bg-green-100 text-green-800' },
                  { week: 'WK 2', phase: 'Rough', color: 'bg-blue-100 text-blue-800' },
                  { week: 'WK 3', phase: 'Color/Mix', color: 'bg-yellow-100 text-yellow-800' },
                  { week: 'WK 4', phase: 'Final', color: 'bg-gray-100 text-gray-500' },
                ].map((item) => (
                  <div key={item.week} className={`flex-1 ${item.color} p-2 rounded`}>
                    <div className="font-bold">{item.week}</div>
                    <div className="text-[9px]">{item.phase}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* QC Checklist */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm">QC Checklist</h3>
              <ul className="text-xs text-gray-600 space-y-2">
                {[
                  'Product color match (Pantone 286C)',
                  'Legal disclaimer text on final frame',
                  'Audio -16 LUFS (Broadcast standard)',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" className="text-[#6B46C1]">
                      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                      <line x1="12" x2="12" y1="8" y2="12" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                      <line x1="12" x2="12.01" y1="16" y2="16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SECTION 5: TRAFFICKING */}
          <div className="absolute top-10 left-[2400px] w-[350px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg text-[#6B46C1]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m12 15l-3-3a22 22 0 0 1 2-12a22.16 22.16 0 0 1 9 9a22 22 0 0 1-5.3 10.7a6.66 6.66 0 0 1-4.7 1.3"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m12 15l-3 3"></path>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Trafficking</h2>
            </div>

            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">Destination Channels</h3>
              <div className="space-y-3">
                {[
                  { icon: 'tv', label: 'Broadcast (Comcast)', status: 'Ready', statusColor: 'bg-green-50 text-green-600' },
                  { icon: 'youtube', label: 'YouTube Pre-roll', status: 'Uploading...', statusColor: 'bg-gray-100 text-gray-500' },
                ].map((platform) => (
                  <div key={platform.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs">
                      {platform.icon === 'tv' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="text-gray-400">
                          <rect width="20" height="15" x="2" y="7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" rx="2" ry="2"></rect>
                          <polyline points="17 2 12 7 7 2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="text-gray-400">
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.5 17a24.12 24.12 0 0 1 0-10a2 2 0 0 1 1.4-1.4c3.6-.9 12.5-.9 16.1 0a2 2 0 0 1 1.4 1.4a24.12 24.12 0 0 1 0 10a2 2 0 0 1-1.4 1.4c-3.6.9-12.5.9-16.1 0a2 2 0 0 1-1.4-1.4z"></path>
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m10 15l5-3l-5-3z"></path>
                        </svg>
                      )}
                      <span>{platform.label}</span>
                    </div>
                    <span className={`text-[10px] font-bold ${platform.statusColor} px-1.5 py-0.5 rounded`}>
                      {platform.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Campaign Metrics */}
            <div className="absolute -left-10 top-[300px] bg-green-100 p-4 w-40 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] rotate-2 rounded-sm border-t-8 border-green-200/50 draggable text-gray-800">
              <p className="text-xs leading-relaxed font-semibold">📈 Track performance: Aiming for 2.5% CTR on Social cuts.</p>
            </div>
          </div>

          {/* Floating Helper */}
          <div className="absolute top-[650px] left-[800px] bg-white p-3 rounded-lg shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] rotate-1 border border-purple-200 draggable z-10 flex gap-3 items-start max-w-xs">
            <div className="bg-purple-100 p-1.5 rounded-full text-[#6B46C1] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21.73 18l-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v4"></path>
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17h.01"></path>
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Client Approval First</p>
              <p className="text-[10px] text-gray-500 leading-tight mt-1">
                Never proceed to shoot without signed concept & script approvals. Saves budget!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Welcome Modal Overlay */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 to-indigo-600"></div>

            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-[#6B46C1]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                  <rect width="20" height="15" x="2" y="7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" rx="2" ry="2"></rect>
                  <polyline points="17 2 12 7 7 2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline>
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-bold text-center text-gray-900 mb-2">Commercial Production</h2>
            <p className="text-center text-gray-500 mb-8 leading-relaxed">
              Streamline your TVC and social ad workflows. Manage client approvals, track deliverables, and ensure brand consistency.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setShowWelcomeModal(false)}
                className="w-full py-3 bg-[#6B46C1] hover:bg-[#553C9A] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95"
              >
                Start Campaign
              </button>
              <button
                onClick={() => setShowWelcomeModal(false)}
                className="w-full py-3 bg-white text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Example Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

