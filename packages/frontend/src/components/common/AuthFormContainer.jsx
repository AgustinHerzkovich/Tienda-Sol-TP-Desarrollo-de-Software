import './AuthFormContainer.css';

export default function AuthFormContainer({ title, children, onSubmit }) {
  return (
    <div className="auth-page-container">
      <div className="auth-form-box">
        <h1 className="auth-title">{title}</h1>
        <form className="auth-form" onSubmit={onSubmit}>
          {children}
        </form>
      </div>
    </div>
  );
}
