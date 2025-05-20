import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { supabase } from '$lib/supabaseClient';

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const email = form.get('email') as string;
    const password = form.get('password') as string;
    const fullName = form.get('fullName') as string;
    const phone = form.get('phone') as string;

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      return fail(400, { error: error.message });
    }

    const userId = data.user?.id;

    if (!userId) {
      return fail(400, {
        error:
          'Registration successful, but email confirmation is required. Please check your inbox.'
      });
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      user_id: userId,
      full_name: fullName,
      phone: phone
    });

    if (profileError) {
      return fail(500, { error: profileError.message });
    }

    return redirect(303, '/login');
  }
};
