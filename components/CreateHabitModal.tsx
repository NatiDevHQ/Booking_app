import React, { useState, useEffect, useRef } from 'react';

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string) => void;
  initialTitle?: string;
  mode?: 'create' | 'edit';
}

const CreateHabitModal: React.FC<CreateHabitModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialTitle = '', 
  mode = 'create' 
}) => {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTitle(initialTitle);
      // Focus input after a small delay to allow render
      requestAnimationFrame(() => {
        inputRef.current?.focus();
        if (mode === 'edit') {
            inputRef.current?.select();
        }
      });
    } else {
      setIsVisible(false);
    }
  }, [isOpen, initialTitle, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div 
        className={`bg-white dark:bg-zinc-900 rounded-xl border-2 border-black dark:border-zinc-700 p-6 w-full max-w-md shadow-2xl transform transition-all duration-200 ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-black dark:text-white mb-1">
            {mode === 'create' ? 'Create New Habit' : 'Edit Habit'}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            {mode === 'create' ? 'What habit do you want to track?' : 'Change the name of your habit'}
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-zinc-500 mb-2">
              Habit Name
            </label>
            <input
              ref={inputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-50 dark:bg-zinc-800 border-2 border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-3 text-black dark:text-white font-bold focus:outline-none focus:border-black dark:focus:border-zinc-500 focus:bg-white dark:focus:bg-zinc-900 transition-colors placeholder-gray-300 dark:placeholder-zinc-600"
              placeholder="e.g. Read 30 mins"
              autoFocus
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border-2 border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-zinc-400 font-bold rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 hover:border-gray-300 transition-colors hover:text-black dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-5 py-2.5 bg-black dark:bg-zinc-100 text-white dark:text-black font-bold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mode === 'create' ? 'Create Grid' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHabitModal;