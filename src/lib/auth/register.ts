import { supabase } from '$lib/supabaseClient';

export const register = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    console.error('Регистрација неуспешна:', error.message);
    return { error };
  }

  const user = data.user;
  if (!user) {
    return { error: new Error("Нема user објект во одговорот.") };
  }

  const { error: profileError } = await supabase
    .from('profiles')
    .insert([
      {
        user_id: user.id,
        name: '',
        surname: '',
        email: ''
      }
    ]);

  if (profileError) {
    console.error('Не можев да креирам профил:', profileError.message);
    return { error: profileError };
  }

  return { user };
};
