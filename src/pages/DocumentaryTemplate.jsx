import { useState, useRef, useEffect } from 'react';

export default function DocumentaryTemplate() {
  const [showModal, setShowModal] = useState(true);
  const mainRef = useRef(null);

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
              <rect width="18" height="18" x="3" y="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" rx="2"></rect>
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 3v18m10-18v18m-14 6h18m-18 6h18m-18 6h18"></path>
            </svg>
            <span className="font-serif font-bold text-lg tracking-tight text-gray-900">Flow Pro</span>
          </div>
          <div className="h-4 w-px bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Projects /</span>
            <span className="text-sm font-semibold text-gray-900">The Silent Archive</span>
            <span className="px-2 py-0.5 rounded-full bg-teal-50 text-[#14B8A6] text-[10px] font-bold tracking-wide uppercase border border-teal-100">
              Documentary
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">
              JD
            </div>
            <div className="w-8 h-8 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-xs font-bold text-teal-600">
              AL
            </div>
          </div>
          <button className="px-3 py-1.5 bg-[#14B8A6] text-white text-sm font-medium rounded-md hover:bg-[#0F766E] transition-colors shadow-sm">
            Share Project
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
        <button className="p-2 hover:bg-gray-50 rounded-md text-gray-500 transition-colors" title="Evidence/Note">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 2v4a2 2 0 0 0 2 2h4"></path>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"></path>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m9 18l-1.5-1.5"></path>
            <circle cx="5" cy="14" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></circle>
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-50 rounded-md text-gray-500 transition-colors" title="Connection">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-50 rounded-md text-gray-500 transition-colors" title="Map">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></circle>
          </svg>
        </button>
      </div>

      {/* Main Canvas Area */}
      <main
        ref={mainRef}
        className="flex-1 overflow-auto relative bg-[#F5F5F4] cursor-default"
        style={{
          backgroundImage: 'radial-gradient(#A8A29E 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      >
        {/* Infinite Canvas Container */}
        <div className="relative w-[3400px] h-[1600px] p-10 transform origin-top-left">
          {/* SVG Connections Layer */}
          <svg className="absolute inset-0 pointer-events-none z-0 opacity-20" width="100%" height="100%">
            <path d="M480 200 C 550 200, 550 200, 620 200" stroke="#14B8A6" strokeWidth="2" fill="none" strokeDasharray="8,4"></path>
            <path d="M1080 200 C 1150 200, 1150 200, 1220 200" stroke="#14B8A6" strokeWidth="2" fill="none" strokeDasharray="8,4"></path>
            <path d="M1680 200 C 1750 200, 1750 200, 1820 200" stroke="#14B8A6" strokeWidth="2" fill="none" strokeDasharray="8,4"></path>
            <path d="M2280 200 C 2350 200, 2350 200, 2420 200" stroke="#14B8A6" strokeWidth="2" fill="none" strokeDasharray="8,4"></path>
          </svg>

          {/* SECTION 1: RESEARCH & CONCEPT */}
          <div className="absolute top-10 left-10 w-[450px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-100 rounded-lg text-[#14B8A6]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 21l-4.3-4.3"></path>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Research & Concept</h2>
            </div>

            {/* Overview */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable group hover:border-[#14B8A6]/30 transition-colors">
              <div className="mb-4 pb-3 border-b border-gray-100">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Working Title</label>
                <input type="text" defaultValue="The Silent Archive" className="w-full text-lg font-serif font-bold text-gray-900 border-none p-0 focus:ring-0 bg-transparent" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</label>
                  <select className="w-full text-xs py-1 bg-transparent border-b border-gray-200 outline-none text-gray-700 mt-1">
                    <option>Investigative Feature</option>
                    <option>Short Doc</option>
                    <option>Series</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</label>
                  <span className="block mt-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full w-fit border border-amber-100">
                    In Development
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Central Question</label>
                  <textarea
                    defaultValue="What happened to the missing library records from 1984?"
                    className="w-full text-sm mt-1 bg-gray-50 p-2 rounded border border-gray-100 text-gray-700 resize-none h-16 focus:border-[#14B8A6] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Story Premise */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="text-[#14B8A6]">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                Core Premise
              </h3>
              <div className="space-y-3">
                <div className="pl-3 border-l-2 border-[#14B8A6]/30">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">The Stakes</span>
                  <p className="text-xs text-gray-700 mt-0.5 leading-relaxed">If we don't find the witnesses now, the story dies with them.</p>
                </div>
                <div className="pl-3 border-l-2 border-[#14B8A6]/30">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">Themes</span>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600">Memory</span>
                    <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-600">Institutional Decay</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Investigation Board */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-4 mb-4 border border-gray-100 draggable overflow-hidden">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800 text-sm">Evidence Map</h3>
                <span className="text-[10px] text-gray-400">Visual Connections</span>
              </div>
              <div
                className="w-full h-40 rounded border border-gray-200 relative shadow-inner"
                style={{
                  backgroundColor: '#f7f3e8',
                  backgroundImage: 'radial-gradient(#e5e0d3 1px, transparent 1px)',
                  backgroundSize: '10px 10px',
                }}
              >
                {/* Simulated pinned items */}
                <div className="absolute top-4 left-4 bg-white p-1 shadow-sm rotate-3 border border-gray-200 w-16 text-[8px] text-center font-mono">
                  <div className="bg-gray-200 h-8 mb-1"></div>
                  Suspect A
                </div>
                <div className="absolute bottom-6 right-8 bg-white p-1 shadow-sm -rotate-2 border border-gray-200 w-16 text-[8px] text-center font-mono">
                  <div className="bg-gray-200 h-8 mb-1"></div>
                  The Letter
                </div>
                {/* Red string connection */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line x1="50" y1="30" x2="300" y2="120" stroke="#EF4444" strokeWidth="1.5" strokeOpacity="0.6"></line>
                </svg>
              </div>
            </div>

            {/* Research Note (Blue Sticky) */}
            <div className="absolute -right-8 top-80 bg-blue-100 p-4 w-48 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] rotate-2 rounded-sm border-t-8 border-blue-200/50 draggable text-gray-800">
              <p className="text-[10px] font-bold text-blue-800 mb-1">🔍 LEAD TO FOLLOW:</p>
              <p className="text-xs leading-relaxed">Check the microfiche archives at the City Library basement. Contact: Sarah J.</p>
            </div>
          </div>

          {/* SECTION 2: SUBJECTS & INTERVIEWS */}
          <div className="absolute top-10 left-[600px] w-[450px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-100 rounded-lg text-[#14B8A6]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" x2="12" y1="19" y2="22" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Subjects & Interviews</h2>
            </div>

            {/* Main Subject Card */}
            <div className="relative bg-teal-50/50 rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-teal-100 draggable">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="text-gray-400">
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">Dr. Elena Rostova</h3>
                    <p className="text-xs text-[#14B8A6] font-medium">Primary Witness</p>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold uppercase">Confirmed</span>
              </div>

              <div className="space-y-3 mt-4">
                <div className="bg-white p-3 rounded border border-teal-100/50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Role in Story</p>
                  <p className="text-xs text-gray-700 mt-1">Former archivist who first noticed the missing files. Skeptical but willing to talk.</p>
                </div>
                <div className="bg-white p-3 rounded border border-teal-100/50">
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Key Question Strategy</p>
                  <ul className="text-xs text-gray-600 mt-1 list-disc list-inside space-y-1">
                    <li>Start with her early career (establish authority)</li>
                    <li>Ask about "The Tuesday Night" incident</li>
                    <li>Show her the recovered letter (prop)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Interview Schedule */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="text-[#14B8A6]">
                  <rect width="18" height="18" x="3" y="4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" rx="2" ry="2"></rect>
                  <line x1="16" x2="16" y1="2" y2="6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                  <line x1="8" x2="8" y1="2" y2="6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                  <line x1="3" x2="21" y1="10" y2="10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                </svg>
                Shoot Schedule
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 transition-colors">
                  <div className="w-12 text-center">
                    <span className="block text-xs font-bold text-gray-900">OCT</span>
                    <span className="block text-lg font-bold text-[#14B8A6] leading-none">24</span>
                  </div>
                  <div className="h-8 w-px bg-gray-200"></div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Elena Rostova Interview</p>
                    <p className="text-[10px] text-gray-500">10:00 AM • Her Home • 2 Cameras</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 transition-colors opacity-50">
                  <div className="w-12 text-center">
                    <span className="block text-xs font-bold text-gray-900">NOV</span>
                    <span className="block text-lg font-bold text-gray-400 leading-none">02</span>
                  </div>
                  <div className="h-8 w-px bg-gray-200"></div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Library B-Roll</p>
                    <p className="text-[10px] text-gray-500">Pending Permit</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Specs */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-2 text-xs uppercase tracking-wider text-[#14B8A6]">Production Specs</h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="block text-[10px] text-gray-400 font-bold">A-CAM</span>
                  <span className="text-gray-700">FX6 + 35mm Prime</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="block text-[10px] text-gray-400 font-bold">B-CAM</span>
                  <span className="text-gray-700">A7SIII + 85mm</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="block text-[10px] text-gray-400 font-bold">LIGHTING</span>
                  <span className="text-gray-700">Natural key + neg fill</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="block text-[10px] text-gray-400 font-bold">AUDIO</span>
                  <span className="text-gray-700">Boom + Lav (Ch 1/2)</span>
                </div>
              </div>
            </div>

            {/* Floating Helper */}
            <div className="absolute -right-6 bottom-20 bg-yellow-100 p-3 w-40 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] -rotate-1 rounded-sm border-t-4 border-yellow-200/50 draggable text-gray-800 z-10">
              <p className="text-xs font-medium">"Let the silence linger. Don't interrupt the moment."</p>
            </div>
          </div>

          {/* SECTION 3: PRODUCTION & ARCHIVAL */}
          <div className="absolute top-10 left-[1200px] w-[450px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-100 rounded-lg text-[#14B8A6]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <rect width="20" height="5" x="2" y="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" rx="1"></rect>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 12h4"></path>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Production & Archival</h2>
            </div>

            {/* Archival Log */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable border-l-4 border-l-[#14B8A6]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Archival Checklist</h3>
                <span className="text-[10px] text-gray-500 font-mono">25% Cleared</span>
              </div>
              <div className="space-y-3">
                {[
                  { title: '1984 Newspaper Clippings', tags: ['Scanned 600dpi', 'Public Domain'], checked: true },
                  { title: 'Family 8mm Footage', tags: ['Needs Transfer', 'Owner: Elena'], checked: false },
                  { title: 'News Broadcast (Ch 4)', tags: ['License Pending ($500)'], checked: false },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3 border-b border-gray-50 pb-2 last:border-0">
                    <input type="checkbox" defaultChecked={item.checked} className="mt-1 text-[#14B8A6] focus:ring-[#14B8A6] rounded" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <div className="flex gap-2 mt-1">
                        {item.tags.map((tag, idx) => {
                          let bgColor = 'bg-gray-100';
                          let textColor = 'text-gray-600';
                          let borderColor = 'border-gray-200';
                          if (tag.includes('Scanned') || tag.includes('Public')) {
                            bgColor = 'bg-green-50';
                            textColor = 'text-green-700';
                            borderColor = 'border-green-100';
                          } else if (tag.includes('Needs') || tag.includes('Owner')) {
                            bgColor = 'bg-yellow-50';
                            textColor = 'text-yellow-700';
                            borderColor = 'border-yellow-100';
                          } else if (tag.includes('License') || tag.includes('Pending')) {
                            bgColor = 'bg-red-50';
                            textColor = 'text-red-700';
                            borderColor = 'border-red-100';
                          }
                          return (
                            <span key={idx} className={`text-[10px] ${bgColor} ${textColor} px-1.5 rounded border ${borderColor}`}>
                              {tag}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Location Access */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">Location Access</h3>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { name: 'Central Library', status: 'Permit Needed', icon: 'building', color: 'red' },
                  { name: "Elena's House", status: 'Secured', icon: 'home', color: 'green' },
                ].map((location) => (
                  <div key={location.name} className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-100">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="text-gray-500">
                        {location.icon === 'building' ? (
                          <>
                            <rect width="16" height="20" x="4" y="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" rx="2" ry="2"></rect>
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 22v-4h6v4"></path>
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 6h.01"></path>
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 6h.01"></path>
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01"></path>
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 10h.01"></path>
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14h.01"></path>
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 14h.01"></path>
                          </>
                        ) : (
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m3 9l9-7l9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        )}
                      </svg>
                      <span className="text-xs font-medium text-gray-700">{location.name}</span>
                    </div>
                    <span className={`text-[10px] text-${location.color === 'red' ? 'red' : 'green'}-${location.color === 'red' ? '500' : '600'} font-bold uppercase`}>
                      {location.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Production Note */}
            <div className="absolute -right-8 top-10 bg-blue-100 p-4 w-40 h-40 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] rotate-3 rounded-sm border-t-8 border-blue-200/50 draggable text-gray-800 flex items-center justify-center text-center">
              <p className="text-sm font-semibold">Verify the date on the newspaper clipping! It contradicts Subject B's timeline.</p>
            </div>
          </div>

          {/* SECTION 4: POST & STORY */}
          <div className="absolute top-10 left-[1800px] w-[450px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-100 rounded-lg text-[#14B8A6]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="6" cy="6" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                  <circle cx="6" cy="18" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Post & Story</h2>
            </div>

            {/* Story Structure */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-4">Narrative Arc</h3>
              <div className="relative pl-4 border-l-2 border-gray-200 space-y-6">
                {[
                  { title: 'Act 1: The Discovery', desc: 'Introduce Elena and the missing box. The mystery is established.', active: true },
                  { title: 'Act 2: The Investigation', desc: 'Following paper trails. Dead ends. The threat level rises.', active: false },
                  { title: 'Act 3: The Truth', desc: 'Confrontation with City Hall. Final revelation.', active: false },
                ].map((act) => (
                  <div key={act.title} className="relative">
                    <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full ${act.active ? 'bg-[#14B8A6]' : 'bg-gray-300'} ring-4 ring-white`}></div>
                    <p className={`text-sm font-semibold ${act.active ? 'text-gray-900' : 'text-gray-500'}`}>{act.title}</p>
                    <p className={`text-xs mt-0.5 ${act.active ? 'text-gray-500' : 'text-gray-400'}`}>{act.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Transcription Tracker */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
                <span>Transcripts</span>
                <span className="text-[10px] text-[#14B8A6] font-bold bg-teal-50 px-2 rounded-full">Rev.com</span>
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'Elena_Interview_01.mp4', status: 'DONE', color: 'green' },
                  { name: 'Library_Walkthrough.mp3', status: 'PROCESSING', color: 'yellow' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                    <span className="text-gray-700 font-medium">{item.name}</span>
                    <span className={`text-${item.color}-600 font-bold`}>{item.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fact Checking */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 border border-gray-100 draggable border-red-100 border-l-4 border-l-red-400">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="text-red-500">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22s8-4 8-10V5l-8-3l-8 3v7c0 6 8 10 8 10"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 12l2 2l4-4"></path>
                </svg>
                Fact Verification
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                {['Verify date of fire (1984 vs 1985)', "Confirm spelling of 'Kowalski'"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-red-500 focus:ring-red-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SECTION 5: DISTRIBUTION */}
          <div className="absolute top-10 left-[2400px] w-[380px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-teal-100 rounded-lg text-[#14B8A6]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                  <line x1="2" x2="22" y1="12" y2="12" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a15.3 15.3 0 0 1 4 10a15.3 15.3 0 0 1-4 10a15.3 15.3 0 0 1-4-10a15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Distribution</h2>
            </div>

            {/* Festival Strategy */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3">Festival Strategy</h3>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-3">
                <div className="text-[10px] uppercase font-bold text-gray-500">Premiere Goal</div>
                <div className="text-lg font-bold text-[#14B8A6]">Sundance 2025</div>
                <div className="text-xs text-gray-600">Deadline: Sept 2024</div>
              </div>
              <div className="space-y-1">
                {[
                  { name: 'True/False', date: 'Dec 15' },
                  { name: 'IDFA', date: 'July 01' },
                ].map((festival) => (
                  <div key={festival.name} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 text-xs">
                    <span className="font-medium text-gray-700">{festival.name}</span>
                    <span className="text-gray-400">{festival.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3">Deliverables</h3>
              <div className="space-y-2">
                {['DCP (4K)', 'Closed Captions', 'Music Cue Sheet', 'E&O Insurance'].map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="text-[#14B8A6] focus:ring-[#14B8A6] rounded" />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            {/* Impact Note */}
            <div className="absolute -left-10 top-[400px] bg-blue-100 p-4 w-40 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] rotate-2 rounded-sm border-t-8 border-blue-200/50 draggable text-gray-800">
              <p className="text-xs leading-relaxed font-semibold">📢 Partner with local historical societies for the launch screening.</p>
            </div>
          </div>

          {/* Floating Tip */}
          <div className="absolute top-[600px] left-[900px] bg-white p-3 rounded-lg shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] rotate-1 border border-teal-200 draggable z-10 flex gap-3 items-start max-w-xs">
            <div className="bg-teal-100 p-1.5 rounded-full text-[#14B8A6] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 14c.2-1 .7-1.7 1.5-2.5c1-1 1.5-2.4 1.5-3.8c0-3.2-2.7-5.7-6-5.7s-6 2.5-6 5.7c0 1.4.5 2.8 1.5 3.8c.8.8 1.3 1.5 1.5 2.5"></path>
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 18h6"></path>
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 22h4"></path>
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Story Evolution</p>
              <p className="text-[10px] text-gray-500 leading-tight mt-1">
                Documentaries change in the edit. Don't be afraid to rewrite Act 3 if the footage tells a different story.
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
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 18l-1.5-1.5"></path>
                  <circle cx="5" cy="14" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-bold text-center text-gray-900 mb-2">Documentary Template</h2>
            <p className="text-center text-gray-500 mb-8 leading-relaxed">
              A workspace designed for investigation and discovery. Organize your research, track your subjects, and build your narrative arc.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-[#14B8A6] hover:bg-[#0F766E] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95"
              >
                Start Investigation
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-3 bg-white text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Load Example Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

