import { useRouteError, Link } from "react-router-dom";
const ErrorPage = () => {
  const error = useRouteError();
  if (error.status === 404)
    return (
      <main className="bg-primary grid min-h-[100vh] place-items-center px-8">
        <div className="text-center">
          <p className="text-9xl font-semibold text-gray-100">404</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-lg leading-7 ">
            Sorry, we couldn't find the page you are looking for.
          </p>
          <div className="mt-10">
            <Link
              to="/"
              className="bg-gray-600 text-white hover:bg-gray-700 font-semibold py-2 px-4 rounded"
            >
              Go back home
            </Link>
          </div>
        </div>
      </main>
    );

  return (
    <main className="bg-primary grid min-h-[100vh] place-items-center px-8">
      <div className="text-center text-gray-100 font-bold text-4xl">
        there was an error...
      </div>
    </main>
  );
};

export default ErrorPage;
