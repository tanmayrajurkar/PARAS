import { Outlet, useLocation } from "react-router-dom";
import { Header, Navbar } from "../components";
import styles from "../style";
const HomeLayout = () => {
  const location = useLocation();

  // Check if on /listbookings/:id or /listbookings/:id/confirm then no headers
  const routeCheck = 
    location.pathname.match(/^\/listbookings\/[^/]+(\/confirm)?$/);
    
  return (
    <div className="bg-[#F5F5F5] w-full min-h-screen">
      {!routeCheck && (
        <div className="w-full bg-[#2C3E50]">
          <div className="w-full">
            <Navbar />
          </div>
        </div>
      )}
      <main className="w-full bg-[#F5F5F5]">
        <Outlet />
      </main>
    </div>
  );
};

export default HomeLayout;
