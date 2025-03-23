type FilterDropdownProps = {
  label: string;
  options: string[];
};

export const FilterDropdown = ({ label, options }: FilterDropdownProps) => {
  return (
    <div className="form-control w-full max-w-xs">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <select className="select select-bordered">
        {options.map((option, i) => (
          <option key={i}>{option}</option>
        ))}
      </select>
    </div>
  );
};
