import { supabase } from '$lib/supabaseClient';

export type PlaceLocation = {
  id: string;
  lat: number;
  lon: number;
  tags: {
    name: string;
    amenity: string;
  };
};

export const toggleFavorite = async (user_id: string, location: PlaceLocation) => {
  const { data } = await supabase
    .from('favorites')
    .select('*')
    .eq('user_id', user_id)
    .eq('place_id', location.id)
    .maybeSingle();

  if (data) {
    return await supabase
      .from('favorites')
      .delete()
      .eq('id', data.id);
  } else {
    return await supabase
      .from('favorites')
      .insert({
        user_id,
        place_id: location.id,
        name: location.tags.name,
        lat: location.lat,
        lon: location.lon,
        category: location.tags.amenity
      });
  }
};