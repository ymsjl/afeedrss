import React, { useState } from "react";
import { tokens } from "@fluentui/react-components";
import { makeStyles } from "@fluentui/react-components";

import SourceNavPanel from "../SourceNavPanel";
import { useSession } from "next-auth/react";

interface Props {
  children?: React.ReactNode;
}

interface GlobalNavigation {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const defaultGlobalNavigation = {
  isOpen: true,
  setIsOpen: () => {},
};

export const GlobalNavigationCtx = React.createContext<GlobalNavigation>(
  defaultGlobalNavigation
);

export default function Layout({ children }: Props) {
  const [isNavigationPanelOpen, setIsNavigationPanelOpen] = useState(true);
  const { data: session } = useSession();
  const userId = session?.user?.id || "";
  const classes = useStyles();

  return (
    <GlobalNavigationCtx.Provider
      value={{
        isOpen: isNavigationPanelOpen,
        setIsOpen: setIsNavigationPanelOpen,
      }}
    >
      <div className={classes.root}>
        <SourceNavPanel userId={userId} />
        <div className={classes.mainContent}>
          <div className={classes.mainContentInner}>{children}</div>
        </div>
      </div>
    </GlobalNavigationCtx.Provider>
  );
}

export const getLayout = (page: React.ReactElement): React.ReactElement => (
  <Layout>{page}</Layout>
);

const useStyles = makeStyles({
  root: {
    display: "flex",
    position: "relative",
    height: "100vh",
    overflow: "hidden",
    backgroundColor: tokens.colorNeutralBackground4,
  },
  mainContent: {
    display: "flex",
    justifyContent: "center",
    flexGrow: 1,
  },
  mainContentInner: {
    maxWidth: "64rem",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    paddingInlineEnd: tokens.spacingHorizontalL,
  },
});
