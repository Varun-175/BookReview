import React from 'react';

const Input = ({ label, name, type = 'text', value, onChange, placeholder = '', className = '' }) => {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && <label htmlFor={name} className="mb-1 font-semibold">{label}</label>}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default Input;