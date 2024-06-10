import { useQuery } from '@apollo/client';
import { GET_COLUMNS } from '../graphql/queries';

export const useGetColumns = () => {
  return useQuery(GET_COLUMNS);
};
