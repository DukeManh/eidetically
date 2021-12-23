export interface LoadMoreProps {
  onClick: () => void;
}

export default function LoadMore({ onClick }: LoadMoreProps) {
  return (
    <button
      className="py-1 px-2 rounded-sm border border-white transition-colors hover:bg-tabFocus shadow-md"
      onClick={onClick}
    >
      Load more
    </button>
  );
}
