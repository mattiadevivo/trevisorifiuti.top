import { Client } from ".";

export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

export const authService = {
  // Sign up with email and password
  async signUp(supabase: Client, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign in with email and password
  async signIn(supabase: Client, email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  // Sign out
  async signOut(supabase: Client) {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // Get current session
  async getSession(supabase: Client) {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  },

  // Get current user
  async getUser(supabase: Client) {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return data.user;
  },

  // Reset password
  async resetPassword(supabase: Client, email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  },

  // Update password
  async updatePassword(supabase: Client, password: string) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  },
};
