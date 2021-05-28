import { Library } from '../interfaces';
import { auth, db } from './firebase';

export async function getLibraries(): Promise<Library[]> {
  if (auth.currentUser) {
    return [];
  }
  return [];
}

export async function getImages(): Promise<void> {}

export async function uploadImages(acceptedFiles: File[]): Promise<void> {}
