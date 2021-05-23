import { ReactNode } from 'react';

export type ProviderProps = {
  children: ReactNode;
};

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

export type Library = {
  id: string;
  images: UploadedFile[];
  name: string;
};

export type Storage = {
  [id: string]: Library;
};

export type StorageContextType = {
  storage: Storage;
  uploadFiles: (acceptedFiles: File[]) => void;
  selectFiles: () => void;
  activeLibrary: string;
  setActiveLibrary: (id: string) => void;
};
