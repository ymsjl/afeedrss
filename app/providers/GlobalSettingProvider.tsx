import React, { useEffect } from "react";
import { StorageKeys } from "../../constants";

interface GlobalSettings {
  showFeedThumbnail: boolean;
}
const defaultGlobalSettings = {
  showFeedThumbnail: true,
};

export const GlobalSettingsCtx = React.createContext<{
  setGlobalSettings: React.Dispatch<React.SetStateAction<GlobalSettings>>;
  globalSettings: GlobalSettings;
}>({
  setGlobalSettings: () => {},
  globalSettings: defaultGlobalSettings,
});

export function GlobalSettingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [globalSettings, setGlobalSettings] = React.useState<GlobalSettings>(
    () => {
      let result = defaultGlobalSettings;
      if (typeof localStorage !== "undefined") {
        try {
          const settings = localStorage.getItem(StorageKeys.SETTINGS);
          if (settings !== null) {
            result = settings && JSON.parse(settings);
          }
        } catch (error) {
          console.error(error);
        }
      }
      return result;
    }
  );

  useEffect(() => {
    if (typeof localStorage !== "undefined") {
      try {
        const settings = JSON.stringify(globalSettings);
        localStorage.setItem(StorageKeys.SETTINGS, settings);
      } catch (error) {
        console.error(error);
      }
    }
  }, [globalSettings]);

  return (
    <GlobalSettingsCtx.Provider value={{ globalSettings, setGlobalSettings }}>
      {children}
    </GlobalSettingsCtx.Provider>
  );
}
