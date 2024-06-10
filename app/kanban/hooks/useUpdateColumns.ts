import { useMutation } from "@apollo/client";
import { UPDATE_COLUMNS } from "../graphql/mutations";

export const useUpdateColumns = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  const [mutation, options] = useMutation(UPDATE_COLUMNS, {
    onCompleted: (data: any) => {
      onComplete && onComplete();
    },
  });

  return [mutation, options];
};
