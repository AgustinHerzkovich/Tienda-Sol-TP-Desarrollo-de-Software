import './PageHeader.css';

export default function PageHeader({ icon: Icon, title, badge }) {
  return (
    <div className="page-header">
      <h1>
        {Icon && <Icon />} {title}
      </h1>
      {badge && <span className="page-badge">{badge}</span>}
    </div>
  );
}
