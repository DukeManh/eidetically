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

export type MetaData = {
  contentType: string;
  size: number;
  fullPath: string;
};
export interface UploadedFile extends MetaData {
  name: string;
  downloadURL: string;
}
export interface Image extends UploadedFile {
  id: string;
  library: firebase.firestore.DocumentReference<Partial<Library>>;
  note: string;
  upload_date: firebase.firestore.FieldValue;
}

export type LibraryContextType = {
  libraries: Library[];

  activeLibrary: Library | undefined;
  setActiveLibrary: (id: string | undefined) => void;

  uploadImages: (acceptedFiles: File[]) => void;
};

export type Images = {
  [libId: string]: {
    [imageID: string]: Image;
  };
};

export type ImageContextType = {
  images: Images;

  selecting: boolean;
  startSelecting: () => void;
  cancelSelecting: () => void;

  selected: { [imageID: string]: Image | undefined };
  select: (image: Image) => void;

  focused: Image | undefined;
  focus: (image: Image) => void;

  deleteSelection: () => void;
};

export type AuthContextType = {
  user: firebase.User | null;

  loginVisible: boolean;
  setLoginVisible: (value: boolean) => void;
};
