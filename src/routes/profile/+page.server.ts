import { redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const load = async ({ locals }) => {
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession();

  if (!session) {
    throw redirect(303, '/login');
  }

  const user = session.user;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle(); 

  if (profileError) {
    console.error('Error fetching profile:', profileError.message);
  }

  return {
    profile
  };
};
