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

  zoom: number;
  setZoom: (value: number) => void;
};

export type Library = {
  id: string;
  name: string;
  image_count: number;
  owner: string;
};

export interface UploadedFile extends File {
  downloadURL: string;
}

export type Image = {
  id: string;
  library: firebase.firestore.DocumentReference<Partial<Library>>;
  name: string;
  src: string;
  note: string;
  upload_date: firebase.firestore.FieldValue;
};

export type LibraryContextType = {
  libraries: Library[];
  images: { [key: string]: Image[] };

  activeLibrary: Library | undefined;
  setActiveLibrary: (id: string | undefined) => void;

  uploadImages: (acceptedFiles: File[]) => void;
};

export type AuthContextType = {
  user: firebase.User | null;

  loginVisible: boolean;
  setLoginVisible: (value: boolean) => void;
};
