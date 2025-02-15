CREATE OR REPLACE FUNCTION get_congestion_data()
RETURNS TABLE (
  parking_lot TEXT,
  time_period TEXT,
  congestion_level INTEGER
) AS $$
WITH time_slots AS (
  SELECT 
    park_id,
    DATE_TRUNC('day', start_time) AS booking_date,
    CASE 
      WHEN EXTRACT(HOUR FROM start_time) BETWEEN 6 AND 11 THEN 'morning'
      WHEN EXTRACT(HOUR FROM start_time) BETWEEN 12 AND 17 THEN 'afternoon'
      WHEN EXTRACT(HOUR FROM start_time) BETWEEN 18 AND 22 THEN 'evening'
    END AS time_period,
    COUNT(*) as booking_count
  FROM bookings b
  JOIN parking_slots ps ON b.slot_id = ps.id
  WHERE 
    start_time >= NOW() - INTERVAL '7 days'
    AND booking_status != 'cancelled'
  GROUP BY park_id, DATE_TRUNC('day', start_time), 
    CASE 
      WHEN EXTRACT(HOUR FROM start_time) BETWEEN 6 AND 11 THEN 'morning'
      WHEN EXTRACT(HOUR FROM start_time) BETWEEN 12 AND 17 THEN 'afternoon'
      WHEN EXTRACT(HOUR FROM start_time) BETWEEN 18 AND 22 THEN 'evening'
    END
),

park_stats AS (
  SELECT 
    ip.id AS park_id,
    ip.available_spots,
    ip.latitude,
    ip.longitude
  FROM it_parks ip
  WHERE ip.status = true
),

nearby_parks AS (
  SELECT 
    p1.id AS reference_park_id,
    p2.id AS nearby_park_id
  FROM it_parks p1
  CROSS JOIN it_parks p2
  WHERE 
    p1.id != p2.id
    AND (
      6371 * acos(
        cos(radians(p1.latitude)) * 
        cos(radians(p2.latitude)) * 
        cos(radians(p2.longitude) - radians(p1.longitude)) + 
        sin(radians(p1.latitude)) * 
        sin(radians(p2.latitude))
      )
    ) <= 10 -- 10km radius
),

congestion_calc AS (
  SELECT 
    ts.park_id,
    ts.time_period,
    AVG(
      (ts.booking_count::float / NULLIF(ps.available_spots, 0)) * 100
    ) AS raw_congestion
  FROM time_slots ts
  JOIN park_stats ps ON ts.park_id = ps.park_id
  GROUP BY ts.park_id, ts.time_period
)

SELECT 
  ip.name AS parking_lot,
  cc.time_period,
  LEAST(100, GREATEST(0, 
    ROUND(
      AVG(cc.raw_congestion)
    )
  ))::integer AS congestion_level
FROM congestion_calc cc
JOIN it_parks ip ON cc.park_id = ip.id
GROUP BY ip.name, cc.time_period
ORDER BY ip.name, cc.time_period;
$$ LANGUAGE sql;