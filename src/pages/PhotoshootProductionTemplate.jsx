import { useState, useRef, useEffect } from 'react';

export default function PhotoshootProductionTemplate() {
  const [showModal, setShowModal] = useState(true);
  const mainRef = useRef(null);
  const navigate = null; // Not using navigation in this template

  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    let isDown = false;
    let startX;
    let scrollLeft;
    let startY;
    let scrollTop;

    const handleMouseDown = (e) => {
      if (e.target.closest('.draggable') || e.target.closest('button') || e.target.closest('input') || e.target.closest('select') || e.target.closest('textarea')) return;

      isDown = true;
      main.classList.add('cursor-grabbing');
      main.classList.remove('cursor-default');
      startX = e.pageX - main.offsetLeft;
      scrollLeft = main.scrollLeft;
      startY = e.pageY - main.offsetTop;
      scrollTop = main.scrollTop;
    };

    const handleMouseLeave = () => {
      isDown = false;
      main.classList.remove('cursor-grabbing');
    };

    const handleMouseUp = () => {
      isDown = false;
      main.classList.remove('cursor-grabbing');
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - main.offsetLeft;
      const walkX = (x - startX) * 1;
      main.scrollLeft = scrollLeft - walkX;

      const y = e.pageY - main.offsetTop;
      const walkY = (y - startY) * 1;
      main.scrollTop = scrollTop - walkY;
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
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F5F5F4] text-[#1F2937] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-14 bg-white border-b border-[#E5E5E5] flex items-center justify-between px-4 z-40 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#14B8A6]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
              <circle cx="12" cy="13" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
            </svg>
            <span className="font-serif font-bold text-lg tracking-tight text-gray-900">Flow Pro</span>
          </div>
          <div className="h-4 w-px bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Project /</span>
            <span className="text-sm font-semibold text-gray-900">Urban Editorial: Summer '24</span>
            <span className="px-2 py-0.5 rounded-full bg-teal-50 text-[#14B8A6] text-[10px] font-bold tracking-wide uppercase border border-teal-100">
              In Pre-Production
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">
              JD
            </div>
            <div className="w-8 h-8 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-xs font-bold text-teal-600">
              PH
            </div>
          </div>
          <button className="px-3 py-1.5 bg-[#14B8A6] text-white text-sm font-medium rounded-md hover:bg-[#0F766E] transition-colors shadow-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
              <polyline points="14 2 14 8 20 8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline>
            </svg>
            Export Call Sheet
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="absolute left-4 top-20 flex flex-col gap-2 bg-white p-1.5 rounded-lg shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-[#E5E5E5] z-30">
        <button className="p-2 hover:bg-gray-50 rounded-md text-[#14B8A6] transition-colors" title="Select">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m12 6l-6 13.5l3.5-1.5l2.5 5l2.5-5l3.5 1.5Z"></path>
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-50 rounded-md text-gray-500 transition-colors" title="Moodboard">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <rect width="18" height="18" x="3" y="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" rx="2" ry="2"></rect>
            <circle cx="9" cy="9" r="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></circle>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-50 rounded-md text-gray-500 transition-colors" title="Shot List">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6h11"></path>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 12h11"></path>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 18h11"></path>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 6h1"></path>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12h1"></path>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 18h1"></path>
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-50 rounded-md text-gray-500 transition-colors" title="Notes">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"></path>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 3v6h6"></path>
          </svg>
        </button>
      </div>

      {/* Main Canvas Area */}
      <main
        ref={mainRef}
        className="flex-1 overflow-auto relative bg-[#F5F5F4] cursor-default"
        style={{
          backgroundImage: 'linear-gradient(#E5E5E5 1px, transparent 1px), linear-gradient(90deg, #E5E5E5 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      >
        {/* Infinite Canvas Container */}
        <div className="relative w-[3200px] h-[1600px] p-10 transform origin-top-left">
          {/* SVG Connections Layer */}
          <svg className="absolute inset-0 pointer-events-none z-0 opacity-20" width="100%" height="100%">
            <path d="M500 200 C 550 200, 550 200, 600 200" stroke="#14B8A6" strokeWidth="2" fill="none" strokeDasharray="4,4"></path>
            <path d="M1050 200 C 1100 200, 1100 200, 1150 200" stroke="#14B8A6" strokeWidth="2" fill="none" strokeDasharray="4,4"></path>
            <path d="M1600 200 C 1650 200, 1650 200, 1700 200" stroke="#14B8A6" strokeWidth="2" fill="none" strokeDasharray="4,4"></path>
            <path d="M2100 200 C 2150 200, 2150 200, 2200 200" stroke="#14B8A6" strokeWidth="2" fill="none" strokeDasharray="4,4"></path>
          </svg>

          {/* SECTION 1: CREATIVE CONCEPT */}
          <div className="absolute top-10 left-10 w-[450px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-100 rounded-lg text-[#14B8A6]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" stroke="none"></circle>
                  <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" stroke="none"></circle>
                  <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" stroke="none"></circle>
                  <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" stroke="none"></circle>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688c0-.437-.18-.835-.437-1.125c-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2"></path>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Creative Concept</h2>
            </div>

            {/* Shoot Overview */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable group hover:border-[#14B8A6]/30 transition-colors">
              <h3 className="font-bold text-sm text-gray-900 mb-3 border-b border-gray-100 pb-2">📋 Shoot Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Project</span>
                    <div className="text-sm font-semibold text-gray-800">Urban Editorial</div>
                  </div>
                  <span className="bg-teal-50 text-[#14B8A6] text-[10px] font-bold px-2 py-0.5 rounded border border-teal-100">Commercial</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Goal</span>
                  <p className="text-xs text-gray-600 mt-0.5">"Gritty but high-fashion street style for Fall Campaign"</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Deliverables</span>
                    <span className="text-xs font-medium text-gray-700">20 Final Edits</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Deadline</span>
                    <span className="text-xs font-medium text-gray-700">August 24th</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Creative Direction */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-bold text-sm text-gray-900 mb-3">🎨 Creative Direction</h3>

              <div className="mb-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Color Palette</span>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-gray-200" title="Charcoal"></div>
                  <div className="w-8 h-8 rounded-full bg-orange-600 border border-gray-200" title="Rust Orange"></div>
                  <div className="w-8 h-8 rounded-full bg-stone-300 border border-gray-200" title="Concrete"></div>
                  <div className="w-8 h-8 rounded-full bg-teal-500 border border-gray-200" title="Teal Accent"></div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                  <strong>Lighting:</strong> High contrast, natural light, harsh shadows (mid-day).
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                  <strong>Vibe:</strong> Movement, candid, "caught in the moment".
                </div>
              </div>
            </div>

            {/* Mood Board Placeholder */}
            <div className="relative bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-6 mb-4 flex flex-col items-center justify-center text-center draggable hover:bg-gray-100 transition-colors h-48">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" className="text-gray-400 mb-2">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                <line x1="16" x2="22" y1="5" y2="5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></line>
                <line x1="19" x2="19" y1="2" y2="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></line>
                <circle cx="9" cy="9" r="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></circle>
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
              </svg>
              <span className="text-sm font-semibold text-gray-500">Visual References</span>
              <span className="text-xs text-gray-400 mt-1">Drag moodboard images here</span>
            </div>

            {/* Sticky Note */}
            <div className="relative bg-[#FDF2F8] p-4 shadow-[1px_1px_3px_rgba(0,0,0,0.1)] rotate-1 rounded-sm border border-pink-200 draggable text-[#831843] mb-4">
              <p className="text-[10px] font-bold opacity-70 mb-2 uppercase tracking-wide">💡 CREATIVE IDEAS</p>
              <ul className="text-xs leading-relaxed list-disc list-inside space-y-1">
                <li>Try shooting through glass/windows</li>
                <li>Motion blur on the subway entrance</li>
                <li>Prop: Vintage film camera?</li>
                <li>Bring a prism for light effects</li>
              </ul>
            </div>
          </div>

          {/* SECTION 2: PRE-PRODUCTION */}
          <div className="absolute top-10 left-[600px] w-[500px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-100 rounded-lg text-[#14B8A6]">
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

            {/* Talent & Crew */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm text-gray-900">👥 Talent & Crew</h3>
                <span className="text-[10px] text-gray-400 font-mono">STATUS: BOOKED</span>
              </div>

              <div className="space-y-3">
                {/* Model */}
                <div className="flex items-center justify-between p-3 rounded-lg border-l-4 border-[#14B8A6] bg-teal-50 shadow-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#14B8A6] uppercase">Model</span>
                      <span className="text-xs font-bold text-gray-900">Sarah Jenkins</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1">Agency: Elite • Call time: 8:00 AM</div>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" className="text-[#14B8A6]">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 12l2 2l4-4"></path>
                  </svg>
                </div>

                {/* MUA */}
                <div className="flex items-center justify-between p-3 rounded-lg border-l-4 border-gray-300 bg-white border border-gray-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">H & MUA</span>
                      <span className="text-xs font-bold text-gray-700">Jessica Lee</span>
                    </div>
                    <div className="text-[10px] text-gray-500 mt-1">Kit Fee: Paid • Call time: 7:45 AM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="text-red-500">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                  <circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                </svg>
                Location: Downtown Loft
              </h3>
              <div className="text-xs text-gray-600 space-y-2 mb-3">
                <p>
                  <strong>Address:</strong> 142 Broadway Ave, Floor 4
                </p>
                <p>
                  <strong>Access:</strong> Freight elevator code 4920
                </p>
                <p>
                  <strong>Parking:</strong> Lot across street ($20/day)
                </p>
              </div>
              <div className="p-2 bg-yellow-50 border border-yellow-100 rounded text-[10px] text-yellow-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v2"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20v2"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m4.93 4.93l1.41 1.41"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m17.66 17.66l1.41 1.41"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12h2"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12h2"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m6.34 17.66l-1.41 1.41"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19.07 4.93l-1.41 1.41"></path>
                </svg>
                <strong>Lighting Note:</strong> Direct sun enters west windows at 3:00 PM.
              </div>
            </div>

            {/* Gear Checklist */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-4 border border-gray-100 draggable">
              <h3 className="font-bold text-xs uppercase text-gray-500 mb-2">Equipment Pack</h3>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-700">
                {['Sony A7IV', '24-70mm GM', '85mm f/1.4', 'Reflector', 'Flashpoint XPLOR', 'Extra Batteries'].map((item, idx) => (
                  <label key={item} className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={idx < 3} className="accent-[#14B8A6]" />
                    {item}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3: SHOT LIST */}
          <div className="absolute top-10 left-[1150px] w-[500px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-100 rounded-lg text-[#14B8A6]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                  <circle cx="12" cy="13" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Shot List</h2>
            </div>

            {/* Setup 1 */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-bold text-sm text-gray-900 mb-3 flex justify-between">
                <span>📸 Setup 1: The Commute</span>
                <span className="text-[10px] bg-teal-50 text-[#14B8A6] px-2 py-0.5 rounded font-bold uppercase tracking-wide">Look 1</span>
              </h3>
              <div className="text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                <strong>Wardrobe:</strong> Trench coat, denim, sneakers.
                <br />
                <strong>Location:</strong> Street corner / Crosswalk.
              </div>
              <div className="space-y-2">
                {[
                  { title: 'Wide / Full Body (Walking)', desc: 'Capture movement crossing street. Low angle.' },
                  { title: 'Medium / Waist Up (Glance)', desc: 'Looking over shoulder, "paparazzi" style.' },
                  { title: 'Detail / Accessories', desc: 'Close up on bag + hand holding coffee.' },
                ].map((shot) => (
                  <div key={shot.title} className="flex items-start gap-2 text-xs text-gray-800 border-b border-gray-100 pb-2 last:border-0">
                    <input type="checkbox" className="accent-[#14B8A6] mt-0.5" />
                    <div>
                      <span className="font-bold">{shot.title}</span>
                      <p className="text-gray-500">{shot.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Setup 2 */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-bold text-sm text-gray-900 mb-3 flex justify-between">
                <span>📸 Setup 2: Coffee Shop</span>
                <span className="text-[10px] bg-teal-50 text-[#14B8A6] px-2 py-0.5 rounded font-bold uppercase tracking-wide">Look 2</span>
              </h3>
              <div className="text-xs text-gray-600 mb-3 bg-gray-50 p-2 rounded">
                <strong>Wardrobe:</strong> Oversized blazer, sunglasses.
                <br />
                <strong>Location:</strong> Outdoor patio table.
              </div>
              <div className="space-y-2">
                {[
                  { title: 'Portrait / Through Window', desc: 'Use reflections for texture.' },
                  { title: 'Overhead / Flatlay', desc: 'Model reading paper + coffee details.' },
                ].map((shot) => (
                  <div key={shot.title} className="flex items-start gap-2 text-xs text-gray-800 border-b border-gray-100 pb-2 last:border-0">
                    <input type="checkbox" className="accent-[#14B8A6] mt-0.5" />
                    <div>
                      <span className="font-bold">{shot.title}</span>
                      <p className="text-gray-500">{shot.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pink Sticky: Safety Shots */}
            <div className="relative bg-[#FDF2F8] p-4 shadow-sm rotate-2 rounded-sm border border-pink-200 draggable text-[#831843] w-full">
              <p className="text-[10px] font-bold opacity-70 mb-2 uppercase tracking-wide">⚠️ SAFETY SHOTS</p>
              <ul className="text-xs leading-relaxed space-y-1">
                {['Clean headshot on plain wall', 'Vertical option for Stories (9:16)', 'Landscape option for Web Banner', 'Product detail isolated'].map((item) => (
                  <li key={item}>☐ {item}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* SECTION 4: POST-PRODUCTION */}
          <div className="absolute top-10 left-[1700px] w-[450px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-100 rounded-lg text-[#14B8A6]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <line x1="21" x2="14" y1="4" y2="4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                  <line x1="10" x2="3" y1="4" y2="4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                  <line x1="21" x2="12" y1="12" y2="12" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                  <line x1="8" x2="3" y1="12" y2="12" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                  <line x1="21" x2="16" y1="20" y2="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                  <line x1="12" x2="3" y1="20" y2="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                  <line x1="14" x2="14" y1="2" y2="6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                  <line x1="8" x2="8" y1="10" y2="14" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                  <line x1="16" x2="16" y1="18" y2="22" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Post-Production</h2>
            </div>

            {/* Edit Workflow */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-bold text-sm text-gray-900 mb-3">Retouching Pipeline</h3>
              <div className="space-y-2">
                {[
                  { label: 'Import & Culling', status: '~500 shots' },
                  { label: 'Color Grading', status: 'Preset: UrbanV2' },
                  { label: 'Skin Retouching', status: '' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-xs p-2 bg-white rounded border border-gray-200 last:bg-gray-50 last:opacity-60">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-gray-300 rounded-full"></div>
                      <span className="font-medium text-gray-900">{item.label}</span>
                    </div>
                    {item.status && <span className="text-gray-400 font-mono text-[10px]">{item.status}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Guidelines */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-bold text-sm text-gray-900 mb-2">Style Guide</h3>
              <div className="bg-gray-50 border border-gray-200 rounded p-3 font-mono text-[10px] text-gray-600 leading-relaxed">
                <p className="mb-2">
                  <strong>SKIN:</strong> Natural texture. Remove temporary blemishes only. Do not over-smooth.
                </p>
                <p className="mb-2">
                  <strong>TONES:</strong> Warm highlights, slightly desaturated greens, deep blacks.
                </p>
                <p className="mb-2">
                  <strong>CROP:</strong> Keep 4:5 ratio in mind for all verticals.
                </p>
                <p>
                  <strong>EXPORT:</strong>
                  <br />- Web: sRGB, 2048px long edge
                  <br />- Print: AdobeRGB, Full Res
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 5: DELIVERY */}
          <div className="absolute top-10 left-[2200px] w-[400px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-100 rounded-lg text-[#14B8A6]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Delivery</h2>
            </div>

            {/* Checklist */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-bold text-sm text-gray-900 mb-2">Final Deliverables</h3>
              <ul className="text-xs text-gray-600 space-y-2">
                {['20 Hi-Res Edits (Print)', '20 Web-Res (Social)', 'Private Gallery Link', 'Invoice #1024 Sent'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <input type="checkbox" className="accent-[#14B8A6]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Plan */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-bold text-sm text-gray-900 mb-4">Social Teasers</h3>
              <div className="grid grid-cols-3 gap-2">
                {['BTS Reel', 'Sneak Peek', 'Main Post'].map((item) => (
                  <div key={item} className="aspect-[4/5] bg-gray-100 rounded flex items-center justify-center text-[10px] text-gray-400 border border-gray-200">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial Sticky */}
            <div className="relative bg-[#FDF2F8] p-4 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] -rotate-1 rounded-sm border border-pink-200 draggable text-[#831843] mt-6">
              <p className="text-[10px] font-bold opacity-70 mb-2 uppercase tracking-wide">💬 CLIENT LOVE</p>
              <p className="text-xs italic leading-relaxed mb-2">
                "These are exactly what we needed! The lighting is incredible. Can we book you for the Winter campaign?"
              </p>
              <p className="text-[10px] text-right font-bold">- Marketing Director</p>
            </div>
          </div>

          {/* Floating Helper */}
          <div className="absolute top-[650px] left-[800px] bg-white p-3 rounded-lg shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] rotate-1 border border-teal-200 draggable z-10 flex gap-3 items-start max-w-xs group hover:-translate-y-1 transition-transform">
            <div className="bg-teal-100 p-1.5 rounded-full text-[#14B8A6] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" stroke="none"></polygon>
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Overshoot!</p>
              <p className="text-[10px] text-gray-500 leading-tight mt-1">
                Always shoot more than you need. Better to have options than miss the perfect moment.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Welcome Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-emerald-600"></div>

            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center text-[#14B8A6]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                  <circle cx="12" cy="13" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-bold text-center text-gray-900 mb-2">Photoshoot Production</h2>
            <p className="text-center text-gray-500 mb-8 leading-relaxed">
              Organize creative concepts, manage shot lists, and track deliverables in your visual workspace.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-[#14B8A6] hover:bg-[#0F766E] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95"
              >
                Start Planning
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-white text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Sample Shoot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

