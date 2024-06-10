import { useMutation } from "@apollo/client";
import { CLEAR_COLUMN_TASKS } from "../graphql/mutations";

export const useClearColumnTasks = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  const [mutation, options] = useMutation(CLEAR_COLUMN_TASKS, {
    onCompleted: (data: any) => {
      onComplete && onComplete();
    },
  });

  return [mutation, options];
};
