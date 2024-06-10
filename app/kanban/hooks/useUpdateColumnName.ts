import { useMutation } from "@apollo/client";
import {  UPDATE_COLUMN_NAME } from "../graphql/mutations";

export const useUpdateColumnName = ({
  onComplete,
}: {
  onComplete?: () => void;
}) => {
  const [mutation, options] = useMutation(UPDATE_COLUMN_NAME, {
    onCompleted: (data: any) => {
      onComplete && onComplete();
    },
  });

  return [mutation, options];
};
