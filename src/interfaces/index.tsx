import firebase from 'firebase';
import { ReactNode } from 'react';

// Common props of Context Providers
export type ProviderProps = {
  children: ReactNode;
};

// Navigation and Properties sidebar
export type SidebarLayout = {
  visible: boolean;
  width: number;
};

// Each library consists of many individual images
export type Library = {
  id: string;
  name: string;
  image_count: number;
  owner: string;
};

// Metadata of uploaded Image
export type MetaData = {
  contentType: string;
  size: number;
  fullPath: string;
};

// Uploaded image
export interface Image extends MetaData {
  name: string;
  downloadURL: string;
  id: string;
  library: firebase.firestore.DocumentReference<Partial<Library>>;
  note: string;
  upload_date: firebase.firestore.FieldValue;
}

export type Images = {
  [libId: string]: {
    [imageID: string]: Image;
  };
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

export type LibraryContextType = {
  libraries: Library[];

  activeLibrary: Library | undefined;
  setActiveLibrary: (id: string | undefined) => void;

  uploadImages: (acceptedFiles: File[]) => void;
};

export type ImageContextType = {
  images: Images;
  activeImages: { [imageID: string]: Image };

  selecting: boolean;
  startSelecting: () => void;
  cancelSelecting: () => void;

  selected: { [imageID: string]: Image | undefined };
  select: (image: Image) => void;

  focused: Image | undefined;
  focus: (image: Image) => void;

  deleteSelection: () => void;

  slideVisible: boolean;
  toggleSlide: () => void;
};

export type AuthContextType = {
  user: firebase.User | null;

  loginVisible: boolean;
  setLoginVisible: (value: boolean) => void;

  logout: () => void;
};

export type RouterParams = {
  libParam: string;
};
