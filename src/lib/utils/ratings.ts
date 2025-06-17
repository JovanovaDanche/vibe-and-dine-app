import { supabase } from '$lib/supabaseClient';

export const submitRating = async (
  user_id: string,
  location: {
    id: string;
    lat: number;
    lon: number;
    tags: {
      name: string;
      amenity: string;
    };
  },
  rating: number
) => {

  const { data: existing } = await supabase
    .from('ratings')
    .select('*')
    .eq('user_id', user_id)
    .eq('place_id', location.id)
    .maybeSingle();

  if (existing) {
    return await supabase
      .from('ratings')
      .update({ rating })
      .eq('id', existing.id);
  } else {
    return await supabase
      .from('ratings')
      .insert({
        user_id,
        place_id: location.id,
        name: location.tags.name,
        lat: location.lat,
        lon: location.lon,
        category: location.tags.amenity,
        rating
      });
  }
};
export const getAverageRating = async (place_id: string) => {
  const { data, error } = await supabase
    .from('ratings')
    .select('rating')
    .eq('place_id', place_id);

  if (error) {
    console.error('Error fetching ratings:', error.message);
    return null;
  }

  if (!data || data.length === 0) return 0;

  const total = data.reduce((sum, r) => sum + r.rating, 0);
  return (total / data.length).toFixed(1); 
};