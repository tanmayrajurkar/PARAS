export const navLinks = [
  {
    id: "home",
    title: "Home",
    url: "/",
  },
  // {
  //   id: "about",
  //   title: "About",
  //   url: "/about",
  // },
  {
    id: "listbooking",
    title: "Listed Bookings",
    url: "/listbookings",
  },
  // {
  //   id: "mapbookings",
  //   title: "MapBookings",
  //   url: "/mapbookings",
  // },
  {
    id: "myBookings",
    title: "My Bookings",
    url: "/mybookings",
  },
  {
    id: "adminDashboard",
    title: "Admin Dashboard",
    url: "/admin",
  },

  {
    id: "govDashboard",
    title: "Gov Dashboard",
    url: "/gov",
  },


];

export const mapStyles = [
  {
    featureType: "all",
    elementType: "geometry",
    stylers: [
      {
        color: "#202c3e",
      },
    ],
  },
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [
      {
        gamma: 0.01,
      },
      {
        lightness: 20,
      },
      {
        weight: "1.39",
      },
      {
        color: "#ffffff",
      },
    ],
  },
  {
    featureType: "all",
    elementType: "labels.text.stroke",
    stylers: [
      {
        weight: "0.96",
      },
      {
        saturation: "9",
      },
      {
        visibility: "on",
      },
      {
        color: "#000000",
      },
    ],
  },
  {
    featureType: "all",
    elementType: "labels.icon",
    stylers: [
      {
        visibility: "off",
      },
    ],
  },
  {
    featureType: "landscape",
    elementType: "geometry",
    stylers: [
      {
        lightness: 30,
      },
      {
        saturation: "9",
      },
      {
        color: "#29446b",
      },
    ],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [
      {
        saturation: 20,
      },
    ],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [
      {
        lightness: 20,
      },
      {
        saturation: -20,
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [
      {
        lightness: 10,
      },
      {
        saturation: -30,
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#193a55",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [
      {
        saturation: 25,
      },
      {
        lightness: 25,
      },
      {
        weight: "0.01",
      },
    ],
  },
  {
    featureType: "water",
    elementType: "all",
    stylers: [
      {
        lightness: -20,
      },
    ],
  },
];

export const slides = [
  "https://i.ibb.co/yg8PBxR/pexels-matreding-28588397.jpg",
  "https://i.ibb.co/d7xs8FW/pexels-jimbear-2612855.jpg",
  "https://i.ibb.co/ZWNJJY1/pexels-carlnewton-2280148.jpg",
  "https://i.ibb.co/n3c0P5W/pexels-introspectivedsgn-4481037.jpg",
  "https://i.ibb.co/4YkdsL0/pexels-vlad-r-3753632-6099751.jpg",
  "https://i.ibb.co/DGYVN8c/pexels-brett-sayles-1756957-1.jpg",
  "https://i.ibb.co/ZWNJJY1/pexels-carlnewton-2280148.jpg",
];

export const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};

export const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};

export const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};

export const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};
