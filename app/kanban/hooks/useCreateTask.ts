import { useMutation } from '@apollo/client';
import { CREATE_TASK } from '../graphql/mutations';

export const useCreateTask = ({ onComplete }: { onComplete?: () => void }) => {
  const [mutation, options] = useMutation(CREATE_TASK, {
    onCompleted: (data: any) => {
      onComplete && onComplete();
    },
  });

  return [mutation, options];
};
