import { useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import colors from 'tailwindcss/colors';
import firebase from 'firebase';

import { useLayout, useImage, useLibrary } from '../../contexts';
import { RouterParams, Image } from '../../interfaces';
import { db } from '../../server/firebase';

import Figure from './Figure';
import Mask from '../Mask';

const QUERY_LIMIT = 15;

export default function Images() {
  const { setActiveLibrary, loading: loadingLib, uploadImages } = useLibrary();
  const { images, setImages } = useImage();
  const { zoom } = useLayout();
  const { libParam } = useParams<RouterParams>();
  const unsubscribes = useRef<Array<() => void>>([]); // Array of snapshot unsubscribers

  const { getRootProps, isDragActive } = useDropzone({
    onDrop: (files) => uploadImages(files),
    accept: 'image/*',
  });

  const loadMore = useCallback(
    (libID) => {
      let imagesRef: firebase.firestore.Query<Image | Partial<Image>>;

      if (images?.cursor) {
        imagesRef = db
          .images(libID)
          .orderBy('upload_date')
          .startAfter(images.cursor)
          .limit(QUERY_LIMIT);
      } else {
        imagesRef = db.images(libID).orderBy('upload_date').limit(15);
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
          cursor:
            snapshot.docs.length === QUERY_LIMIT
              ? snapshot.docs[snapshot.docs.length - 1]
              : undefined,
          images: { ...prevImages?.images, ...libImages },
        }));
      });

      unsubscribes.current.push(unsubscribe);
    },
    [images, setImages]
  );

  useEffect(() => {
    setActiveLibrary(libParam);
    setImages(undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [libParam, loadingLib]);

  useEffect(() => {
    return unsubscribes.current.forEach((unsubscribe) => unsubscribe());
  }, []);

  useEffect(() => {
    if (!images && !loadingLib && libParam) {
      unsubscribes.current.forEach((unsubscribe) => unsubscribe());
      unsubscribes.current = [];
      loadMore(libParam);
    }
  }, [libParam, images, loadMore, loadingLib]);

  return (
    <div className="p-2 relative min-h-full" {...getRootProps()}>
      {isDragActive && (
        <Mask
          visible
          style={{
            position: 'absolute',
            height: '100%',
            border: `2px solid ${colors.blue[600]}`,
            animation: 'dropzoneBackground 800ms ease-in-out infinite alternate',
          }}
        />
      )}
      <div
        className="waterfall-layout"
        style={{ columnWidth: zoom }}
        onDrop={(ev) => {
          ev.preventDefault();
          const src = ev.dataTransfer.getData('src');
          console.log(src);
        }}
      >
        {(Object.values(images?.images || {}).filter((image) => !!image) as Image[]).map(
          (image) => (
            <Figure key={image.id} image={image} />
          )
        )}
      </div>

      <div className="py-4 mx-auto flex flex-row justify-center">
        {images?.cursor && (
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
