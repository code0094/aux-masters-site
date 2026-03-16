import React from 'react';

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  options,       // for select: [{ value, label }]
  rows,          // for textarea
}) {
  const handleChange = (e) => {
    onChange(name, e.target.value);
  };

  let input;

  if (options) {
    input = (
      <select name={name} value={value} onChange={handleChange} required={required}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    );
  } else if (rows || type === 'textarea') {
    input = (
      <textarea
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        rows={rows || 4}
      />
    );
  } else {
    input = (
      <input
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
      />
    );
  }

  return (
    <div className="admin-field">
      <label htmlFor={name}>{label}</label>
      {input}
    </div>
  );
}
