import React from 'react';

type FilterButtonProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

const FilterButton: React.FC<FilterButtonProps> = ({ label, active, onClick }) => (
  <button
    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
      active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

export default FilterButton;