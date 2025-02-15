import { supabase } from '../lib/supabase'

export const signUp = async ({ email, password, name, vehicleNumber }) => {
  try {
    // First check if profile already exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingProfile) {
      throw new Error('User with this email already exists');
    }

    // Sign up the user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (authError) throw authError;

    // Create profile entry
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert([  // Using upsert instead of insert
        {
          id: authData.user.id,
          email,
          full_name: name,
          vehicle_number: vehicleNumber,
        }
      ], 
      { onConflict: 'id' });  // Handle conflicts on id column

    if (profileError) throw profileError;

    return { user: authData.user };
  } catch (error) {
    throw error;
  }
}

export const signIn = async ({ email, password }) => {
  const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return { user, session, profile }
}

export const guestSignIn = async () => {
  const email = 'guest@example.com'
  const password = 'guest123' // You should use a more secure password in production

  return signIn({ email, password })
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const saveBooking = async (bookingData) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving booking:', error);
    throw error;
  }
};

export const fetchCities = async () => {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
};

export const createParking = async (parkingData) => {
  // Add the default image URL to the parking data
  const parkingWithImage = {
    ...parkingData,
    image_url: "https://ipmshfkymnflueddojcw.supabase.co/storage/v1/object/public/parking-images/premium_photo-1661902046698-40bba703f396.jpg"
  };

  // Create the IT park entry with the default image
  const { data: parkData, error: parkError } = await supabase
    .from('it_parks')
    .insert([parkingWithImage])
    .select()
    .single();

  if (parkError) throw parkError;
  return parkData;
};

export const createParkingSlots = async (slotsData) => {
  const { data, error } = await supabase
    .from('parking_slots')
    .insert(slotsData);

  if (error) throw error;
  return data;
};

export const fetchBookingStatistics = async (timeFrame) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User must be logged in to view statistics');

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      created_at,
      slot_id,
      parking_slots (
        park_id,
        it_parks (
          id,
          name,
          price_per_hour,
          profile_id
        )
      )
    `)
    .eq('parking_slots.it_parks.profile_id', user.id)
    .gte('created_at', getDateRange(timeFrame))
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }

  console.log('Fetched bookings:', data);
  return data;
};

export const fetchCongestionData = async () => {
  const { data, error } = await supabase.rpc('get_congestion_data');
  
  if (error) {
    console.error('Error fetching congestion data:', error);
    throw error;
  }
  
  return data;
};

export const fetchBookingsByCity = async (city) => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('city', city); // Adjust the query according to your database schema

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
  return data;
};

// Helper function to get date range based on timeframe
const getDateRange = (timeFrame) => {
  // Use UTC to avoid timezone issues
  const now = new Date();
  
  switch (timeFrame) {
    case 'day':
      return new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString(); // Last 7 days
    case 'week':
      return new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString(); // Last 30 days
    case 'month':
      return new Date(now.getTime() - (365 * 24 * 60 * 60 * 1000)).toISOString(); // Last 365 days
    default:
      return new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000)).toISOString();
  }
}; 