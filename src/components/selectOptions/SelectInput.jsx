const SelectInput = ({ name, value, options, onChange, className }) => {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full  p-1 border border-gray-300 rounded-lg focus:outline-none cursor-pointer ${className}`}
    >
      <option value="">Select {name}</option>
      {options.map((option) => (
        <option  key={option.name || option} value={option.name || option}>
          {option.name || option}
        </option>
      ))}
    </select>
  );
};

export default SelectInput;
