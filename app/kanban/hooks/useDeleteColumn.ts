import { useMutation } from '@apollo/client';
import { DELETE_COLUMN } from '../graphql/mutations';

export const useDeleteColumn = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  const [mutation, options] = useMutation(DELETE_COLUMN, {
    onCompleted: (data: any) => {
      onComplete && onComplete();
    },
  });

  return [mutation, options];
};
