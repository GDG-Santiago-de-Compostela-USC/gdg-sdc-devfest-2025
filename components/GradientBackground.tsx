import classNames from 'classnames';
import styles from './GradientBackground.module.css';

export function GradientBackground({ variant, className }: { variant: 'large' | 'small'; className?: string }) {
    const classes = classNames(
        {
            [styles.colorBackground]: variant === 'large',
            [styles.colorBackgroundBottom]: variant === 'small',
        },
        className
    );

    return <div className={classes} aria-hidden="true" />;
}
