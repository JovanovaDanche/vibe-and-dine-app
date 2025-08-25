import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const actions: Actions = {
  default: async () => {
    await supabase.auth.signOut();
    throw redirect(303, '/');
  }
};
