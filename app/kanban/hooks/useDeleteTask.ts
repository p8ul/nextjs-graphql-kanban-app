import { useMutation } from '@apollo/client';
import { DELETE_TASK } from '../graphql/mutations';

export const useDeleteTask = ({ onComplete }: { onComplete?: () => void }) => {
  const [mutation, options] = useMutation(DELETE_TASK, {
    onCompleted: (data: any) => {
      onComplete && onComplete();
    },
  });

  return [mutation, options];
};
