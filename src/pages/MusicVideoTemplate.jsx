import { useState, useEffect, useRef } from 'react';

export default function MusicVideoTemplate() {
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
          <div className="flex items-center gap-2 text-[#F97316]">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" className="text-[#F97316]">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
              <circle cx="18" cy="16" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
            </svg>
            <span className="font-serif font-bold text-lg tracking-tight text-gray-900">Flow Pro</span>
          </div>
          <div className="h-4 w-px bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Projects /</span>
            <span className="text-sm font-semibold text-gray-900">Neon Nights</span>
            <span className="px-2 py-0.5 rounded-full bg-orange-50 text-[#F97316] text-[10px] font-bold tracking-wide uppercase border border-orange-100">
              Music Video
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-xs font-bold text-purple-600">
              DR
            </div>
            <div className="w-8 h-8 rounded-full bg-pink-100 border-2 border-white flex items-center justify-center text-xs font-bold text-pink-600">
              MK
            </div>
            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14m-7-7v14"></path>
              </svg>
            </div>
          </div>
          <button className="px-3 py-1.5 bg-[#F97316] text-white text-sm font-medium rounded-md hover:bg-[#EA580C] transition-colors shadow-sm">
            Share
          </button>
        </div>
      </header>

      {/* Toolbar */}
      <div className="absolute left-4 top-20 flex flex-col gap-2 bg-white p-1.5 rounded-lg shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-[#E5E5E5] z-30">
        <button className="p-2 hover:bg-gray-50 rounded-md text-[#F97316] transition-colors" title="Select">
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
        <div className="relative w-[3400px] h-[1400px] p-10 transform origin-top-left">
          {/* SVG Connections Layer */}
          <svg className="absolute inset-0 pointer-events-none z-0 opacity-20" width="100%" height="100%">
            <path d="M480 200 C 550 200, 550 200, 620 200" stroke="#F97316" strokeWidth="2" fill="none" strokeDasharray="5,5"></path>
            <path d="M1080 200 C 1150 200, 1150 200, 1220 200" stroke="#F97316" strokeWidth="2" fill="none" strokeDasharray="5,5"></path>
            <path d="M1680 200 C 1750 200, 1750 200, 1820 200" stroke="#F97316" strokeWidth="2" fill="none" strokeDasharray="5,5"></path>
            <path d="M2280 200 C 2350 200, 2350 200, 2420 200" stroke="#F97316" strokeWidth="2" fill="none" strokeDasharray="5,5"></path>
          </svg>

          {/* SECTION 1: CONCEPT & CREATIVE */}
          <div className="absolute top-10 left-10 w-[450px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg text-[#F97316]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m12 8l-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"></path>
                  <circle cx="17" cy="7" r="5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Concept & Creative</h2>
            </div>

            {/* Music & Artist Info */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable group hover:border-[#F97316]/30 transition-colors">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="text-[#F97316]">
                    <circle cx="8" cy="18" r="4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18V2l7 4"></path>
                  </svg>
                  Track Info
                </h3>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Song Title</label>
                    <input
                      type="text"
                      defaultValue="Neon Nights"
                      className="w-full text-sm font-medium border-b border-gray-200 py-1 focus:outline-none focus:border-[#F97316] bg-transparent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Artist</label>
                    <input
                      type="text"
                      defaultValue="The Midnight Echo"
                      className="w-full text-sm font-medium border-b border-gray-200 py-1 focus:outline-none focus:border-[#F97316] bg-transparent"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Genre</label>
                    <select className="w-full text-xs py-1 bg-transparent border-b border-gray-200 outline-none text-gray-600">
                      <option>Synthwave</option>
                      <option>Pop</option>
                      <option>Rock</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Energy</label>
                    <div className="w-full h-1 bg-gray-100 mt-2 rounded overflow-hidden">
                      <div className="h-full bg-[#F97316] w-3/4"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Key Lyrics / Hook</label>
                  <p className="text-xs text-gray-600 italic mt-1 font-mono bg-gray-50 p-2 rounded">
                    "Driving through the city lights, we never sleep..."
                  </p>
                </div>
              </div>
            </div>

            {/* Creative Treatment */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-2">Creative Treatment</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-bold text-[#F97316] uppercase">Visual Concept</span>
                  <p className="text-sm text-gray-600 mt-1">
                    Retro-futuristic drive through a sleepless city. High contrast, neon spills, motion blur.
                  </p>
                </div>
                <div>
                  <span className="text-xs font-bold text-[#F97316] uppercase">Performance Scenes</span>
                  <ul className="text-xs text-gray-600 mt-1 list-disc list-inside">
                    <li>Rooftop with city bokeh (Night)</li>
                    <li>Vintage car interior (Moving)</li>
                    <li>Tunnel walk (Silhouette)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Moodboard */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">Visual References</h3>
              <div className="grid grid-cols-3 gap-2 h-32">
                {['Neon', 'Car', 'Bokeh'].map((ref) => (
                  <div
                    key={ref}
                    className="bg-gray-100 rounded md flex items-center justify-center border border-dashed border-gray-300 text-gray-400 text-[10px]"
                  >
                    {ref}
                  </div>
                ))}
              </div>
            </div>

            {/* Color Palette */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-4 mt-4 border border-gray-100 draggable flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#0F172A]"></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#D946EF]"></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-[#3B82F6]"></div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700">Cyberpunk Palette</p>
                <p className="text-[10px] text-gray-400">High contrast / Night</p>
              </div>
            </div>

            {/* Artist Note */}
            <div className="absolute -right-12 top-80 bg-pink-200 p-4 w-40 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] rotate-3 rounded-sm border-t-8 border-pink-300/50 draggable text-gray-800">
              <p className="text-xs leading-relaxed font-semibold">
                Artist request: Wants a "Blade Runner" feel but make it fashion. No green lights.
              </p>
            </div>
          </div>

          {/* SECTION 2: VISUAL PLANNING */}
          <div className="absolute top-10 left-[600px] w-[450px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg text-[#F97316]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.2 6L3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Zm-14-.7l3.1 3.9m3.1-5.8l3.1 4M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"></path>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Visual Planning</h2>
            </div>

            {/* Shot Breakdown */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3">Beat Breakdown</h3>
              <div className="space-y-4 relative">
                <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-100"></div>

                {[
                  { color: 'bg-green-400', title: 'Intro (0:00-0:15)', desc: 'Wide establishing city shots. Slow push in. Artist in silhouette.' },
                  { color: 'bg-blue-400', title: 'Verse 1 (0:15-0:45)', desc: 'Steady cam. Intimate close-ups inside car. Eye contact with lens.' },
                  { color: 'bg-orange-500', title: 'Chorus (0:45-1:15)', desc: 'Handheld energy. Quick cuts. Rooftop performance. Flares.' },
                ].map((beat) => (
                  <div key={beat.title} className="relative pl-6">
                    <div className={`absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white ${beat.color} shadow-sm`}></div>
                    <h4 className="text-xs font-bold text-gray-900 uppercase">{beat.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{beat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Storyboard Cards */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { shot: 'Shot 1 • 24mm', time: '0:00', desc: 'Wide dolly in, city skyline.' },
                { shot: 'Shot 2 • 50mm', time: '0:05', desc: 'MCU Artist profile, neon light hit.' },
              ].map((card) => (
                <div key={card.shot} className="bg-orange-50 rounded-xl p-3 border border-orange-100 draggable shadow-sm">
                  <div className="aspect-video bg-white rounded border border-orange-100 mb-2 flex items-center justify-center text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                      <rect width="18" height="18" x="3" y="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" rx="2" ry="2"></rect>
                      <circle cx="9" cy="9" r="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                      <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                    </svg>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-orange-800">{card.shot}</span>
                    <span className="text-[10px] text-orange-600">{card.time}</span>
                  </div>
                  <p className="text-[10px] text-gray-600 mt-1">{card.desc}</p>
                </div>
              ))}
            </div>

            {/* Camera Movement */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm">Camera Plan</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-2 bg-gray-50 rounded border border-gray-100 text-center">
                  <div className="text-xs font-bold text-gray-700">Verses</div>
                  <div className="text-[10px] text-gray-500 mt-1">Gimbal / Smooth</div>
                </div>
                <div className="p-2 bg-gray-50 rounded border border-gray-100 text-center">
                  <div className="text-xs font-bold text-gray-700">Chorus</div>
                  <div className="text-[10px] text-gray-500 mt-1">Handheld / Shaky</div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: PRODUCTION */}
          <div className="absolute top-10 left-[1200px] w-[450px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg text-[#F97316]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m22 8l-6 4l6 4V8Z"></path>
                  <rect width="14" height="12" x="2" y="6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" rx="2" ry="2"></rect>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Production</h2>
            </div>

            {/* Shoot Schedule */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable border-l-4 border-l-[#F97316]">
              <h3 className="font-semibold text-gray-800 mb-3 flex justify-between">
                <span>Day 1 Schedule</span>
                <span className="text-xs font-normal text-gray-500">Oct 24</span>
              </h3>
              <div className="space-y-4">
                {[
                  { time: '14:00', title: 'Call Time & Setup', desc: 'Location A: Studio Loft' },
                  { time: '15:30', title: 'Setup A: Performance', desc: 'Full track playback x3' },
                  { time: '18:45', title: 'Golden Hour / Rooftop', desc: 'Move to Location B' },
                ].map((item, idx) => (
                  <div key={idx} className={`flex gap-3 text-sm ${idx < 2 ? 'border-b border-gray-50 pb-2' : ''}`}>
                    <span className="font-mono font-bold text-gray-400 text-xs mt-0.5">{item.time}</span>
                    <div>
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment Checklist */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">Gear Check</h3>
                <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded font-medium">Rental Pending</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  { label: 'A-Cam (Alexa)', checked: true },
                  { label: 'Hazer', checked: true },
                  { label: 'Easyrig', checked: false },
                  { label: 'Playback Speaker', checked: true },
                  { label: 'Astera Tubes (4)', checked: false },
                  { label: 'Generator', checked: false },
                ].map((item) => (
                  <label key={item.label} className="flex items-center gap-2 text-xs text-gray-600">
                    <input
                      type="checkbox"
                      defaultChecked={item.checked}
                      className="text-[#F97316] focus:ring-[#F97316] rounded"
                    />
                    {item.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Crew List */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3">Key Crew</h3>
              <div className="text-sm grid grid-cols-[1fr_1.5fr] gap-y-2">
                <span className="text-gray-500">Director</span>
                <span className="text-gray-900 font-medium">S. Spiel</span>
                <span className="text-gray-500">D.P.</span>
                <span className="text-gray-900 font-medium">R. Deakins</span>
                <span className="text-gray-500">HMU</span>
                <span className="text-gray-900 font-medium">L. Makeup</span>
              </div>
            </div>

            {/* Daily Note */}
            <div className="absolute -right-8 bottom-10 bg-pink-200 p-4 w-40 h-40 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] -rotate-2 rounded-sm border-t-8 border-pink-300/50 draggable text-gray-800 flex items-center justify-center text-center">
              <p className="text-sm font-semibold">🎵 Don't forget the loud speaker for playback!</p>
            </div>
          </div>

          {/* SECTION 4: POST-PRODUCTION */}
          <div className="absolute top-10 left-[1800px] w-[450px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg text-[#F97316]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="6" cy="6" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                  <circle cx="6" cy="18" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"></path>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Post-Production</h2>
            </div>

            {/* Edit Timeline */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-4">Edit Schedule</h3>
              <div className="relative pl-4 border-l-2 border-gray-200 space-y-6">
                {[
                  { active: true, title: 'Sync & Assembly', desc: 'Week 1 • Sync to master audio' },
                  { active: false, title: 'Rough Cut (Artist View)', desc: 'Week 2 • Focus on performance' },
                  { active: false, title: 'Color & Final Polish', desc: 'Week 3 • Style pass' },
                ].map((item) => (
                  <div key={item.title} className="relative">
                    <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full ${item.active ? 'bg-[#F97316]' : 'bg-gray-200'} ring-4 ring-white`}></div>
                    <p className={`text-sm ${item.active ? 'font-semibold text-gray-900' : 'font-medium text-gray-400'}`}>{item.title}</p>
                    <p className={`text-xs ${item.active ? 'text-gray-500' : 'text-gray-400'}`}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* VFX & Clean up */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="text-[#F97316]">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 2l-5 5m-2-3l-2 2m9-5l-2 2m-2-3l-2 2m-7 8l5-5l4 4l-5 5L3 21l2-2l-2-2Zm2-6l5-5l2 2l-5 5Z"></path>
                </svg>
                VFX & Graphics
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                {[
                  'Remove safety wire (Shot 12)',
                  'Sky replacement (Rooftop scene)',
                  'Add Title Card (Retro font)',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-[#F97316]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SECTION 5: RELEASE & PROMOTION */}
          <div className="absolute top-10 left-[2400px] w-[380px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg text-[#F97316]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-9a22.14 22.14 0 0 1 9 2a22 22 0 0 1 2 9a22 22 0 0 1-9 2zm5-4l-3-3"></path>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Release & Promo</h2>
            </div>

            {/* Release Plan */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3">Launch Strategy</h3>
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-3">
                <div className="text-[10px] uppercase font-bold text-gray-500">Release Date</div>
                <div className="text-lg font-bold text-[#F97316]">Friday, Nov 15</div>
                <div className="text-xs text-gray-600">12:00 PM EST (YouTube Premiere)</div>
              </div>
              <div className="space-y-2">
                {[
                  { icon: 'youtube', label: 'YouTube Main', badge: 'Primary', badgeColor: 'bg-green-100 text-green-700' },
                  { icon: 'instagram', label: 'Reels / TikTok', badge: 'Teasers', badgeColor: 'text-gray-500' },
                ].map((platform) => (
                  <div
                    key={platform.label}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors cursor-pointer border border-transparent hover:border-gray-200"
                  >
                    <span className="text-sm font-medium flex gap-2 items-center">
                      {platform.icon === 'youtube' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.5 17a24.12 24.12 0 0 1 0-10a2 2 0 0 1 1.72-1.72a48.27 48.27 0 0 1 15.56 0a2 2 0 0 1 1.72 1.72a24.12 24.12 0 0 1 0 10a2 2 0 0 1-1.72 1.72a48.27 48.27 0 0 1-15.56 0a2 2 0 0 1-1.72-1.72"></path>
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m10 15l5-3l-5-3z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                          <rect width="20" height="20" x="2" y="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" rx="5" ry="5"></rect>
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11.37A4 4 0 1 1 12.63 8A4 4 0 0 1 16 11.37"></path>
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                        </svg>
                      )}
                      {platform.label}
                    </span>
                    <span className={`text-[10px] ${platform.badgeColor} ${platform.badgeColor.includes('bg-') ? 'px-1.5 py-0.5 rounded' : ''}`}>
                      {platform.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Deliverables Check */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 border border-gray-100 draggable">
              <h3 className="font-semibold text-gray-800 mb-3">Assets Needed</h3>
              <div className="space-y-2">
                {[
                  '4K Master (ProRes)',
                  'YouTube Thumbnail',
                  '3x Vertical Teasers',
                  'Spotify Canvas (Loop)',
                ].map((asset) => (
                  <label key={asset} className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" className="text-[#F97316] focus:ring-[#F97316] rounded" />
                    {asset}
                  </label>
                ))}
              </div>
            </div>

            {/* Promo Note */}
            <div className="absolute -left-10 top-[400px] bg-pink-200 p-4 w-40 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] rotate-2 rounded-sm border-t-8 border-pink-300/50 draggable text-gray-800">
              <p className="text-xs leading-relaxed font-semibold">⚡ Capture vertical BTS on set for TikTok!! Don't forget!</p>
            </div>
          </div>

          {/* Floating Tip */}
          <div className="absolute top-[500px] left-[700px] bg-white p-3 rounded-lg shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] -rotate-1 border border-[#F97316]/20 draggable z-10 flex gap-3 items-start max-w-xs">
            <div className="bg-orange-100 p-1.5 rounded-full text-[#F97316] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Energy Match</p>
              <p className="text-[10px] text-gray-500 leading-tight mt-1">
                Ensure the edit pace matches the BPM of the track. Cut on the snare.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Welcome Modal Overlay */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#F97316] to-pink-500"></div>

            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-[#F97316]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 18V5l12-2v13"></path>
                  <circle cx="6" cy="18" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                  <circle cx="18" cy="16" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-bold text-center text-gray-900 mb-2">Music Video Template</h2>
            <p className="text-center text-gray-500 mb-8 leading-relaxed">
              Ready to shoot? We've set up your visual workflow. Organize your shot list, sync your crew, and plan your release strategy all in one place.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setShowWelcomeModal(false)}
                className="w-full py-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95"
              >
                Start Production
              </button>
              <button
                onClick={() => setShowWelcomeModal(false)}
                className="w-full py-3 bg-white text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Customize Workflow
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

