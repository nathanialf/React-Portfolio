import VerticalSidebar from './VerticalSidebar';
import Copyright from './Copyright';
import styles from '../styles/ToolPage.module.css';

interface ToolPageLayoutProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  version?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  containerClassName?: string;
  wrapperClassName?: string;
  innerClassName?: string;
  headerClassName?: string;
  fixedFooter?: boolean;
}

export default function ToolPageLayout({
  title,
  subtitle,
  version,
  children,
  headerRight,
  containerClassName,
  wrapperClassName,
  innerClassName,
  headerClassName,
  fixedFooter,
}: ToolPageLayoutProps) {
  return (
    <div className={`${styles.wrapper}${wrapperClassName ? ` ${wrapperClassName}` : ''}`}>
      <div className={styles.sidebar}>
        <VerticalSidebar />
      </div>
      <div className={`${styles.container}${containerClassName ? ` ${containerClassName}` : ''}`}>
        <div className={`${styles.inner}${innerClassName ? ` ${innerClassName}` : ''}`}>
          <header className={`${styles.header}${headerClassName ? ` ${headerClassName}` : ''}`}>
            <div className={styles.titleBlock}>
              <h1 className={styles.title}>{title}</h1>
              {version && <span className={styles.version}>{version}</span>}
              {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
            </div>
            {headerRight}
          </header>
          {children}
          {fixedFooter ? (
            <div className={styles.mobileFooter}>
              <Copyright />
            </div>
          ) : (
            <Copyright />
          )}
        </div>
      </div>
      {fixedFooter && (
        <div className={styles.desktopFooter}>
          <Copyright fixed />
        </div>
      )}
    </div>
  );
}
