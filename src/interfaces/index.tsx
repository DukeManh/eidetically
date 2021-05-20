export type SidebarLayout = {
  visible: boolean;
  width: number;
};

export type LayoutContextType = {
  navigation: SidebarLayout;
  updateNavigation: (props: Partial<SidebarLayout>) => void;

  properties: SidebarLayout;
  updateProperties: (props: Partial<SidebarLayout>) => void;

  isMobile: boolean;

  maxNavigationWidth: () => number;

  maxPropertiesWidth: () => number;
};
