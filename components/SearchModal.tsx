import Search from './Search';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-40 bg-black bg-opacity-50 flex justify-center items-start pt-20"
      onClick={onClose} // Close modal when clicking on the background
    >
      <div 
        className="relative z-50 w-11/12 max-w-lg bg-white dark:bg-gray-900 rounded-lg p-4"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        <button 
          onClick={onClose} 
          className="absolute top-2 right-3 text-2xl font-bold text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
        >
          &times;
        </button>
        <Search />
      </div>
    </div>
  );
}