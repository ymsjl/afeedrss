"use client";

import React, { useEffect, useState } from "react";
import { 
  Button, 
  Text, 
  makeStyles, 
  tokens,
  Divider,
  Switch,
  Label,
  InfoLabel,
  Card,
  CardHeader
} from "@fluentui/react-components";
import { useAppStore } from "@/app/providers/AppStoreProvider";

const useStyles = makeStyles({
  container: {
    padding: tokens.spacingHorizontalL,
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalM,
    backgroundColor: tokens.colorNeutralBackground1,
    borderRadius: tokens.borderRadiusMedium,
    maxWidth: "600px",
    margin: "auto"
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: tokens.spacingVerticalS,
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: tokens.spacingHorizontalL,
  },
  heading: {
    fontSize: tokens.fontSizeBase500,
    fontWeight: tokens.fontWeightSemibold,
    marginBottom: tokens.spacingVerticalS,
  },
  buttonGroup: {
    display: "flex",
    gap: tokens.spacingHorizontalS,
  },
  infoCard: {
    marginTop: tokens.spacingVerticalL,
    backgroundColor: tokens.colorNeutralBackground2,
  },
  persistInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.spacingVerticalS,
    padding: tokens.spacingHorizontalM,
  }
});

export function ZustandDemo() {
  const styles = useStyles();
  
  // 使用修改后的 Zustand store hook
  const layoutType = useAppStore((state) => state.layoutType);
  const setLayoutType = useAppStore((state) => state.setLayoutType);
  const isArticlePanelOpen = useAppStore((state) => state.isArticlePanelOpen);
  const setArticlePanelOpen = useAppStore((state) => state.setArticlePanelOpen);
  const theme = useAppStore((state) => state.theme);
  const setTheme = useAppStore((state) => state.setTheme);
  const preferences = useAppStore((state) => state.preferences);
  const setPreference = useAppStore((state) => state.setPreference);
  
  // 存储本地存储中的持久化数据
  const [persistedData, setPersistedData] = useState<string | null>(null);
  
  // 更新和显示本地存储的内容
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('app-storage');
      setPersistedData(data);
    }
  }, [layoutType, theme, preferences]);

  // 日志记录当前状态，仅用于演示
  useEffect(() => {
    console.log("Current Zustand state:", { layoutType, isArticlePanelOpen, theme, preferences });
  }, [layoutType, isArticlePanelOpen, theme, preferences]);

  return (
    <div className={styles.container}>
      <Text className={styles.heading}>Zustand 状态管理演示 (已启用持久化)</Text>
      
      <div className={styles.section}>
        <Text weight="semibold">布局类型 (layoutType): {layoutType}</Text>
        <div className={styles.buttonGroup}>
          <Button 
            appearance={layoutType === 'default' ? 'primary' : 'secondary'}
            onClick={() => setLayoutType('default')}
          >
            默认布局
          </Button>
          <Button 
            appearance={layoutType === 'split' ? 'primary' : 'secondary'}
            onClick={() => setLayoutType('split')}
          >
            分屏布局
          </Button>
          <Button 
            appearance={layoutType === 'compact' ? 'primary' : 'secondary'}
            onClick={() => setLayoutType('compact')}
          >
            紧凑布局
          </Button>
        </div>
      </div>
      
      <Divider />
      
      <div className={styles.section}>
        <Text weight="semibold">文章面板状态 (非持久化)</Text>
        <InfoLabel info="此状态不会被持久化，刷新后会重置">
          当前状态: {isArticlePanelOpen ? '打开' : '关闭'}
        </InfoLabel>
        <div className={styles.row}>
          <Button 
            onClick={() => setArticlePanelOpen(!isArticlePanelOpen)}
          >
            {isArticlePanelOpen ? '关闭面板' : '打开面板'}
          </Button>
        </div>
      </div>

      <Divider />
      
      <div className={styles.section}>
        <Text weight="semibold">主题设置 (持久化)</Text>
        <div className={styles.row}>
          <Text>当前主题: {theme === 'light' ? '浅色' : '深色'}</Text>
          <Switch 
            label={theme === 'light' ? "切换到深色" : "切换到浅色"} 
            checked={theme === 'dark'}
            onChange={(e, data) => setTheme(data.checked ? 'dark' : 'light')}
          />
        </div>
      </div>

      <Divider />
      
      <div className={styles.section}>
        <Text weight="semibold">用户偏好 (持久化)</Text>
        <div className={styles.row}>
          <Label>字体大小: {preferences.fontSize}px</Label>
          <div className={styles.buttonGroup}>
            <Button 
              onClick={() => setPreference('fontSize', Math.max(12, preferences.fontSize - 2))}
            >
              减小
            </Button>
            <Button 
              onClick={() => setPreference('fontSize', Math.min(24, preferences.fontSize + 2))}
            >
              增大
            </Button>
          </div>
        </div>
        <div className={styles.row}>
          <Label>仅显示未读</Label>
          <Switch 
            checked={preferences.showUnreadOnly}
            onChange={(e, data) => setPreference('showUnreadOnly', data.checked || false)}
          />
        </div>
      </div>
      
      <Card className={styles.infoCard}>
        <CardHeader header="状态持久化信息" />
        <div className={styles.persistInfo}>
          <Text weight="semibold">持久化数据存储在 localStorage 中</Text>
          <Text>• 修改上述"持久化"标记的设置后，请刷新页面或打开新标签页测试</Text>
          <Text>• "文章面板状态"未被持久化，刷新后会重置</Text>
          <Text>• localStorage 键名: app-storage</Text>
          <Button 
            onClick={() => {
              localStorage.removeItem('app-storage');
              window.location.reload();
            }}
          >
            清除持久化数据并重新加载
          </Button>
        </div>
      </Card>
    </div>
  );
}