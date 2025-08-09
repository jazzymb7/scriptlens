const InputField = ({ type, placeholder, value, onChange, icon }) => {
  return (
    <>
      <label className="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="h-4 w-4 opacity-70"
        >
          {icon}
        </svg>
        <input
          type={type}
          className="grow bg-white"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
        />
      </label>
    </>
  );
};

export default InputField;
