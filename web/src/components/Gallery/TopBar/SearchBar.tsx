import { HiOutlineSearch } from 'react-icons/hi';
import { ImCancelCircle } from 'react-icons/im';

import useQuery from '../../../hooks/useQuery';

export default function SearchBar() {
  const { query, setQuery } = useQuery();

  return (
    <form className="searchForm">
      <div className="searchIcon">
        <HiOutlineSearch />
      </div>
      <input
        className="searchBox"
        type="text"
        placeholder="Search"
        onChange={(e) => setQuery('s', e.target.value)}
        value={query.get('s') || ''}
      ></input>
      {!!query.get('s') && (
        <div className="cancelIcon">
          <ImCancelCircle
            size={'1rem'}
            className="hover:text-gray-300 active:text-tabActive transition-colors"
            onClick={() => {
              setQuery('s', '');
            }}
          />
        </div>
      )}
    </form>
  );
}
