import firebase from 'firebase';
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

export type User = {
  name: string;
  library_count: number;
};

export type Library = {
  user: firebase.firestore.DocumentReference<User>;
  id: string;
  name: string;
  image_count: number;
};

export type Image = {
  library: firebase.firestore.DocumentReference<Library>;
  name: string;
  src: string;
  note: string;
};

export type StorageContextType = {
  libraries: Library[];

  uploadFiles: (acceptedFiles: File[]) => void;
  selectFiles: () => void;

  activeLibrary: Library | undefined;
  setActiveLibrary: (id: string) => void;
};
