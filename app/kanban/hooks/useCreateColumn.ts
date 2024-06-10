import { useMutation } from "@apollo/client";
import { CREATE_COLUMN } from "../graphql/mutations";

export const useCreateColumn = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  const [mutation, options] = useMutation(CREATE_COLUMN, {
    onCompleted: (data: any) => {
      onComplete && onComplete();
    },
  });

  return [mutation, options];
};
