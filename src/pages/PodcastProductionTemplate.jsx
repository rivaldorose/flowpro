import { useState, useEffect, useRef } from 'react';

export default function PodcastProductionTemplate() {
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
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m12 8l-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"></path>
              <circle cx="17" cy="7" r="5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
            </svg>
            <span className="font-serif font-bold text-lg tracking-tight text-gray-900">Flow Pro</span>
          </div>
          <div className="h-4 w-px bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Project /</span>
            <span className="text-sm font-semibold text-gray-900">Tech Founders Unfiltered</span>
            <span className="px-2 py-0.5 rounded-full bg-orange-50 text-[#F97316] text-[10px] font-bold tracking-wide uppercase border border-orange-100">
              Weekly Series
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-600">
              ME
            </div>
            <div className="w-8 h-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-xs font-bold text-orange-600">
              TM
            </div>
          </div>
          <button className="px-3 py-1.5 bg-[#F97316] text-white text-sm font-medium rounded-md hover:bg-[#C2410C] transition-colors shadow-sm flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 11a9 9 0 0 1 9 9"></path>
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4a16 16 0 0 1 16 16"></path>
              <circle cx="5" cy="19" r="1" fill="currentColor" stroke="none"></circle>
            </svg>
            Publish Episode
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
        <button className="p-2 hover:bg-gray-50 rounded-md text-gray-500 transition-colors" title="Plan">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <rect width="18" height="18" x="3" y="4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" rx="2" ry="2"></rect>
            <line x1="16" x2="16" y1="2" y2="6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></line>
            <line x1="8" x2="8" y1="2" y2="6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></line>
            <line x1="3" x2="21" y1="10" y2="10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></line>
          </svg>
        </button>
        <button className="p-2 hover:bg-gray-50 rounded-md text-gray-500 transition-colors" title="Record">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" x2="12" y1="19" y2="22" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"></line>
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
        ref={canvasRef}
        className="flex-1 overflow-auto relative bg-[#F5F5F4]"
        style={{
          backgroundImage: 'linear-gradient(#E5E5E5 1px, transparent 1px), linear-gradient(90deg, #E5E5E5 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      >
        {/* Infinite Canvas Container */}
        <div className="relative w-[3200px] h-[1600px] p-10 transform origin-top-left">
          {/* SVG Connections Layer */}
          <svg className="absolute inset-0 pointer-events-none z-0 opacity-20" width="100%" height="100%">
            <path d="M500 200 C 550 200, 600 200, 650 200" stroke="#F97316" strokeWidth="2" fill="none" strokeDasharray="4,4"></path>
            <path d="M1150 200 C 1200 200, 1250 200, 1300 200" stroke="#F97316" strokeWidth="2" fill="none" strokeDasharray="4,4"></path>
            <path d="M1750 200 C 1800 200, 1850 200, 1900 200" stroke="#F97316" strokeWidth="2" fill="none" strokeDasharray="4,4"></path>
            <path d="M2350 200 C 2400 200, 2450 200, 2500 200" stroke="#F97316" strokeWidth="2" fill="none" strokeDasharray="4,4"></path>
          </svg>

          {/* SECTION 1: PODCAST CONCEPT */}
          <div className="absolute top-10 left-10 w-[450px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg text-[#F97316]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Podcast Concept</h2>
            </div>

            {/* Show Overview */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable group hover:border-[#F97316]/30 transition-colors">
              <h3 className="font-bold text-sm text-gray-900 mb-3 border-b border-gray-100 pb-2">🎙️ Show Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Title</span>
                    <div className="text-sm font-semibold text-gray-800">Tech Founders Unfiltered</div>
                  </div>
                  <span className="bg-orange-50 text-[#F97316] text-[10px] font-bold px-2 py-0.5 rounded border border-orange-100">
                    Weekly
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Tagline</span>
                  <p className="text-xs text-gray-600 mt-0.5">"The messy middle of building a startup, zero BS."</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Format</span>
                    <span className="text-xs font-medium text-gray-700">Interview (60m)</span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Target</span>
                    <span className="text-xs font-medium text-gray-700">Series A Founders</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Structure */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="text-[#F97316]">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                  <polyline points="12 6 12 12 16 14" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline>
                </svg>
                Episode Format
              </h3>
              <div className="space-y-2 text-xs font-mono text-gray-600 bg-gray-50 p-3 rounded border border-gray-200">
                {[
                  { time: '00:00', desc: 'Cold Open (Hook)' },
                  { time: '01:00', desc: 'Intro + Sponsors' },
                  { time: '05:00', desc: 'Deep Dive Discussion' },
                  { time: '45:00', desc: '"Founder\'s Folly" Segment' },
                  { time: '55:00', desc: 'Rapid Fire & Outro' },
                ].map((item) => (
                  <div key={item.time} className="flex justify-between">
                    <span className="text-gray-900">{item.time}</span>
                    <span>{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Episodes */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-bold text-sm text-gray-900 mb-2">Season 1 Goals</h3>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full w-1/3 bg-[#F97316]"></div>
                </div>
                <span className="text-[10px] font-bold text-gray-500">4/12 Recorded</span>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-gray-700 p-2 border-l-2 border-[#F97316] bg-orange-50/50">
                  <strong>Theme:</strong> Fundraising Nightmares
                </div>
                <div className="text-xs text-gray-700 p-2 border-l-2 border-gray-300 bg-gray-50">
                  <strong>Dream Guest:</strong> Alexis Ohanian
                </div>
              </div>
            </div>

            {/* Sticky Note */}
            <div className="relative bg-[#FAF5FF] p-4 shadow-[1px_1px_3px_rgba(0,0,0,0.1)] rotate-1 rounded-sm border border-purple-200 draggable text-purple-900 mb-4">
              <p className="text-[10px] font-bold opacity-70 mb-2 uppercase tracking-wide">💡 IDEA PARKING LOT</p>
              <ul className="text-xs leading-relaxed list-disc list-inside space-y-1">
                <li>Episode about mental health?</li>
                <li>"Co-founder conflict" stories</li>
                <li>Live episode at TechCrunch?</li>
                <li>Ask Sarah C. for intro to YC partners</li>
              </ul>
            </div>
          </div>

          {/* SECTION 2: EPISODE PLANNING */}
          <div className="absolute top-10 left-[600px] w-[500px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg text-[#F97316]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <rect width="8" height="4" x="8" y="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" rx="1" ry="1"></rect>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11h4"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16h4"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11h.01"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16h.01"></path>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Episode Planning</h2>
            </div>

            {/* Episode Queue */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm text-gray-900">Episode Queue</h3>
                <span className="text-[10px] text-gray-400 font-mono">NEXT UP</span>
              </div>

              <div className="space-y-3">
                {[
                  { ep: 'Ep 05', title: 'Bootstrapping to $1M', guest: 'Jane Doe (SaaS CEO)', status: 'Recording Today', active: true, color: 'border-[#F97316] bg-orange-50' },
                  { ep: 'Ep 06', title: 'The Pivot', guest: 'Mark S.', status: 'Booked Oct 15', active: false, color: 'border-gray-300 bg-white' },
                  { ep: 'Ep 07', title: 'Topic: Hiring First Employee', guest: 'Status: Outreach', status: '', active: false, color: 'border-gray-200 bg-gray-50/50 opacity-70' },
                ].map((episode) => (
                  <div
                    key={episode.ep}
                    className={`flex items-center justify-between p-3 rounded-lg border-l-4 ${episode.color} shadow-sm`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{episode.ep}</span>
                        <span className={`text-xs font-bold ${episode.active ? 'text-gray-900' : 'text-gray-700'}`}>
                          {episode.title}
                        </span>
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1">
                        Guest: {episode.guest}
                        {episode.status && (
                          <span className={`font-semibold ml-1 ${episode.active ? 'text-orange-700' : ''}`}>
                            • {episode.status}
                          </span>
                        )}
                      </div>
                    </div>
                    {episode.active && (
                      <div className="w-2 h-2 rounded-full bg-[#F97316] animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Plan */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-sm text-gray-900">📄 Ep 05 Brief: Jane Doe</h3>
                <button className="text-gray-400 hover:text-[#F97316]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 20h9"></path>
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1l1-4Z"></path>
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase">Focus</span>
                  <span className="text-xs text-gray-800">Operational Efficiency vs Growth</span>
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-100">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase">Goal</span>
                  <span className="text-xs text-gray-800">Actionable advice on lean ops</span>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-md p-3">
                <span className="block text-[10px] font-bold text-[#F97316] uppercase mb-2">Key Questions</span>
                <ul className="list-decimal list-inside text-xs text-gray-700 space-y-2">
                  <li>How did you handle the first $10k month?</li>
                  <li>Biggest waste of money in year 1?</li>
                  <li>
                    <span className="bg-yellow-100 px-1">Spicy:</span> Why did you fire your co-founder?
                  </li>
                  <li>Advice for solo founders on burnout?</li>
                </ul>
              </div>
            </div>

            {/* Guest Pipeline */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-4 border border-gray-100 draggable">
              <h3 className="font-bold text-xs uppercase text-gray-500 mb-2">Guest Pipeline</h3>
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {[
                  { status: 'Booked', name: 'Mike T.', date: 'Oct 22', color: 'bg-green-50 border-green-100', textColor: 'text-green-700' },
                  { status: 'In Talks', name: 'Sarah L.', date: "Dm'd Twitter", color: 'bg-blue-50 border-blue-100', textColor: 'text-blue-700' },
                  { status: 'Wishlist', name: 'Naval', date: 'Dream big', color: 'bg-gray-50 border-gray-200 opacity-60', textColor: 'text-gray-500' },
                ].map((guest) => (
                  <div key={guest.name} className={`flex-shrink-0 w-24 p-2 ${guest.color} rounded border text-center`}>
                    <div className={`text-[10px] font-bold ${guest.textColor}`}>{guest.status}</div>
                    <div className="text-xs font-semibold mt-1">{guest.name}</div>
                    <div className="text-[9px] text-gray-500">{guest.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 3: RECORDING & PRODUCTION */}
          <div className="absolute top-10 left-[1200px] w-[450px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg text-[#F97316]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" x2="12" y1="19" y2="22" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Recording & Production</h2>
            </div>

            {/* Pre-Record Checklist */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-bold text-sm text-gray-900 mb-3 flex justify-between">
                <span>Pre-Flight Checklist</span>
                <span className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                  Live
                </span>
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Mic Check (SM7B)', checked: true },
                  { label: 'Local Backup Recording Started', checked: true },
                  { label: 'Riverside.fm Room Link Sent', checked: false },
                  { label: 'Phone on Do Not Disturb', checked: false },
                ].map((item) => (
                  <label key={item.label} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                    <input type="checkbox" defaultChecked={item.checked} className="accent-[#F97316] rounded w-4 h-4" />
                    <span className={item.checked ? 'line-through text-gray-400' : 'font-bold text-gray-900'}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Recording Assets */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-bold text-sm text-gray-900 mb-3">Technical Specs</h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2 border border-gray-200 rounded bg-gray-50">
                  <div className="font-bold text-gray-500 uppercase text-[9px]">Sample Rate</div>
                  <div className="font-mono text-gray-900 mt-1">48 kHz</div>
                </div>
                <div className="p-2 border border-gray-200 rounded bg-gray-50">
                  <div className="font-bold text-gray-500 uppercase text-[9px]">Bit Depth</div>
                  <div className="font-mono text-gray-900 mt-1">24-bit WAV</div>
                </div>
              </div>
              <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded text-[10px] text-blue-800 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                  <line x1="12" x2="12" y1="16" y2="12" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                  <line x1="12" x2="12.01" y1="8" y2="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
                </svg>
                Always record multitrack!
              </div>
            </div>

            {/* Purple Sticky */}
            <div className="relative bg-[#FAF5FF] p-4 shadow-sm rotate-2 rounded-sm border border-purple-200 draggable text-purple-900 w-full">
              <p className="text-[10px] font-bold opacity-70 mb-2 uppercase tracking-wide">📝 SESSION NOTES: EP 4</p>
              <ul className="text-xs leading-relaxed space-y-1">
                <li>- Guest mic popped a bit at 12:30</li>
                <li>- Great story about failure at 24:00 (Clip this!)</li>
                <li>- Dog barked at 45:10 - cut out</li>
                <li>- Needs intro re-recorded (stumbled on name)</li>
              </ul>
            </div>
          </div>

          {/* SECTION 4: POST-PRODUCTION */}
          <div className="absolute top-10 left-[1750px] w-[450px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg text-[#F97316]">
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
              <h3 className="font-bold text-sm text-gray-900 mb-3">Workflow: Ep 04</h3>
              <div className="space-y-2">
                {[
                  { label: 'Rough Cut', status: 'Done', active: true, color: 'bg-green-50 border-green-100', textColor: 'text-green-800' },
                  { label: 'Audio Cleanup (EQ/Comp)', status: 'In Progress', active: true, color: 'bg-white border-[#F97316] shadow-sm', textColor: 'text-gray-900' },
                  { label: 'Add Music & SFX', status: '', active: false, color: 'bg-gray-50 border-transparent opacity-60', textColor: 'text-gray-500' },
                  { label: 'Master to -16 LUFS', status: '', active: false, color: 'bg-gray-50 border-transparent opacity-60', textColor: 'text-gray-500' },
                ].map((item) => (
                  <div key={item.label} className={`flex items-center justify-between text-xs p-2 rounded border ${item.color}`}>
                    <div className="flex items-center gap-2">
                      {item.active && item.status === 'In Progress' ? (
                        <div className="w-3.5 h-3.5 border-2 border-[#F97316] rounded-full border-t-transparent animate-spin"></div>
                      ) : item.active && item.status === 'Done' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" className="text-green-600">
                          <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                          <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 12l2 2l4-4"></path>
                        </svg>
                      ) : (
                        <div className="w-3.5 h-3.5 border-2 border-gray-300 rounded-full"></div>
                      )}
                      <span className={`font-medium ${item.textColor}`}>{item.label}</span>
                    </div>
                    {item.status && (
                      <span className={`font-mono text-[10px] ${item.status === 'Done' ? 'text-green-700' : 'text-[#F97316]'}`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Show Notes Template */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-bold text-sm text-gray-900 mb-2">Show Notes Draft</h3>
              <div className="bg-gray-50 border border-gray-200 rounded p-3 font-mono text-[10px] text-gray-600 leading-relaxed">
                <p className="mb-2">
                  <strong>TITLE:</strong> Why Most Startups Fail with [Guest]
                </p>
                <p className="mb-2">
                  <strong>DESC:</strong> In this episode, we discuss the #1 reason founders quit...
                </p>
                <p className="mb-2">
                  <strong>TIMESTAMPS:</strong>
                  <br />
                  02:00 - The Pivot
                  <br />
                  15:30 - Fundraising hell
                  <br />
                  42:00 - Rapid Fire
                </p>
                <p>
                  <strong>LINKS:</strong>
                  <br />- Guest's Twitter: @handle
                  <br />- Book mentioned: "Zero to One"
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 5: GROWTH & ANALYTICS */}
          <div className="absolute top-10 left-[2350px] w-[400px]">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-lg text-[#F97316]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline>
                  <polyline points="16 7 22 7 22 13" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline>
                </svg>
              </div>
              <h2 className="font-serif font-bold text-xl tracking-tight text-gray-800">Growth & Analytics</h2>
            </div>

            {/* Metrics Card */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-bold text-sm text-gray-900 mb-4">Monthly Performance</h3>
              <div className="flex items-end gap-1 mb-4 h-24">
                {[
                  { height: '40%', value: '1.2k', color: 'bg-gray-100' },
                  { height: '60%', value: '1.8k', color: 'bg-gray-200' },
                  { height: '75%', value: '2.1k', color: 'bg-orange-200' },
                  { height: '90%', value: '2.8k', color: 'bg-[#F97316] shadow-lg shadow-orange-200' },
                ].map((bar, idx) => (
                  <div key={idx} className={`w-1/4 ${bar.color} rounded-t relative group`} style={{ height: bar.height }}>
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity font-bold text-[#F97316]">
                      {bar.value}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2 bg-gray-50 rounded">
                  <span className="block text-[10px] text-gray-500 uppercase">Downloads</span>
                  <span className="font-bold text-gray-900 text-lg">2,842</span>
                  <span className="text-[10px] text-green-600 font-bold">↑ 12%</span>
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <span className="block text-[10px] text-gray-500 uppercase">Avg Listen</span>
                  <span className="font-bold text-gray-900 text-lg">38m</span>
                  <span className="text-[10px] text-gray-400">72% retention</span>
                </div>
              </div>
            </div>

            {/* Promo Checklist */}
            <div className="relative bg-white rounded-xl shadow-[0_2px_8px_-1px_rgba(0,0,0,0.08),0_1px_2px_-1px_rgba(0,0,0,0.04)] p-5 mb-4 border border-gray-100 draggable">
              <h3 className="font-bold text-sm text-gray-900 mb-2">Launch Promo Plan</h3>
              <ul className="text-xs text-gray-600 space-y-2">
                {[
                  'Audiogram (Headliner)',
                  'Twitter Thread (5 tweets)',
                  'LinkedIn Post (Tag guest)',
                  'Newsletter Blast',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={item === 'Audiogram (Headliner)'} className="accent-[#F97316]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Listener Feedback Sticky */}
            <div className="relative bg-[#FAF5FF] p-4 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] -rotate-1 rounded-sm border border-purple-200 draggable text-purple-900 mt-6">
              <p className="text-[10px] font-bold opacity-70 mb-2 uppercase tracking-wide">💬 LISTENER LOVE</p>
              <p className="text-xs italic leading-relaxed mb-2">
                "Finally a podcast that doesn't just talk about success, but the hard parts too. Ep 3 changed how I hire."
              </p>
              <p className="text-[10px] text-right font-bold">- Review from Apple Podcasts</p>
            </div>
          </div>

          {/* Floating Helper */}
          <div className="absolute top-[650px] left-[800px] bg-white p-3 rounded-lg shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] rotate-1 border border-orange-200 draggable z-10 flex gap-3 items-start max-w-xs group hover:-translate-y-1 transition-transform">
            <div className="bg-orange-100 p-1.5 rounded-full text-[#F97316] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" stroke="none"></polygon>
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">Batch Record!</p>
              <p className="text-[10px] text-gray-500 leading-tight mt-1">
                Try to record 2 episodes back-to-back on Thursdays. It saves setup time and keeps you in the "zone".
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Welcome Modal Overlay */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.3s_cubic-bezier(0.16,1,0.3,1)_forwards]">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-red-600"></div>

            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-[#F97316]">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m12 8l-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"></path>
                  <circle cx="17" cy="7" r="5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-serif font-bold text-center text-gray-900 mb-2">Podcast Production</h2>
            <p className="text-center text-gray-500 mb-8 leading-relaxed">
              Plan episodes, manage guests, and track your publishing schedule in one infinite workspace. Consistency is key!
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setShowWelcomeModal(false)}
                className="w-full py-3 bg-[#F97316] hover:bg-[#C2410C] text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95"
              >
                Open Studio
              </button>
              <button
                onClick={() => setShowWelcomeModal(false)}
                className="w-full py-3 bg-white text-gray-600 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Load Demo Episodes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

