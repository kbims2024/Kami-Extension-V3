'use client';

import { useEffect, useState } from 'react';

export interface LogoData {
  id?: string;
  text: string;
  imageUrl: string | null;
  textColor: string;
  backgroundColor: string;
}

export function useLogo() {
  const [logo, setLogo] = useState<LogoData>({
    text: 'KAMI-EXTENSION',
    imageUrl: null,
    textColor: '#8B5E3C',
    backgroundColor: '#ffffff',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogo();
  }, []);

  const loadLogo = async () => {
    try {
      const response = await fetch('/api/logo');
      if (response.ok) {
        const data = await response.json();
        setLogo(data);
      }
    } catch (error) {
      console.error('Error loading logo:', error);
    } finally {
      setLoading(false);
    }
  };

  return { logo, loading };
}

interface LogoDisplayProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBackground?: boolean;
  className?: string;
}

export function LogoDisplay({ size = 'md', showBackground = true, className = '' }: LogoDisplayProps) {
  const { logo, loading } = useLogo();

  if (loading) {
    return <div className={`font-extrabold ${className}`}>KAMI-EXTENSION</div>;
  }

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const imageSizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16',
  };

  const content = logo.imageUrl ? (
    <img src={logo.imageUrl} alt="Logo" className={`${imageSizes[size]} object-contain`} />
  ) : (
    <span className={sizeClasses[size]}>{logo.text}</span>
  );

  if (showBackground && logo.imageUrl) {
    return (
      <div
        className={`inline-flex items-center justify-center p-2 rounded-lg ${className}`}
        style={{ backgroundColor: logo.backgroundColor }}
      >
        <span style={{ color: logo.textColor }}>{content}</span>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center font-extrabold ${className}`}
      style={{ color: logo.imageUrl ? undefined : logo.textColor }}
    >
      {content}
    </span>
  );
}