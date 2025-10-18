import './FormInput.css';

export default function FormInput({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  required = false,
  placeholder = "",
  autoComplete = "off"
}) {
  return (
    <div className="form-input-group">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </div>
  );
}
