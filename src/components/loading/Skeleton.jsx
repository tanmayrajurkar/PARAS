const Skeleton = () => {
  return (
    <div className="border p-4 shadow-2xl max-w-[500px]  w-full shadow-cyan-500/50 hover:shadow-lg hover:shadow-gray-200 transition-shadow duration-300 rounded-lg overflow-hidden mb-4;">
      {/* Skeleton for the image */}
      <div className="relative h-40 mb-4 bg-gray-300 animate-pulse">
        <svg
          className="absolute w-full h-full text-gray-200 dark:text-gray-600"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 18"
        >
          <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
        </svg>
      </div>

      {/* Skeleton for the price badge */}
      <div className="absolute top-1 left-1 bg-gray-300 text-gray-200 px-2 py-1 rounded font-semibold font-poppins tracking-wide animate-pulse"></div>

      {/* Skeleton for the title */}
      <div className="h-6 bg-gray-300 rounded-full mb-2 animate-pulse"></div>

      {/* Skeleton for the total  basements*/}
      <div className="h-4 bg-gray-300 rounded-full mb-2 animate-pulse"></div>
      <div className="h-4 bg-gray-300 rounded-full mb-2 animate-pulse"></div>
      <div className="h-4 bg-gray-300 rounded-full mb-2 animate-pulse"></div>
    </div>
  );
};

export default Skeleton;
