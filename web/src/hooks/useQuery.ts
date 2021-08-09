import { useLocation, useHistory } from 'react-router-dom';

export default function useQuery() {
  const location = useLocation();
  const history = useHistory();
  const query = new URLSearchParams(location.search);

  const setQuery = (name: string, value: string, keepOtherExistingQueries = true) => {
    const queryParam = query;
    if (!keepOtherExistingQueries) {
      queryParam.forEach((qName) => {
        queryParam.delete(qName);
      });
    }
    if (!value) {
      queryParam.delete(name);
    } else {
      queryParam.set(name, value);
    }

    history.push({
      pathname: location.pathname,
      search: queryParam.toString(),
    });
  };

  return { query, setQuery };
}
