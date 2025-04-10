import React, { useContext } from "react";
import StatusCard, { Status } from "../statusCard";
import { GlobalNavigationCtx } from "../home/layout";
import { makeStyles } from "@fluentui/react-components";
import { Hamburger } from '@fluentui/react-nav-preview'

interface Props {
  title?: string;
  children?: React.ReactNode;
  tailElem?: React.ReactNode;
}

const useStyles = makeStyles({
  container: {
    padding: '0 1.5rem',
    '@media (min-width: 640px)': {
      padding: '0 3rem',
    },
  },
  header: {
    paddingTop: '1rem',
    marginBottom: '1rem',
    '@media (min-width: 640px)': {
      paddingTop: '4rem',
    },
  },
  iconButtonContainer: {
    marginBottom: '0.5rem',
    '@media (min-width: 640px)': {
      display: 'none',
    },
  },
  iconButton: {
    marginRight: '0.75rem',
  },
  breadcrumbContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  breadcrumbGrow: {
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
  },
});

export default function Layout({ title, children, tailElem }: Props) {
  const { setIsOpen } = useContext(GlobalNavigationCtx);
  const styles = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconButtonContainer}>
          <Hamburger
            onClick={() => setIsOpen(true)}
            className={styles.iconButton}
          />
        </div>
        <div className={styles.breadcrumbContainer}>
          <div className={styles.breadcrumbGrow}></div>
          <div>{tailElem}</div>
        </div>
      </div>
      <div className={styles.content}>
        {children ?? (
          <StatusCard status={Status.EMPTY} content="这里空无一物" />
        )}
      </div>
    </div>
  );
}
