import { useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';

import { useLayout, useImage, useLibrary } from '../../contexts';
import { RouterParams, Image } from '../../interfaces';
import { db } from '../../server/firebase';

import Figure from './Figure';

const QUERY_LIMIT = 15;

export default function Images() {
  const { setActiveLibrary, loading: loadingLib } = useLibrary();
  const { images, setImages } = useImage();
  const { zoom } = useLayout();
  const { libParam } = useParams<RouterParams>();
  const unsubscribes = useRef<Array<() => void>>([]); // Array of snapshot listener cancellation function

  const loadMore = useCallback(
    (libID) => {
      let imagesRef;

      if (images?.cursor) {
        imagesRef = db.libraries
          .doc(libID)
          .collection('images')
          .orderBy('upload_date')
          .startAfter(images.cursor)
          .limit(QUERY_LIMIT);
      } else {
        imagesRef = db.libraries.doc(libID).collection('images').orderBy('upload_date').limit(15);
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
    <>
      <div className="waterfall-layout" style={{ columnWidth: zoom }}>
        {Object.values(images?.images || {})
          .filter((image) => !!image)
          .map((image) => (
            <>{image && <Figure key={image.id} image={image} />}</>
          ))}
      </div>

      <div className="py-4 mx-auto flex flex-row justify-center">
        {images?.cursor && (
          <button
            className="bg-tabActive hover:bg-tabFocus py-1 px-2 rounded-sm"
            onClick={() => loadMore(libParam)}
          >
            Load more
          </button>
        )}
      </div>
    </>
  );
}
