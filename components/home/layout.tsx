import React, { useState } from "react";
import Link from "next/link";
import { Button, Image, mergeClasses, Text } from "@fluentui/react-components";
import { SettingsRegular } from "@fluentui/react-icons";
import { makeStyles } from "@fluentui/react-components";

import SourcesPanel from "../sourcePanel";
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

const useStyles = makeStyles({
  root: {
    display: "flex",
    position: "relative",
    height: "100vh",
    overflow: "hidden",
  },
  content: {
    width: "100%",
    height: "100%",
    position: "relative",
    overflowX: "hidden",
  },
  navigationPanel: {
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 20,
    backgroundColor: "#f3f4f6", // bg-gray-100
    width: "calc(100% - 64px)",
    // transition: "transform 0.3s ease-in-out",
    "@media (min-width: 640px)": {
      // sm breakpoint
      width: "288px",
      transform: "translateX(0)",
    },
  },
  navigationPanelHidden: {
    transform: "translateX(-100%)",
  },
  navigationMask: {
    position: "fixed",
    inset: 0,
    zIndex: 10,
    backgroundColor: "#00000080", // bg-black/50
    cursor: "pointer",
  },
  navigationPanelHeader: {
    padding: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navigationPanelContent: {
    position: "sticky",
    top: 0,
    overflowY: "hidden",
    flexGrow: 1,
  },
  navigationPanelScroll: {
    overflowY: "scroll",
    flex: 1,
  },
  mainContent: {
    backgroundColor: "#e5e7eb", // bg-gray-200
    display: "flex",
    justifyContent: "center",
    flexGrow: 1,
  },
  mainContentInner: {
    maxWidth: "64rem", // max-w-4xl
    backgroundColor: "#f9fafb", // bg-gray-50
    width: "100%",
  },
});

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
      <div className={mergeClasses(classes.root, "bg-gray-100")}>
        {/* {isNavigationPanelOpen && (
          <div
            className={classes.navigationMask}
            onClick={() => setIsNavigationPanelOpen(false)}
          />
        )} */}
        {/* <div
          className={mergeClasses(
            classes.navigationPanel,
            !isNavigationPanelOpen && classes.navigationPanelHidden
          )}
        >
          <div className={classes.navigationPanelHeader}>
            <Image
              src=""
              alt=""
              className="w-12 h-12 rounded-full bg-gray-400 mr-4"
            />
            <div>
              <Text className="text-lg font-bold" block>
                {session?.user?.name}
              </Text>
              <Text className="text-base text-gray-400">
                {session?.user?.email}
              </Text>
            </div>
            <Link href="/settings" passHref>
              <a>
                <Button appearance="transparent" icon={<SettingsRegular />} />
              </a>
            </Link>
          </div>
          <div className={classes.navigationPanelContent}>
            <div className={classes.navigationPanelScroll}>
            </div>
          </div>
        </div> */}
        <SourcesPanel userId={userId} />

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
