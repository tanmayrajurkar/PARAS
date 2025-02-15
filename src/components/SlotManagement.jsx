import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const SlotManagement = () => {
  const [parkingData, setParkingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParkingSlots = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        // Fetch parking slots for the user's IT parks
        const { data: slots, error } = await supabase
          .from('parking_slots')
          .select(`
            id,
            basement_number,
            slot_number,
            status,
            park_id,
            it_parks!inner (
              id,
              name,
              profile_id
            )
          `)
          .eq('it_parks.profile_id', user.id)
          .order('basement_number', { ascending: true })
          .order('slot_number', { ascending: true });

        if (error) throw error;

        // Sort the data after fetching
        const sortedSlots = slots.sort((a, b) => 
          a.it_parks.name.localeCompare(b.it_parks.name)
        );

        // Organize slots by parking lot, then by basement
        const organizedData = sortedSlots.reduce((acc, slot) => {
          const parkId = slot.it_parks.id;
          const parkName = slot.it_parks.name;
          const basement = slot.basement_number || '1';

          if (!acc[parkId]) {
            acc[parkId] = {
              name: parkName,
              basements: {}
            };
          }
          
          if (!acc[parkId].basements[basement]) {
            acc[parkId].basements[basement] = [];
          }
          
          acc[parkId].basements[basement].push(slot);
          return acc;
        }, {});

        setParkingData(organizedData);
      } catch (error) {
        console.error('Error fetching parking slots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchParkingSlots();
  }, []);

  if (loading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  if (!parkingData || Object.keys(parkingData).length === 0) {
    return <div className="text-white text-center">No parking slots found</div>;
  }

  return (
    <div className="space-y-8">
      {Object.entries(parkingData).map(([parkId, parkInfo]) => (
        <div key={parkId} className="bg-[#2C3E50] rounded-lg p-6">
          <h2 className="text-white text-2xl font-bold mb-6 border-b border-gray-700 pb-3">
            {parkInfo.name}
          </h2>
          
          <div className="space-y-6">
            {Object.entries(parkInfo.basements).map(([basement, slots]) => (
              <div key={`${parkId}-${basement}`} className="bg-[#34495E] rounded-lg p-4">
                <h3 className="text-white text-lg font-semibold mb-4">
                  Basement {basement}
                </h3>
                
                <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                  {slots.map((slot) => (
                    <div
                      key={slot.id}
                      className={`
                        aspect-square rounded-lg p-2
                        flex items-center justify-center
                        text-white font-medium
                        transition-colors duration-200
                        ${slot.status === 'Occupied'
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-green-500 hover:bg-green-600'
                        }
                      `}
                    >
                      {slot.slot_number}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <span>Total Slots: {
                Object.values(parkInfo.basements).flat().length
              }</span>
              <span>|</span>
              <span>Available: {
                Object.values(parkInfo.basements)
                  .flat()
                  .filter(slot => slot.status !== 'Occupied').length
              }</span>
              <span>|</span>
              <span>Occupied: {
                Object.values(parkInfo.basements)
                  .flat()
                  .filter(slot => slot.status === 'Occupied').length
              }</span>
            </div>
          </div>
        </div>
      ))}

      <div className="flex gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-white text-sm">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-white text-sm">Occupied</span>
        </div>
      </div>
    </div>
  );
};

export default SlotManagement; 