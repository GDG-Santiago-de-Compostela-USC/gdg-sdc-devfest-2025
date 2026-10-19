import React from 'react';
import cn from 'classnames';
import styles from './LinkButton.module.css';

interface LinkButtonProps {
  type?: JSX.IntrinsicElements['button']['type'];
  variant?: 'secondary' | 'primary' | 'danger';
  className?: string;
  href: string;
}

const LinkButton: React.FC<LinkButtonProps & JSX.IntrinsicElements['a']> = ({
  variant = 'primary',
  className,
  children,
  href = '/',
  ...props
}) => (
  <a className={cn(styles.button, styles[variant], className)} href={href} {...props}>
    {children}
  </a>
);

export default LinkButton;
