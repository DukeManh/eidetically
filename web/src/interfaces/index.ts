import { DocumentReference, Timestamp } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { ReactNode, Dispatch, SetStateAction } from 'react';
import { TriggerProps } from 'rc-trigger';

// Common props of Context Providers
export interface ProviderProps {
  children: ReactNode;
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
  note: string;
  name: string;
  source: string;
}

// Uploaded image
export interface Image extends MetaData {
  downloadURL: string;
  previewURL: string;
  id: string;
  library: DocumentReference<Partial<Library>>;
  upload_date: Timestamp;
  last_updated: Timestamp;
}

export interface ImageFile extends File {
  metaData?: Partial<MetaData>;
}
export interface MutableImageProperties {
  name: string;
  note: string;
  source: string;
}

// imageID-Image object, cursor points to the last document
export interface ImageMap {
  [imageID: string]: Image | undefined;
}

export type Layout = 'Waterfall' | 'Justified';

export interface LayoutContextType {
  navigationWidth: number;
  setNavigationWidth: (val: number) => void;
  navigationVisible: boolean;
  toggleNavigation: (val: boolean) => void;
  detailsVisible: boolean;
  toggleDetails: (val: boolean) => void;
  DefaultSidebarWidth: number;

  isMobile: boolean;
  zoom: number;
  maxZoom: number;
  minZoom: number;
  setZoom: (val: number) => void;
  layout: Layout;
  setLayout: (val: Layout) => void;
}

export interface LibraryContextType {
  libraries: Library[];
  loading: boolean;

  activeLibrary: Library | undefined;
  setActiveLibrary: (id: string) => void;

  uploadImages: (acceptedFiles: File[]) => void;
}

export interface ImageContextType {
  imageArray: Image[][];
  imageMap: ImageMap;
  setImageArray: Dispatch<SetStateAction<Image[][]>>;
  setImageMap: Dispatch<SetStateAction<ImageMap>>;
  flattenArray: Image[];
  selectedItemsNum: number;

  selecting: boolean;
  startSelecting: () => void;
  cancelSelecting: () => void;

  selection: { [imageID: string]: Image };
  select: (image: Image) => void;

  focused: Image | undefined;
  focus: (image: Image) => void;

  deleteSelection: () => void;

  slideVisible: boolean;
  toggleSlide: (val?: boolean) => void;
  editorVisible: boolean;
  toggleEditor: (val?: boolean) => void;

  cutToClipboard: (fromLibrary: string) => void;
  copyToClipboard: (fromLibrary: string) => void;
  paste: (toLibrary: string) => void;
  clipboard: { clipboard: Image[]; operation: 'cut' | 'copy'; fromLibrary: string } | undefined;
}

export interface AuthContextType {
  user: User | null;

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
  icon?: ReactNode;
  confirm?: ConfirmProps;
}
