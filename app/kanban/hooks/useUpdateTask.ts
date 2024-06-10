import { useMutation } from "@apollo/client";
import { UPDATE_TASK } from "../graphql/mutations";

export const useUpdateTask = ({ onComplete }: { onComplete?: () => void }) => {
  const [mutation, options] = useMutation(UPDATE_TASK, {
    onCompleted: (data: any) => {
      onComplete && onComplete();
    },
  });

  return [mutation, options];
};
