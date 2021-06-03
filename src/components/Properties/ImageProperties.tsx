import { useImage } from '../../contexts';

export default function ImageProperties() {
  const { focused } = useImage();

  return <>{focused && <img src={focused.downloadURL} alt={focused.name}></img>}</>;
}
