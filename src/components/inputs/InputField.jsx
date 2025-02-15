const InputField = ({
  type,
  value,
  name,
  onChange,
  max,
  min,
  className,
  placeholder,
  ...props
  
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      max={max}
      min={min}
      className={className}
      placeholder={placeholder}
      {...props}
    ></input>
  );
};

export default InputField;
