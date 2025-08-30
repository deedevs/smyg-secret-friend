import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  linkTo?: string;
}

export default function Logo({ 
  className = '', 
  size = 'md',
  linkTo = '/'
}: LogoProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const logoContent = (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className={`font-bold gradient-text ${sizeClasses[size]}`}>
        SMYG
      </span>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="hover:opacity-90 transition-opacity">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}