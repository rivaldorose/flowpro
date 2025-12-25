import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

export default function ShortFilmTemplate() {
  const navigate = useNavigate();
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const main = canvasRef.current;
    if (!main) return;

    const handleMouseDown = (e) => {
      // Only drag if clicking on background, not cards
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
    <AppLayout>
      <div className="h-[calc(100vh-3.5rem)] overflow-hidden bg-[#F5F5F4] text-[#1F2937] flex flex-col">
        {/* Top Navigation Bar */}
        <header className="h-14 bg-white border-b border-[#E5E5E5] flex items-center justify-between px-4 z-40 shrink-0">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 text-[#6B46C1]">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="text-[#6B46C1]">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.2 6L3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Zm-14-.7l3.1 3.9m3.1-5.8l3.1 4M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"></path>
              </svg>
              <span className="font-serif font-bold text-lg tracking-tight text-gray-900">Flow Pro</span>
            </div>
            <div className="h-4 w-px bg-gray-200"></div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Templates /</span>
              <span className="text-sm font-semibold text-gray-900">Short Film Template</span>
              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-[#6B46C1] text-[10px] font-bold tracking-wide uppercase border border-purple-100">
                Preview
              </span>
            </div>
          </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-xs font-bold text-orange-600">
              JD
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-xs font-bold text-blue-600">
              AL
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7-7v14"></path>
              </svg>
            </div>
          </div>
          <button className="px-3 py-1.5 bg-[#6B46C1] text-white text-sm font-medium rounded-md hover:bg-[#553C9A] transition-colors">
            Share
          </button>
        </div>
      </header>
    </AppLayout>

      {/* Toolbar */}
      <div className="absolute left-4 top-20 flex flex-col gap-2 bg-white p-1.5 rounded-lg shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-[#E5E5E5] z-30">
        <button className="p-2 hover:bg-gray-50 rounded-md text-[#6B46C1] transition-colors" title="Select">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m12 6l-6 13.5l3.5-1.5l2.5 5l2.5-5l3.5 1.5Z"></path>
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-50 rounded-md text-gray-500 transition-colors" title="Note">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"></path>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 3v6h6"></path>
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-50 rounded-md text-gray-500 transition-colors" title="Image">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <rect width="18" height="18" x="3" y="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" rx="2" ry="2"></rect>
            <circle cx="9" cy="9" r="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></circle>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-50 rounded-md text-gray-500 transition-colors" title="Connect">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 12h14m-7-7l7 7l-7 7"></path>
          </svg>
        </button>
      </div>

      {/* Main Canvas Area */}
      <main
        ref={canvasRef}
        className="flex-1 overflow-auto relative bg-[#F5F5F4]"
        style={{
          backgroundImage: 'radial-gradient(#A8A29E 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Infinite Canvas Container */}
        <div className="relative w-[2800px] h-[1400px] p-10 transform origin-top-left">
          {/* SVG Connections Layer (Background) */}
          <svg className="absolute inset-0 pointer-events-none z-0 opacity-20" width="100%" height="100%">
            <path d="M480 200 C 550 200, 550 200, 620 200" stroke="#6B46C1" strokeWidth="2" fill="none" strokeDasharray="5,5"></path>
            <path d="M1080 200 C 1150 200, 1150 200, 1220 200" stroke="#6B46C1" strokeWidth="2" fill="none" strokeDasharray="5,5"></path>
            <path d="M1680 200 C 1750 200, 1750 200, 1820 200" stroke="#6B46C1" strokeWidth="2" fill="none" strokeDasharray="5,5"></path>
            <path d="M2280 200 C 2350 200, 2350 200, 2420 200" stroke="#6B46C1" strokeWidth="2" fill="none" strokeDasharray="5,5"></path>
          </svg>

          {/* SECTION 1: CONCEPT & DEVELOPMENT */}
          <div className="absolute top-10 left-10 w-[450px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#6B46C1]/10 rounded-lg text-[#6B46C1]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 14c.2-1 .7-1.7 1.5-2.5c1-1 1.5-2.4 1.5-3.8c0-3.2-2.7-6-6-6c-3.2 0-6 2.7-6 6c0 1.4.5 2.8 1.5 3.8c.8.8 1.3 1.5 1.5 2.5m-4 3h6m-5.4 3h4.8m-1.2 3h-2.4"></path>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Concept & Development</h2>
            </div>

            {/* Project Overview */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable group hover:border-[#6B46C1]/30 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-800">Project Overview</h3>
                <button className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Working Title</label>
                  <input
                    type="text"
                    defaultValue="The Last Train Home"
                    className="w-full text-sm font-medium border-b border-dashed border-gray-300 py-1 focus:outline-none focus:border-[#6B46C1] bg-transparent"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Genre</label>
                    <select className="w-full text-xs py-1 bg-transparent border-b border-gray-200 outline-none">
                      <option>Drama</option>
                      <option>Sci-Fi</option>
                      <option>Horror</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Duration</label>
                    <input
                      type="text"
                      defaultValue="12 mins"
                      className="w-full text-xs border-b border-gray-200 py-1 bg-transparent outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Logline</label>
                  <textarea
                    className="w-full text-sm text-gray-600 border-none bg-gray-50 rounded p-2 mt-1 resize-none h-20 focus:ring-1 focus:ring-[#6B46C1] outline-none"
                    defaultValue="A weary commuter discovers his late-night train ride is looping through his own memories."
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Story Concept */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-2">Story Concept</h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-sm text-gray-600">
                  <strong>Theme:</strong> Regret and the inability to let go.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Inspiration:</strong> "Eternal Sunshine", "Groundhog Day", suburban isolation.
                </p>
              </div>
            </div>

            {/* Moodboard */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="text-[#6B46C1]">
                  <rect width="18" height="18" x="3" y="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" rx="2" ry="2"></rect>
                  <circle cx="9" cy="9" r="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
                Visual Inspiration
              </h3>
              <div className="grid grid-cols-2 gap-2 h-40">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="bg-gray-100 rounded-lg flex items-center justify-center border border-dashed border-gray-300 text-gray-400 text-xs"
                  >
                    Drop Image
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Note */}
            <div className="absolute -right-10 bottom-20 bg-yellow-100 p-4 w-40 h-40 shadow-md rotate-2 rounded-sm border-t-8 border-yellow-200/50 draggable">
              <p className="text-xs text-yellow-900 leading-relaxed font-medium">
                Idea: Maybe the train conductor is his older self?
              </p>
            </div>
          </div>

          {/* SECTION 2: PRE-PRODUCTION */}
          <div className="absolute top-10 left-[600px] w-[450px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#6B46C1]/10 rounded-lg text-[#6B46C1]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2Z"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 2v6h6m-4 5H8m8 4H8m2-8H8"></path>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Pre-Production</h2>
            </div>

            {/* Script Card */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] mb-4 overflow-hidden border border-gray-200 draggable group">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Screenplay</span>
                <span className="text-xs text-[#6B46C1] font-medium cursor-pointer hover:underline">Open Editor</span>
              </div>
              <div className="p-6 font-mono text-sm leading-relaxed text-gray-800 bg-white">
                <p className="mb-4 font-bold">INT. TRAIN CAR - NIGHT</p>
                <p className="mb-4">The fluorescent lights FLICKER. A low hum of the engine.</p>
                <p className="mb-2">JAMES (30s) stares at his reflection in the dark window.</p>
                <div className="ml-8 mb-4">
                  <p className="uppercase mb-1">James</p>
                  <p>I missed it. I missed the stop.</p>
                </div>
                <p>He stands up. The car is empty.</p>
              </div>
              <div className="bg-gray-50 p-2 text-center border-t border-gray-100 text-xs text-gray-400 group-hover:text-[#6B46C1] transition-colors cursor-pointer">
                + Add Scene
              </div>
            </div>

            {/* Location Scouting */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3">Locations</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center bg-gray-50">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-900">Subway Car</span>
                      <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Secured</span>
                    </div>
                    <p className="text-xs text-gray-500">Renting standing set at Studio B</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center bg-gray-50"></div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-900">Apartment (Bedroom)</span>
                      <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">Scouting</span>
                    </div>
                    <p className="text-xs text-gray-500">Looking for high ceilings</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Storyboard */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">Storyboard: Sc 1</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="aspect-video bg-gray-200 rounded overflow-hidden relative group">
                  <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1 rounded">Wide</div>
                </div>
                <div className="aspect-video bg-gray-200 rounded overflow-hidden relative">
                  <div className="absolute bottom-1 right-1 bg-black/50 text-white text-[10px] px-1 rounded">MCU</div>
                </div>
              </div>
              <button className="w-full mt-3 py-1.5 text-xs text-gray-500 border border-dashed border-gray-300 rounded hover:bg-gray-50 transition-colors">
                Add Frames
              </button>
            </div>
          </div>

          {/* SECTION 3: PRODUCTION */}
          <div className="absolute top-10 left-[1200px] w-[450px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#6B46C1]/10 rounded-lg text-[#6B46C1]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                  <circle cx="12" cy="13" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Production</h2>
            </div>

            {/* Shooting Schedule */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable border-l-4 border-l-[#6B46C1]">
              <h3 className="font-semibold text-gray-800 mb-3 flex justify-between">
                <span>Day 1 Schedule</span>
                <span className="text-xs font-normal text-gray-500">Nov 12</span>
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3 text-sm">
                  <span className="font-mono font-bold text-gray-400 text-xs mt-0.5">08:00</span>
                  <div>
                    <p className="font-medium text-gray-900">Crew Call / Setup</p>
                    <p className="text-xs text-gray-500">Location: Studio B</p>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="font-mono font-bold text-gray-400 text-xs mt-0.5">09:30</span>
                  <div>
                    <p className="font-medium text-gray-900">Scene 1 - Train Car</p>
                    <p className="text-xs text-gray-500">Int. Night (Simulated)</p>
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <span className="font-mono font-bold text-gray-400 text-xs mt-0.5">13:00</span>
                  <div>
                    <p className="font-medium text-gray-900">Lunch</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shot List Checklist */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">Shot List</h3>
                <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">0/5 Done</span>
              </div>
              <div className="space-y-2">
                {['1A - Master Wide (Dolly)', '1B - Med. James (50mm)', '1C - CU Reflection (85mm)', '1D - Insert: Hand on glass'].map((shot) => (
                  <label key={shot} className="flex items-center gap-2 group cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#6B46C1] focus:ring-[#6B46C1]" />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900">{shot}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Crew Contacts */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3">Crew Heads</h3>
              <div className="text-sm grid grid-cols-[1fr_auto] gap-y-2 gap-x-4">
                <span className="text-gray-500">Director</span>
                <span className="text-gray-900 font-medium">J. Doe</span>
                <span className="text-gray-500">D.P.</span>
                <span className="text-gray-900 font-medium">A. Smith</span>
                <span className="text-gray-500">Sound</span>
                <span className="text-gray-900 font-medium">M. Jones</span>
              </div>
            </div>
          </div>

          {/* SECTION 4: POST-PRODUCTION */}
          <div className="absolute top-10 left-[1800px] w-[450px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#6B46C1]/10 rounded-lg text-[#6B46C1]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="6" cy="6" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                  <circle cx="6" cy="18" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Post-Production</h2>
            </div>

            {/* Timeline Status */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-4">Post Timeline</h3>
              <div className="relative pl-4 border-l-2 border-gray-200 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-[#6B46C1] ring-4 ring-white"></div>
                  <p className="text-sm font-semibold text-gray-900">Assembly Cut</p>
                  <p className="text-xs text-gray-500">Due: Nov 25</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gray-200 ring-4 ring-white"></div>
                  <p className="text-sm font-medium text-gray-400">Rough Cut</p>
                  <p className="text-xs text-gray-400">Due: Dec 05</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-gray-200 ring-4 ring-white"></div>
                  <p className="text-sm font-medium text-gray-400">Picture Lock</p>
                  <p className="text-xs text-gray-400">Due: Dec 15</p>
                </div>
              </div>
            </div>

            {/* VFX Notes */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="text-[#6B46C1]">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 2l-5 5m-2-3l-2 2m9-5l-2 2m-2-3l-2 2m-7 8l5-5l4 4l-5 5L3 21l2-2l-2-2Zm2-6l5-5l2 2l-5 5Z"></path>
                </svg>
                VFX Needs
              </h3>
              <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                <li>Scene 1: Window reflection composite</li>
                <li>Scene 3: Remove safety cables</li>
                <li>Title Card Animation</li>
              </ul>
            </div>
          </div>

          {/* SECTION 5: DISTRIBUTION */}
          <div className="absolute top-10 left-[2400px] w-[350px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#6B46C1]/10 rounded-lg text-[#6B46C1]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-9a22.14 22.14 0 0 1 9 2a22 22 0 0 1 2 9a22 22 0 0 1-9 2zm5-4l-3-3"></path>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Distribution</h2>
            </div>

            {/* Festivals */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3">Festival Strategy</h3>
              <div className="space-y-2">
                {[
                  { name: 'Sundance', date: 'Sept 15' },
                  { name: 'SXSW', date: 'Oct 01' },
                  { name: 'Tribeca', date: 'Nov 10' },
                ].map((festival) => (
                  <div key={festival.name} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                    <span className="text-sm font-medium">{festival.name}</span>
                    <span className="text-[10px] text-gray-500">{festival.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating Helpers */}
          <div className="absolute top-[500px] left-[100px] bg-yellow-100 p-4 w-52 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] -rotate-2 rounded-sm border-t-[6px] border-yellow-200/50 draggable cursor-help z-10">
            <p className="text-sm text-yellow-900 font-medium leading-snug">
              💡 <strong>Tip:</strong> This canvas is your workspace. Drag cards around, delete what you don't need, and add new notes from the toolbar!
            </p>
          </div>

          <div className="absolute top-[500px] left-[1300px] bg-yellow-100 p-4 w-52 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] rotate-1 rounded-sm border-t-[6px] border-yellow-200/50 draggable cursor-help z-10">
            <p className="text-sm text-yellow-900 font-medium leading-snug">
              🎬 <strong>Production:</strong> Use the "Shot List" card to track your daily progress on set.
            </p>
          </div>
        </div>
      </main>

      {/* Welcome Modal Overlay */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#6B46C1] to-orange-400"></div>

            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-[#F3E8FF] rounded-full flex items-center justify-center text-[#6B46C1]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                  <rect width="20" height="20" x="2" y="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" rx="2.18" ry="2.18"></rect>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 2v20M17 2v20M2 12h20M2 7h5M2 17h5M17 17h5M17 7h5"></path>
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-bold text-center text-gray-900 mb-2">Short Film Template</h2>
            <p className="text-center text-gray-500 mb-8 leading-relaxed">
              We've set up a professional workflow for your project. From script to screen, organize your entire production in one infinite canvas.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setShowWelcomeModal(false)}
                className="w-full py-3 bg-[#6B46C1] hover:bg-[#553C9A] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95"
              >
                Start Creating
              </button>
              <button
                onClick={() => setShowWelcomeModal(false)}
                className="w-full py-3 bg-white text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                I'll set it up myself
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AppLayout>
  );
}

