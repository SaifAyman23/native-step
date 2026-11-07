import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from "react";

const DEFAULT_TAB_BAR_HEIGHT = 100;
const CONTENT_BOTTOM_GAP = 8;

const TabBarInsetContext = createContext<{
  bottomInset: number;
  setHeight: (height: number) => void;
}>({
  bottomInset: 0,
  setHeight: () => undefined,
});

export function TabBarInsetProvider({ children }: PropsWithChildren) {
  const [height, setHeight] = useState(DEFAULT_TAB_BAR_HEIGHT);

  return (
    <TabBarInsetContext.Provider
      value={{ bottomInset: height + CONTENT_BOTTOM_GAP, setHeight }}
    >
      {children}
    </TabBarInsetContext.Provider>
  );
}

export function useTabBarBottomInset() {
  return useContext(TabBarInsetContext).bottomInset;
}

export function useTabBarHeightReporter() {
  return useContext(TabBarInsetContext).setHeight;
}
