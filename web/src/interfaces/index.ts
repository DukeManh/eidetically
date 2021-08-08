import firebase from 'firebase/app';
import { ReactNode, Dispatch, SetStateAction } from 'react';
import { TriggerProps } from 'rc-trigger';

// Common props of Context Providers
export interface ProviderProps {
  children: ReactNode;
}

// Navigation and Properties sidebar
export interface SidebarLayout {
  visible: boolean;
  width: number;
}

// Each library consists of many individual images
export interface Library {
  id: string;
  name: string;
  image_count: number;
  owner: string;
}

// Metadata of uploaded Image
export interface MetaData {
  contentType: string;
  size: number;
  fullPath: string;
}

// Uploaded image
export interface Image extends MetaData {
  name: string;
  downloadURL: string;
  id: string;
  library: firebase.firestore.DocumentReference<Partial<Library>>;
  note: string;
  upload_date: firebase.firestore.FieldValue;
}

// imageID-Image object, cursor points to the last document
export interface Images {
  [imageID: string]: Image | undefined;
}

export interface LayoutContextType {
  navigation: SidebarLayout;
  updateNavigation: (props: Partial<SidebarLayout>) => void;

  properties: SidebarLayout;
  updateProperties: (props: Partial<SidebarLayout>) => void;

  isMobile: boolean;

  maxNavigationWidth: () => number;
  maxPropertiesWidth: () => number;

  zoom: number;
  setZoom: (val: number) => void;
}

export interface LibraryContextType {
  libraries: Library[];
  loading: boolean;

  activeLibrary: Library | undefined;
  setActiveLibrary: (id: string) => void;

  uploadImages: (acceptedFiles: File[]) => void;
}

export interface ImageContextType {
  images?: Images;
  setImages: Dispatch<SetStateAction<Images | undefined>>;

  selecting: boolean;
  startSelecting: () => void;
  cancelSelecting: () => void;

  selection: { [imageID: string]: Image | undefined };
  select: (image: Image) => void;

  focused: Image | undefined;
  focus: (image: Image) => void;

  deleteSelection: () => void;

  slideVisible: boolean;
  toggleSlide: () => void;
}

export interface AuthContextType {
  user: firebase.User | null;

  loginVisible: boolean;
  setLoginVisible: Dispatch<SetStateAction<boolean>>;

  logout: () => void;
}

export interface RouterParams {
  libParam: string;
}

export interface ConfirmProps {
  content: ReactNode;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  placement?: TriggerProps['popupPlacement'];
}

// Popup menu
export interface MenuItem {
  name: string;
  handler: () => void;
  subMenu?: MenuItem;
  content: JSX.Element | string;
  icon?: JSX.Element;
  confirm?: ConfirmProps;
}
