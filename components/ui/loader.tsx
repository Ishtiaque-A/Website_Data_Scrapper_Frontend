import { ClipLoader } from 'react-spinners';

export default function LoadingComponent({ isLoading }: { isLoading: boolean }) {
  return (
    <div>
      {isLoading ? (
        <ClipLoader color="#007bff" loading={isLoading} size={50} />
      ) : (
        'Content goes here'
      )}
    </div>
  );
};
