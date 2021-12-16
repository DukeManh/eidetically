import firebase from 'firebase';
import Fuse from 'fuse.js';
import { useEffect, useRef, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useDebounce } from 'react-use';

import useQuery from '../../hooks/useQuery';
import { useImage, useLibrary } from '../../contexts';
import { RouterParams, Image } from '../../interfaces';
import { db } from '../../server/firebase';

import Images from './Images';
import NoImage from './NoImage';
import ImageNotFound from './ImageNotFound';
import ImageLoading from './ImageLoading';

const QUERY_LIMIT = 50;

export default function ImageContainer() {
  const { setActiveLibrary, loading: loadingLib, uploadImages, activeLibrary } = useLibrary();
  const { imageArray, setImageArray, setImageMap, flattenArray } = useImage();
  const [loadingImages, setLoadingImages] = useState(true);

  const unsubscribes = useRef<Array<() => void>>([]);
  const [cursor, setCursor] =
    useState<firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>>();

  const fuse = useRef<Fuse<Image>>();

  const { libParam } = useParams<RouterParams>();
  const { query } = useQuery();
  const [searchResults, setSearchResults] = useState<Image[]>();

  const { getRootProps, isDragActive } = useDropzone({
    onDrop: (files) => uploadImages(files),
    accept: 'image/*',
  });

  // Query new images starting from the last cursor
  const loadMore = useCallback(
    (libID) => {
      const listenerIndex = imageArray.length;

      setLoadingImages(true);
      let imagesRef: firebase.firestore.Query<Image | Partial<Image>>;

      if (cursor) {
        imagesRef = db.images(libID).orderBy('upload_date').startAfter(cursor).limit(QUERY_LIMIT);
      } else {
        imagesRef = db
          .libraries()
          .doc(libID)
          .collection('images')
          .orderBy('upload_date')
          .limit(QUERY_LIMIT);
      }

      const unsubscribe = imagesRef.onSnapshot((snapshot) => {
        setLoadingImages(false);

        setImageArray((arr) => {
          arr[listenerIndex] = snapshot.docs.map((img) => ({
            id: img.id,
            ...img.data(),
          })) as Image[];
          return [...arr];
        });

        setImageMap((map) => {
          const imageMap = { ...map };
          snapshot.docChanges().forEach((change) => {
            if (change.type !== 'removed') {
              imageMap[change.doc.id] = { id: change.doc.id, ...change.doc.data() } as Image;
            } else {
              delete imageMap[change.doc.id];
            }
          });
          return imageMap;
        });

        setCursor(
          snapshot.docs.length === QUERY_LIMIT ? snapshot.docs[snapshot.docs.length - 1] : undefined
        );
      });

      unsubscribes.current.push(unsubscribe);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cursor, setImageArray, setImageMap, imageArray.length]
  );

  // Clean up states on changing library
  useEffect(() => {
    setActiveLibrary(libParam);
    setImageArray([]);
    setImageMap({});
    setCursor(undefined);
    fuse.current = undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [libParam, loadingLib]);

  // Unsubscribe to all listeners on mount
  useEffect(() => {
    return unsubscribes.current.forEach((unsubscribe) => unsubscribe());
  }, []);

  // First images load
  useEffect(() => {
    if (!imageArray.length && !loadingLib && libParam) {
      unsubscribes.current.forEach((unsubscribe) => unsubscribe());
      unsubscribes.current = [];
      loadMore(libParam);
    }
  }, [libParam, imageArray.length, loadMore, loadingLib]);

  // Index image array on change
  useEffect(() => {
    fuse.current = new Fuse(flattenArray, {
      keys: ['name', 'note', 'id'],
      threshold: 0.3,
    });
  }, [flattenArray]);

  // Debounce search 400ms
  useDebounce(
    () => {
      const param = query.get('s');
      if (param && !loadingImages) {
        const results = fuse.current?.search(param).flatMap((image) => ({
          ...image.item,
        }));

        setSearchResults(results);
      } else {
        setSearchResults(undefined);
      }
    },
    400,
    [query.get('s'), loadingImages]
  );

  const renderImages = () => {
    if (loadingImages) {
      return <ImageLoading />;
    }

    if (!flattenArray.length) {
      return <NoImage />;
    }

    if (searchResults?.length) {
      return <Images images={searchResults} />;
    }
    if (searchResults) {
      return <ImageNotFound />;
    }

    return <Images images={flattenArray} />;
  };

  return (
    <div className="flex-grow min-h-0" {...getRootProps()}>
      <div className="relative w-full p-2 h-full">
        {isDragActive && (
          <div className="w-full h-full border-[3px] border-blue-500 z-[50] absolute top-0 left-0">
            <div className="h-full dropzoneBg"></div>
          </div>
        )}

        {renderImages()}
      </div>

      <div className="py-4 mx-auto flex flex-row justify-center">
        {!!cursor && activeLibrary && flattenArray.length < activeLibrary?.image_count && (
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
