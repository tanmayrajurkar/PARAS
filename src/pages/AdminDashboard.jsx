import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Navbar } from "../components";
import { RiDashboardLine, RiMoneyDollarCircleLine, RiParkingBoxLine, RiSettings4Line, RiMenuLine } from 'react-icons/ri';
import UploadParking from "./UploadParking";
import CommercialParkingForm from "./CommercialParkingForm";
import IndividualParkingForm from "./IndividualParkingForm";
import ParkingStatistics from '../components/ParkingStatistics';
import SlotManagement from '../components/SlotManagement';
import BookingHistory from '../components/BookingHistory';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeDashboardTab, setActiveDashboardTab] = useState('parking-statistics');
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const handleSidebarClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  const sidebarLinks = [
    {
      title: "Dashboard",
      icon: <RiDashboardLine size={20} />,
      id: "dashboard"
    },
    {
      title: "Upload Parking",
      icon: <RiParkingBoxLine size={20} />,
      id: "upload",
      subLinks: [
        {
          title: "Commercial Parking",
          path: "commercial"
        },
        {
          title: "Individual Parking",
          path: "individual"
        }
      ]
    }
  ];

  const renderDashboardContent = () => {
    switch (activeDashboardTab) {
      case 'parking-statistics':
        return <ParkingStatistics />;
      case 'slot-management':
        return <SlotManagement />;
      case 'booking-history':
        return <BookingHistory />;
      default:
        return <ParkingStatistics />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="flex h-screen relative">
        {/* Sidebar */}
        <div 
          className={`
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            fixed lg:static
            w-64 bg-[#2C3E50] text-white p-4 flex-shrink-0
            transition-transform duration-300 ease-in-out
            h-full z-20
          `}
          onClick={handleSidebarClick}
        >
          <div className="space-y-2">
            {sidebarLinks.map((link) => (
              <div key={link.id}>
                {link.id === "settings" ? (
                  // Settings with logout button
                  <button
                    onClick={() => setActiveTab(link.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                      ${activeTab === link.id ? 'bg-[#34495E]' : 'hover:bg-[#34495E]'}`}
                  >
                    {link.icon}
                    <span>{link.title}</span>
                  </button>
                ) : link.path ? (
                  // External links (like Upload Parking)
                  <Link
                    to={link.path}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                      ${activeTab === link.id ? 'bg-[#34495E]' : 'hover:bg-[#34495E]'}`}
                  >
                    {link.icon}
                    <span>{link.title}</span>
                  </Link>
                ) : (
                  // Regular sidebar tabs
                  <button
                    onClick={() => setActiveTab(link.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                      ${activeTab === link.id ? 'bg-[#34495E]' : 'hover:bg-[#34495E]'}`}
                  >
                    {link.icon}
                    <span>{link.title}</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto w-full">
          {/* Toggle Button */}
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="lg:hidden fixed top-4 left-4 z-30 bg-[#2C3E50] p-2 rounded-md text-white hover:bg-[#34495E]"
          >
            <RiMenuLine size={24} />
          </button>

          {/* Overlay for mobile */}
          {isSidebarOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-10"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          <div className="bg-[#2C3E50] p-6 rounded-lg w-full shadow-lg">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Dashboard</h2>
                
                {/* Dashboard Tabs - Always visible */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <button 
                    onClick={() => setActiveDashboardTab('parking-statistics')} 
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeDashboardTab === 'parking-statistics' 
                        ? 'bg-[#34495E] text-white' 
                        : 'text-gray-300 hover:bg-[#34495E] hover:text-white'
                    }`}
                  >
                    Parking Statistics
                  </button>
                  <button 
                    onClick={() => setActiveDashboardTab('slot-management')} 
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeDashboardTab === 'slot-management' 
                        ? 'bg-[#34495E] text-white' 
                        : 'text-gray-300 hover:bg-[#34495E] hover:text-white'
                    }`}
                  >
                    Slot Management
                  </button>
                  <button 
                    onClick={() => setActiveDashboardTab('booking-history')} 
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      activeDashboardTab === 'booking-history' 
                        ? 'bg-[#34495E] text-white' 
                        : 'text-gray-300 hover:bg-[#34495E] hover:text-white'
                    }`}
                  >
                    Booking History
                  </button>
                </div>

                {/* Dashboard Content */}
                <div className="bg-[#34495E] p-6 rounded-lg">
                  {renderDashboardContent()}
                </div>
              </div>
            )}

             

            {activeTab === 'upload' && (
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-6">Upload Parking</h2>
                <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                  {/* Commercial Parking Card */}
                  <div 
                    onClick={() => setActiveTab('upload-commercial')}
                    className="bg-[#34495E] p-6 rounded-lg shadow-lg hover:transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-600 hover:border-blue-500"
                  >
                    <h2 className="text-2xl text-white font-bold mb-4">
                      List Commercial Parking
                    </h2>
                    <p className="text-gray-300 mb-4">
                      List your commercial parking space, IT park parking, or mall parking facilities.
                    </p>
                    <ul className="text-gray-300 list-disc list-inside mb-4">
                      <li>Multiple parking slots</li>
                      <li>Commercial rates</li>
                      <li>Business verification</li>
                      <li>Automated management</li>
                    </ul>
                    <div className="bg-[#28A745] text-white py-2 px-4 rounded text-center mt-4 hover:bg-[#218838] transition-colors">
                      List Commercial Space
                    </div>
                  </div>

                  {/* Individual Parking Card */}
                  <div 
                    onClick={() => setActiveTab('upload-individual')}
                    className="bg-[#34495E] p-6 rounded-lg shadow-lg hover:transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-600 hover:border-blue-500"
                  >
                    <h2 className="text-2xl text-white font-bold mb-4">
                      List Individual Parking
                    </h2>
                    <p className="text-gray-300 mb-4">
                      List your personal parking space, home parking, or single slot parking.
                    </p>
                    <ul className="text-gray-300 list-disc list-inside mb-4">
                      <li>Single parking slot</li>
                      <li>Flexible availability</li>
                      <li>Personal verification</li>
                      <li>Simple management</li>
                    </ul>
                    <div className="bg-[#007BFF] text-white py-2 px-4 rounded text-center mt-4 hover:bg-[#0056b3] transition-colors">
                      List Individual Space
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'upload-commercial' && (
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-6">Commercial Parking Form</h2>
                <CommercialParkingForm isEmbedded={true} />
              </div>
            )}

            {activeTab === 'upload-individual' && (
              <div className="text-white">
                <h2 className="text-2xl font-bold mb-6">Individual Parking Form</h2>
                <IndividualParkingForm isEmbedded={true} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 