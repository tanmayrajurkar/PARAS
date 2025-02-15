import { Suspense, lazy, useEffect } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { supabase } from './lib/supabase';
import { initializeAuth, logout } from './features/authentication/authUserSlice';
import PrivateRoute from "./routes/PrivateRoute";
import ErrorPage from "./pages/ErrorPage"
import { ErrorElement, Loader } from "./components";
import AdminDashboard from "./pages/AdminDashboard";
import GovDashboard from './components/GovDashboard';


const HomeLayout = lazy(() => import("./pages/HomeLayout"));
const Landing = lazy(() => import("./pages/Landing"));
const About = lazy(() => import("./pages/About"));
const ListBookings = lazy(() => import("./pages/ListBookings"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const SingleBooking = lazy(() => import("./pages/SingleBooking"));
const MapBookings = lazy(() => import("./pages/MapBookings"));
const Confirmation = lazy(() => import("./pages/Confirmation"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const UploadParking = lazy(() => import("./pages/UploadParking"));
const CommercialParkingForm = lazy(() => import("./pages/CommercialParkingForm"));
const IndividualParkingForm = lazy(() => import("./pages/IndividualParkingForm"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loader />}>
        <HomeLayout />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader />}>
            <Landing />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <Suspense fallback={<Loader />}>
            <About />
          </Suspense>
        ),
      },
      {
        path: "mapbookings",
        element: (
          <Suspense fallback={<Loader />}>
            <MapBookings />
          </Suspense>
        ),
        errorElement: <ErrorElement />,
      },
      {
        path: "listbookings",
        element: (
          <Suspense fallback={<Loader />}>
            <ListBookings/>
          </Suspense>
        ),
        errorElement: <ErrorElement />,
      },
      {
        path: "listbookings/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <SingleBooking />
          </Suspense>
        ),
        errorElement: <ErrorElement />,
      },
      {
        path: "listbookings/:id/confirm",
        element: (
          <Suspense fallback={<Loader />}>
            <Confirmation />
          </Suspense>
        ),
        errorElement: <ErrorElement />,
      },
      {
        path: "mybookings",
        element: (
          <PrivateRoute>
            <Suspense fallback={<Loader />}>
              <MyBookings />
            </Suspense>
          </PrivateRoute>
        ),
      },
      {
        path: "upload",
        element: <UploadParking />,
      },
      {
        path: "upload/commercial",
        element: <CommercialParkingForm />,
      },
      {
        path: "upload/individual",
        element: <IndividualParkingForm />,
      },
      {
        path: "admin",
        element: <AdminDashboard />,
      },
      {
        path: "gov",
        element: <GovDashboard />,
      },
    ],
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loader />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: "/register",
    element: (
      <Suspense fallback={<Loader />}>
        <Register />
      </Suspense>
    ),
  },
]);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initialize auth state
    dispatch(initializeAuth());

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        dispatch(logout());
      } else if (session) {
        dispatch(initializeAuth());
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [dispatch]);

  return <RouterProvider router={router} />;
};

export default App;
