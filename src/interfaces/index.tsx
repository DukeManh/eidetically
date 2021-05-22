import { ReactNode } from 'react';

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

export interface UploadedFile extends File {
  preview: string;
}

export type ImageContextType = {
  images: Array<UploadedFile>;
  uploadFiles: (acceptedFiles: Array<File>) => void;
  selectFiles: () => void;
};

export type ProviderProps = {
  children: ReactNode;
};
