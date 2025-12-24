import { useState, useEffect, useRef } from 'react';

export default function BlankCanvasTemplate() {
  const [showWelcomeCard, setShowWelcomeCard] = useState(true);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [visibleNotes, setVisibleNotes] = useState({
    tips: true,
    types: true,
    org: true,
    keys: true,
  });
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const main = canvasRef.current;
    const content = contentRef.current;
    if (!main || !content) return;

    // Center the view initially
    const centerX = (content.offsetWidth - main.clientWidth) / 2;
    const centerY = (content.offsetHeight - main.clientHeight) / 2;
    main.scrollLeft = centerX;
    main.scrollTop = centerY;

    // Show Quick Start toast after 2 seconds
    const timer = setTimeout(() => {
      setShowQuickStart(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const main = canvasRef.current;
    if (!main) return;

    const handleMouseDown = (e) => {
      if (
        e.target.closest('button') ||
        e.target.closest('.shadow-sticky') ||
        e.target.closest('#welcome-card')
      ) {
        return;
      }

      setIsDragging(true);
      main.classList.add('cursor-grabbing');
      main.classList.remove('cursor-grab');
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
      main.classList.add('cursor-grab');
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      main.classList.remove('cursor-grabbing');
      main.classList.add('cursor-grab');
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

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 10, 50));
  };

  const removeNote = (noteId) => {
    setVisibleNotes((prev) => ({
      ...prev,
      [noteId]: false,
    }));
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#F5F5F4] text-gray-800 flex flex-col font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Top Navigation */}
      <header className="h-14 bg-white/80 backdrop-blur-md border-b border-[#E5E5E5] flex items-center justify-between px-4 z-40 shrink-0 relative">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white shadow-sm group-hover:bg-gray-800 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                <polygon points="12 2 2 7 12 12 22 7 12 2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon>
                <polyline points="2 17 12 22 22 17" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline>
                <polyline points="2 12 12 17 22 12" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-gray-900">Untitled Project</span>
              <span className="text-[10px] text-gray-400 font-medium">Last saved just now</span>
            </div>
          </div>
        </div>

        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-gray-100/50 p-1 rounded-lg border border-gray-200/50">
          <button className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-500 hover:text-gray-900 transition-all" title="Select">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m12 6l-6 13.5l3.5-1.5l2.5 5l2.5-5l3.5 1.5Z"></path>
            </svg>
          </button>
          <button className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-500 hover:text-gray-900 transition-all" title="Hand Tool">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"></path>
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"></path>
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a.9.9 0 0 1 0-1.27l2.49-2.49a.9.9 0 0 1 1.28 0Z"></path>
            </svg>
          </button>
          <div className="w-px h-4 bg-gray-300 mx-1"></div>
          <button className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-500 hover:text-gray-900 transition-all" title="Text">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <polyline points="4 7 4 4 20 4 20 7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polyline>
              <line x1="9" x2="15" y1="20" y2="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
              <line x1="12" x2="12" y1="4" y2="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
            </svg>
          </button>
          <button className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-500 hover:text-gray-900 transition-all" title="Image">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <rect width="18" height="18" x="3" y="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" rx="2" ry="2"></rect>
              <circle cx="9" cy="9" r="2" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
            </svg>
          </button>
          <button className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-500 hover:text-gray-900 transition-all" title="Sticky Note">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"></path>
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 3v6h6"></path>
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 mr-2">
            <div className="w-7 h-7 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-purple-600">
              ME
            </div>
          </div>
          <button className="px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-md hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2">
            Share
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
              <circle cx="6" cy="12" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
              <circle cx="18" cy="19" r="3" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></circle>
              <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
              <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></line>
            </svg>
          </button>
        </div>
      </header>

      {/* Main Canvas */}
      <main
        ref={canvasRef}
        id="canvas"
        className="flex-1 overflow-auto cursor-grab active:cursor-grabbing relative"
        style={{
          backgroundImage: 'radial-gradient(#D6D3D1 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      >
        {/* Infinite Canvas Area */}
        <div
          ref={contentRef}
          className="relative w-[3000px] h-[2000px] p-20 transform origin-top-left flex items-center justify-center"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {/* CENTER: Welcome Message */}
          {showWelcomeCard && (
            <div
              id="welcome-card"
              className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] p-10 max-w-lg w-full text-center border border-[#E5E5E5] z-10 animate-slide-up transition-opacity duration-500 ${
                !showWelcomeCard ? 'opacity-0 pointer-events-none' : ''
              }`}
            >
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m12 3l1.912 5.813a2 2 0 0 0 1.276 1.276L21 12l-5.813 1.912a2 2 0 0 0-1.276 1.276L12 21l-1.912-5.813a2 2 0 0 0-1.276-1.276L3 12l5.813-1.912a2 2 0 0 0 1.276-1.276z"></path>
                </svg>
              </div>
              <h1 className="font-serif text-3xl font-medium text-gray-900 mb-3">Your Canvas</h1>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Start creating your project. Click <strong className="text-gray-800">+ Add</strong> to create your first card, or drag to explore. This space is yours.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowWelcomeCard(false)}
                  className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition-all shadow-sm active:scale-95 text-sm"
                >
                  Get Started
                </button>
                <button className="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium rounded-lg transition-all text-sm">
                  See Examples
                </button>
              </div>
            </div>
          )}

          {/* Helper Note 1: Top Left (Tips) */}
          {visibleNotes.tips && (
            <div className="absolute top-20 left-20 w-64 bg-[#F3E8FF] text-[#6B21A8] p-5 rounded shadow-[2px_2px_5px_rgba(0,0,0,0.05)] -rotate-2 transition-transform hover:scale-105 hover:z-20 font-sans">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold tracking-widest uppercase opacity-70">💡 Quick Tips</span>
                <button onClick={() => removeNote('tips')} className="text-[#6B21A8]/50 hover:text-[#6B21A8]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <ul className="text-xs space-y-2 leading-relaxed font-medium opacity-90">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>
                    <strong>[+ Add]</strong> button to add cards
                  </span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Drag cards to move freely</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Resize from any corner</span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>Connect cards with lines</span>
                </li>
              </ul>
            </div>
          )}

          {/* Helper Note 2: Top Right (Card Types) */}
          {visibleNotes.types && (
            <div className="absolute top-20 right-20 w-64 bg-[#FCE7F3] text-[#9D174D] p-5 rounded shadow-[2px_2px_5px_rgba(0,0,0,0.05)] rotate-1.5 transition-transform hover:scale-105 hover:z-20 font-sans">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold tracking-widest uppercase opacity-70">🎨 Card Types</span>
                <button onClick={() => removeNote('types')} className="text-[#9D174D]/50 hover:text-[#9D174D]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium opacity-90">
                <div className="bg-white/40 p-1.5 rounded">📝 Text</div>
                <div className="bg-white/40 p-1.5 rounded">🖼️ Image</div>
                <div className="bg-white/40 p-1.5 rounded">🎬 Script</div>
                <div className="bg-white/40 p-1.5 rounded">📌 Sticky</div>
                <div className="bg-white/40 p-1.5 rounded">📦 Section</div>
                <div className="bg-white/40 p-1.5 rounded">📸 Shot</div>
              </div>
            </div>
          )}

          {/* Helper Note 3: Bottom Left (Organization) */}
          {visibleNotes.org && (
            <div className="absolute bottom-40 left-20 w-64 bg-[#E0F2FE] text-[#075985] p-5 rounded shadow-[2px_2px_5px_rgba(0,0,0,0.05)] rotate-1 transition-transform hover:scale-105 hover:z-20 font-sans">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold tracking-widest uppercase opacity-70">🗂️ Organize</span>
                <button onClick={() => removeNote('org')} className="text-[#075985]/50 hover:text-[#075985]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <ul className="text-xs space-y-2 leading-relaxed font-medium opacity-90">
                <li className="flex gap-2">
                  <span>•</span>
                  <span>
                    <strong>Timeline:</strong> Left → Right
                  </span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>
                    <strong>Phases:</strong> Use Sections
                  </span>
                </li>
                <li className="flex gap-2">
                  <span>•</span>
                  <span>
                    <strong>Mind Map:</strong> Center → Out
                  </span>
                </li>
              </ul>
              <div className="mt-3 text-[10px] italic opacity-75 pt-2 border-t border-[#075985]/10">
                There's no wrong way! 🚀
              </div>
            </div>
          )}

          {/* Helper Note 4: Bottom Right (Shortcuts) */}
          {visibleNotes.keys && (
            <div className="absolute bottom-40 right-20 w-64 bg-[#DCFCE7] text-[#166534] p-5 rounded shadow-[2px_2px_5px_rgba(0,0,0,0.05)] -rotate-1 transition-transform hover:scale-105 hover:z-20 font-sans">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold tracking-widest uppercase opacity-70">⌨️ Shortcuts</span>
                <button onClick={() => removeNote('keys')} className="text-[#166534]/50 hover:text-[#166534]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
              <div className="space-y-1.5 text-[11px] font-mono opacity-90">
                <div className="flex justify-between">
                  <span>Undo</span>
                  <span className="bg-white/40 px-1 rounded">Cmd+Z</span>
                </div>
                <div className="flex justify-between">
                  <span>Duplicate</span>
                  <span className="bg-white/40 px-1 rounded">Cmd+D</span>
                </div>
                <div className="flex justify-between">
                  <span>Pan</span>
                  <span className="bg-white/40 px-1 rounded">Space+Drag</span>
                </div>
                <div className="flex justify-between">
                  <span>Select All</span>
                  <span className="bg-white/40 px-1 rounded">Cmd+A</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-8 right-8 z-50">
        <button
          className="h-14 w-14 bg-gray-900 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-black transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center group"
          title="Add Card"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" className="group-hover:rotate-90 transition-transform duration-300">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14M5 12h14"></path>
          </svg>
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="fixed bottom-8 left-8 z-40 bg-white rounded-lg shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-[#E5E5E5] flex items-center p-1">
        <button onClick={handleZoomOut} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14"></path>
          </svg>
        </button>
        <span className="px-2 text-xs font-mono text-gray-500 w-12 text-center select-none">{zoom}%</span>
        <button onClick={handleZoomIn} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14M5 12h14"></path>
          </svg>
        </button>
      </div>

      {/* Quick Start Toast */}
      {showQuickStart && (
        <div
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border border-gray-200 py-3 px-5 z-50 flex items-center gap-4 transition-all duration-500 ${
            showQuickStart ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none translate-y-4'
          }`}
        >
          <span className="text-sm font-medium text-gray-600">🚀 Ready to start?</span>
          <div className="flex gap-2">
            <button
              onClick={() => setShowQuickStart(false)}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-xs font-semibold rounded-full text-gray-800 transition-colors"
            >
              Start with Text
            </button>
            <button
              onClick={() => setShowQuickStart(false)}
              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-xs font-semibold rounded-full text-purple-700 transition-colors"
            >
              Mood Board
            </button>
          </div>
          <button onClick={() => setShowQuickStart(false)} className="ml-2 text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

