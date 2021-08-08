import firebase from 'firebase';
import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

import { useLayout, useImage, useLibrary } from '../../contexts';
import { RouterParams, Image } from '../../interfaces';
import { db } from '../../server/firebase';

import Figure from './Figure';

const QUERY_LIMIT = 15;

export default function Images() {
  const { setActiveLibrary, loading: loadingLib, uploadImages, activeLibrary } = useLibrary();
  const { images, setImages } = useImage();
  const { zoom } = useLayout();
  const { libParam } = useParams<RouterParams>();
  const unsubscribes = useRef<Array<() => void>>([]); // Array of snapshot unsubscribers
  const [cursor, setCursor] =
    useState<firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>>();

  const { getRootProps, isDragActive } = useDropzone({
    onDrop: (files) => uploadImages(files),
    accept: 'image/*',
  });

  const loadMore = useCallback(
    (libID) => {
      console.log('called');
      let imagesRef: firebase.firestore.Query<Image | Partial<Image>>;

      // start querying from the last cursor
      if (cursor) {
        imagesRef = db.images(libID).orderBy('upload_date').startAfter(cursor).limit(QUERY_LIMIT);
      } else {
        imagesRef = db.libraries().doc(libID).collection('images').orderBy('upload_date').limit(15);
      }

      const unsubscribe = imagesRef.onSnapshot((snapshot) => {
        const libImages: { [imageID: string]: Image | undefined } = {};
        snapshot.docChanges().forEach((change) => {
          if (change.type !== 'removed') {
            libImages[change.doc.id] = { id: change.doc.id, ...change.doc.data() } as Image;
          } else {
            libImages[change.doc.id] = undefined;
          }
        });

        setImages((prevImages) => ({
          ...prevImages,
          ...libImages,
        }));

        setCursor(
          snapshot.docs.length === QUERY_LIMIT ? snapshot.docs[snapshot.docs.length - 1] : undefined
        );
      });

      unsubscribes.current.push(unsubscribe);
    },
    [cursor, setImages]
  );

  useEffect(() => {
    setActiveLibrary(libParam);
    setImages(undefined);
    setCursor(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [libParam, loadingLib]);

  useEffect(() => {
    return unsubscribes.current.forEach((unsubscribe) => unsubscribe());
  }, []);

  useEffect(() => {
    console.log(images, loadingLib, libParam);
    if (!images && !loadingLib && libParam) {
      unsubscribes.current.forEach((unsubscribe) => unsubscribe());
      unsubscribes.current = [];
      loadMore(libParam);
    }
  }, [libParam, images, loadMore, loadingLib]);

  const imageArray = useMemo(
    () => Object.values(images || {}).filter((image) => !!image) as Image[],
    [images]
  );

  return (
    <div className="p-2 relative min-h-full" {...getRootProps()}>
      {isDragActive && (
        <div className="w-full h-full border-2 border-dotted bg-blue-500 bg-opacity-20 border-blue-600 absolute top-0 left-0 dropZone" />
      )}
      <div className="waterfall-layout" style={{ columnWidth: zoom }}>
        {imageArray.map((image) => (
          <Figure key={image.id} image={image} />
        ))}
      </div>

      <div className="py-4 mx-auto flex flex-row justify-center">
        {!!cursor && activeLibrary && imageArray.length < activeLibrary?.image_count && (
          <button
            className="py-1 px-2 rounded-sm border border-white transition-colors hover:bg-tabFocus shadow-md"
            onClick={() => loadMore(libParam)}
          >
            Load more
          </button>
        )}
      </div>
    </div>
  );
}
