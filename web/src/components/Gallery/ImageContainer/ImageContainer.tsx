import {
  query as dbQuery,
  startAfter,
  limit,
  orderBy,
  Query,
  onSnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import Fuse from 'fuse.js';
import { useEffect, useRef, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useDebounce } from 'react-use';

import useQuery from '../../../hooks/useQuery';
import { useImage, useLibrary } from '../../../contexts';
import { RouterParams, Image } from '../../../interfaces';
import { db } from '../../../server/firebase';

import Images from './Images';
import NoImage from '../NoImage';
import ImageNotFound from './ImageNotFound';
import ImageLoading from './ImageLoading';
import LoadMore from './LoadMore';
import DropZoneBackground from './DropZoneBackground';

const QUERY_LIMIT = 15;

export default function ImageContainer() {
  const { setActiveLibrary, loading: loadingLib, uploadImages, activeLibrary } = useLibrary();
  const { imageArray, setImageArray, setImageMap, flattenArray } = useImage();
  const [loadingImages, setLoadingImages] = useState(true);

  const unsubscribes = useRef<Array<() => void>>([]);
  const [cursor, setCursor] = useState<QueryDocumentSnapshot>();

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
      let imagesRef: Query<Image>;

      if (cursor) {
        imagesRef = dbQuery(
          db.images(libID),
          orderBy('upload_date'),
          startAfter(cursor),
          limit(QUERY_LIMIT)
        );
      } else {
        imagesRef = dbQuery<Image>(
          db.images(libID),
          orderBy('upload_date', 'desc'),
          limit(QUERY_LIMIT)
        );
      }

      const unsubscribe = onSnapshot(imagesRef, (snapshot) => {
        setLoadingImages(false);

        setImageArray((arr) => {
          arr[listenerIndex] = snapshot.docs.map((img) => ({
            ...img.data(),
            id: img.id,
          })) as Image[];
          return [...arr];
        });

        setImageMap((map) => {
          const imageMap = { ...map };
          snapshot.docChanges().forEach((change) => {
            if (change.type !== 'removed') {
              imageMap[change.doc.id] = { ...change.doc.data(), id: change.doc.id } as Image;
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
    <div className="overflow-y-scroll flex-grow min-h-0 px-4" {...getRootProps()}>
      <div className="relative w-full p-2 h-full">
        <div
          className="relative"
          style={{
            minHeight: 'calc(100% - 3rem)',
          }}
        >
          <DropZoneBackground active={isDragActive} />

          {renderImages()}
        </div>

        <div className="py-4 mx-auto flex flex-row justify-center">
          {!!cursor && activeLibrary && flattenArray.length < activeLibrary?.image_count && (
            <LoadMore onClick={() => loadMore(libParam)} />
          )}
        </div>
      </div>
    </div>
  );
}
