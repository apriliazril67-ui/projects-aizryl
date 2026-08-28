import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import '../styles/components.css';

export default function ToolCard({ icon: Icon, title, description, to, accent = 'cyan' }) {
  return (
    <Link to={to} className={`tool-card glass-panel accent-${accent}`}>
      <div className="tool-card-icon">
        <Icon size={22} strokeWidth={2} />
      </div>
      <div className="tool-card-body">
        <h3>{title}</h3>
        <p className="text-muted">{description}</p>
      </div>
      <ArrowUpRight size={18} className="tool-card-arrow" />
    </Link>
  );
}
