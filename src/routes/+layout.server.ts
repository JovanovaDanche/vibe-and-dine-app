import { supabase } from '$lib/supabaseClient';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    return { profile: null };
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .maybeSingle();

  if (error) {
    console.error('Profile error:', error.message);
  }

  const { data: favorites } = await supabase
  .from('favorites')
  .select('place_id, name')
  .eq('user_id', session.user.id);

  const { data: ratings } = await supabase
    .from('ratings')
    .select('place_id, name, rating')
    .eq('user_id', session.user.id);

  return {
    profile,
    favorites: favorites ?? [],
    ratings: ratings ?? []
  };
};
