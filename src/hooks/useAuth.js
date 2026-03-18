import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabaseClient";
import { useEffect } from "react";

// Query Key for user
const USER_KEY = ["user"];

// Hook to get the current authenticated user
export const useUser = () => {
  const queryClient = useQueryClient();

  // Set up auth state listener
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // Invalidate user query on auth state change
      queryClient.invalidateQueries({ queryKey: USER_KEY });
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  return useQuery({
    queryKey: USER_KEY,
    queryFn: async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) throw new Error(error.message);
      return session?.user || null;
    },
    staleTime: Infinity, // User data doesn't change often, managed by listener
  });
};

// Hook for authentication (login)
export const useAuth = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      // Invalidate user query to update the UI
      queryClient.invalidateQueries({ queryKey: USER_KEY });
      // Note: Redirection should be handled in the component
    },
    onError: (error) => {
      console.error("Login error:", error.message);
      // Error will be available in the mutation for UI display
    },
  });
};
