import { supabase } from '$lib/supabaseClient';

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    console.error('Најава неуспешна:', error.message);
    return { error };
  }

  const user = data.user;
  if (!user) {
    return { error: new Error("Најавата успеа, но нема user објект.") };
  }

  // Земи го профилот од базата
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (profileError) {
    console.error('Не можам да го најдам профилот:', profileError.message);
    return { error: profileError };
  }

  return { user, profile };
};
