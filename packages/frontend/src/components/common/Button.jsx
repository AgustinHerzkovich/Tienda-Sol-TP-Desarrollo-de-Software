import './Button.css';

export default function Button({ 
  children, 
  type = "button", 
  variant = "primary",
  fullWidth = false,
  disabled = false,
  onClick 
}) {
  const classNames = `btn btn-${variant} ${fullWidth ? 'btn-full-width' : ''}`;
  
  return (
    <button 
      type={type} 
      className={classNames}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
