import Information from './ImageProperties/Information';

import { useLibrary } from '../../contexts';

export default function LibraryInformation() {
  const { activeLibrary } = useLibrary();

  const infos = activeLibrary
    ? [
        { name: 'Name', value: activeLibrary.name },
        { name: 'Image count', value: activeLibrary.image_count },
        {
          name: 'Last opened',
          value: new Date().toDateString(),
        },
        {
          name: 'Created Date',
          value: new Date().toDateString(),
        },
      ]
    : [];
  return <Information infos={infos} />;
}
