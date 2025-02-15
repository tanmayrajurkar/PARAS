const Button = ({
  onClick,
  type = "button",
  className,
  children,
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`py-2 px-4 rounded-lg font-bold bg-teal-500 hover:bg-teal-600 text-gray-100 border transition duration-200 ease-in-out  focus:outline-none focus:ring-2 focus:ring-teal-300 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
