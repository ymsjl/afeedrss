import React from "react";
import { IRenderFunction, INavLink } from "@fluentui/react";

import { Text } from "@fluentui/react-components";
import { StackShim } from "@fluentui/react-migration-v8-v9";
import { Nav } from "@fluentui/react-nav-preview";
import Link from "next/link";

import { NAV_LIST } from "./constants";

export default function SettingsNav() {
  const onRenderLink: IRenderFunction<INavLink> = (props, defaultRender) => {
    if (!props) {
      return null;
    }

    return (
      <Link href={props.url} passHref replace>
        <StackShim horizontal verticalAlign="center" className="w-full mx-2">
          <Text block wrap={false} className="flex-1 text-left">
            {props.name}
          </Text>
        </StackShim>
      </Link>
    );
  };

  const handleLinkClick = (
    e?: React.MouseEvent<HTMLElement>,
    item?: INavLink
  ) => {
    e?.preventDefault();
  };

  return (
    <Nav
      styles={{
        root: "px-2",
        chevronButton: "left-auto right-4",
        link: "pl-4 pr-12",
      }}
      groups={[{ links: NAV_LIST }]}
      onRenderLink={onRenderLink}
      onLinkClick={handleLinkClick}
      onRenderGroupHeader={() => null}
    />
  );
}
