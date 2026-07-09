import { HiOutlineSearch } from 'react-icons/hi';

/**
 * Search bar component with icon
 */
const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="relative">
      <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl text-surface-900 dark:text-white placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
      />
    </div>
  );
};

export default SearchBar;
