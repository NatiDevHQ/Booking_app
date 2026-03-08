import React, { useState, useEffect, useCallback, useRef } from 'react';

export interface TourStep {
  selector: string;
  title: string;
  description: string;
}

interface AppTourProps {
  steps: TourStep[];
  onComplete?: () => void;
  storageKey?: string;
}

const AppTour: React.FC<AppTourProps> = ({ 
  steps, 
  onComplete, 
  storageKey = 'sbs-tour-completed' 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [popoverPos, setPopoverPos] = useState({ top: 0, left: 0, arrowPos: 'top' as 'top' | 'bottom' | 'left' | 'right' });
  const [mounted, setMounted] = useState(false);
  
  const tourRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    const step = steps[currentStep];
    const element = document.querySelector(step.selector);

    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);
      
      // Auto-scroll if not in view
      const isInViewport = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );

      if (!isInViewport) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Calculate popover & arrow position
      let popTop = rect.bottom + 20;
      let popLeft = rect.left + rect.width / 2;
      let arrow = 'top';

      // If too close to bottom, show on top
      if (popTop + 250 > window.innerHeight) {
        popTop = rect.top - 240;
        arrow = 'bottom';
      }

      // Horizontal bounds
      popLeft = Math.max(160, Math.min(popLeft, window.innerWidth - 160));

      setPopoverPos({ top: popTop, left: popLeft, arrowPos: arrow as any });
    } else {
        // If element not found, just center it or hide
        setTargetRect(null);
        setPopoverPos({ top: window.innerHeight / 2, left: window.innerWidth / 2, arrowPos: 'top' });
    }
  }, [currentStep, steps]);

  useEffect(() => {
    const checkStatus = localStorage.getItem(storageKey);
    if (!checkStatus) {
      setMounted(true);
      setTimeout(() => setIsVisible(true), 500);
    }
  }, [storageKey]);

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
    }
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isVisible, updatePosition]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleFinish();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    setIsVisible(false);
    localStorage.setItem(storageKey, 'true');
    setTimeout(() => {
        setMounted(false);
        if (onComplete) onComplete();
    }, 500);
  };

  if (!mounted) return null;

  return (
    <div className={`fixed inset-0 z-[10000] pointer-events-none font-sans transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Dimmed Overlay with SpotLight effect */}
      <svg className="absolute inset-0 w-full h-full pointer-events-auto">
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect 
                x={targetRect.left - 8} 
                y={targetRect.top - 8} 
                width={targetRect.width + 16} 
                height={targetRect.height + 16} 
                rx="12"
                fill="black"
                className="transition-all duration-300"
              />
            )}
          </mask>
        </defs>
        <rect 
            x="0" 
            y="0" 
            width="100%" 
            height="100%" 
            fill="rgba(0,0,0,0.7)" 
            mask="url(#spotlight-mask)" 
            className="backdrop-blur-[2px]"
        />
      </svg>

      {/* Popover */}
      <div 
        ref={tourRef}
        className="absolute w-[320px] bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-200 dark:border-zinc-800 pointer-events-auto transition-all duration-500 ease-out"
        style={{
          top: popoverPos.top,
          left: popoverPos.left,
          transform: 'translateX(-50%)',
        }}
      >
        {/* Arrow */}
        <div 
          className={`absolute w-4 h-4 bg-white dark:bg-zinc-900 border-l border-t border-gray-200 dark:border-zinc-800 rotate-45 transition-all duration-500 ${
            popoverPos.arrowPos === 'top' ? '-top-2 left-1/2 -translate-x-1/2' : '-bottom-2 left-1/2 -translate-x-1/2 rotate-[225deg]'
          }`}
        />

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">
              Step {currentStep + 1} of {steps.length}
            </span>
            <button 
              onClick={handleFinish}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-tight">
            {steps[currentStep].title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400 leading-relaxed mb-6">
            {steps[currentStep].description}
          </p>

          <div className="flex items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-zinc-800">
            <div className="flex gap-1.5">
                <button 
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className="px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-0 transition-all"
                >
                  Back
                </button>
            </div>
            
            <button 
              onClick={handleNext}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95"
            >
              {currentStep === steps.length - 1 ? 'Got it!' : 'Next step'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppTour;
