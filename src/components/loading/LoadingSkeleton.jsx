import Skeleton from "./Skeleton";
const LoadingSkeleton = ({ count }) => (
  <div className="p-5 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <Skeleton key={index} />
    ))}
  </div>
);

export default LoadingSkeleton;
