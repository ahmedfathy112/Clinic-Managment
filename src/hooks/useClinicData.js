import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "../lib/supabaseClient";

// Query Keys
const PATIENTS_KEY = ["patients"];
const PATIENT_KEY = (id) => ["patient", id];
const ACTIVE_SESSIONS_KEY = ["active-sessions"];
const COMPLETED_SESSIONS_KEY = ["completed-sessions"];
const PATIENT_SESSIONS_KEY = (patientId) => ["patient-sessions", patientId];
// Hook to fetch all patients
export const usePatients = () => {
  return useQuery({
    queryKey: PATIENTS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select(
          `
          *,
          medical_histories (*)
        `,
        )
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
  });
};

// Hook to add a new patient
export const useAddPatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ patientData, medicalHistoryData }) => {
      // First, insert the patient
      const { data: patient, error: patientError } = await supabase
        .from("patients")
        .insert([patientData])
        .select()
        .single();

      if (patientError) throw new Error(patientError.message);

      // Then, insert medical history if provided
      if (
        medicalHistoryData &&
        (medicalHistoryData.chronic_diseases ||
          medicalHistoryData.previous_surgeries)
      ) {
        const { error: historyError } = await supabase
          .from("medical_histories")
          .insert([
            {
              patient_id: patient.id,
              chronic_diseases: medicalHistoryData.chronic_diseases || null,
              previous_surgeries: medicalHistoryData.previous_surgeries || null,
            },
          ]);

        if (historyError) throw new Error(historyError.message);
      }

      return patient;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_KEY });
    },
    onError: (error) => {
      console.error("Error adding patient:", error.message);
    },
  });
};

// Hook to delete a patient
export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patientId) => {
      const { error } = await supabase
        .from("patients")
        .delete()
        .eq("id", patientId);

      if (error) throw new Error(error.message);
      return patientId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_KEY });
    },
    onError: (error) => {
      console.error("Error deleting patient:", error.message);
    },
  });
};

// Hook to update a patient
export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ patientId, updatedData }) => {
      const { data, error } = await supabase
        .from("patients")
        .update(updatedData)
        .eq("id", patientId)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: PATIENTS_KEY });
      queryClient.invalidateQueries({ queryKey: PATIENT_KEY(data.id) });
    },
    onError: (error) => {
      console.error("Error updating patient:", error.message);
    },
  });
};

// Hook to fetch a single patient with medical_history
export const usePatient = (id) => {
  return useQuery({
    queryKey: PATIENT_KEY(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("patients")
        .select(
          `
          *,
          medical_histories (*),
          treatment_plans (
            *,
            sessions (*)
          )
        `,
        )
        .eq("id", id)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!id,
  });
};

// Hook to create a treatment plan and automatically insert sessions
export const useCreatePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planData) => {
      // First, insert the treatment plan
      const { data: plan, error: planError } = await supabase
        .from("treatment_plans")
        .insert([planData])
        .select()
        .single();

      if (planError) throw new Error(planError.message);

      // Then, insert sessions with retry logic
      const sessions = [];
      for (let i = 1; i <= plan.total_sessions; i++) {
        sessions.push({
          plan_id: plan.id,
          session_number: i,
          is_completed: false,
        });
      }

      const { error: sessionsError } = await supabase
        .from("sessions")
        .insert(sessions);

      if (sessionsError) throw new Error(sessionsError.message);

      return {
        plan,
        sessions,
        patientId: plan.patient_id,
        error: planError,
      };
    },
    onSuccess: (data) => {
      // Invalidate all patient-related queries
      queryClient.invalidateQueries({ queryKey: PATIENTS_KEY });
      queryClient.invalidateQueries({ queryKey: PATIENT_KEY(data.patientId) });
      queryClient.invalidateQueries({ queryKey: ACTIVE_SESSIONS_KEY });
      queryClient.invalidateQueries({ queryKey: COMPLETED_SESSIONS_KEY });
      queryClient.invalidateQueries({
        queryKey: PATIENT_SESSIONS_KEY(data.patientId),
      });
    },
    onError: (error) => {
      console.error("Error creating plan:", error.message);
    },
  });
};

// Hook to create sessions for a specific treatment plan
export const useCreateSessions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ planId, totalSessions }) => {
      const sessions = [];
      for (let i = 1; i <= totalSessions; i++) {
        sessions.push({
          plan_id: planId,
          session_number: i,
          is_completed: false,
        });
      }

      const { error } = await supabase.from("sessions").insert(sessions);

      if (error) throw new Error(error.message);
      return sessions;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ACTIVE_SESSIONS_KEY });
      queryClient.invalidateQueries({ queryKey: COMPLETED_SESSIONS_KEY });
      queryClient.invalidateQueries({
        queryKey: PATIENT_SESSIONS_KEY(variables.patientId),
      });
    },
    onError: (error) => {
      console.error("Error creating sessions:", error.message);
    },
  });
};

// Hook to update a session
export const useUpdateSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }) => {
      const { data, error } = await supabase
        .from("sessions")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      console.log("Session updated successfully, invalidating queries...");
      queryClient.invalidateQueries({ queryKey: ACTIVE_SESSIONS_KEY });
      queryClient.invalidateQueries({ queryKey: COMPLETED_SESSIONS_KEY });
      queryClient.invalidateQueries({ queryKey: PATIENTS_KEY });
      queryClient.invalidateQueries({ queryKey: ["patient-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["patient-plan-sessions"] });
      // Force refetch to ensure immediate UI update
      queryClient.refetchQueries({ queryKey: ACTIVE_SESSIONS_KEY });
      queryClient.refetchQueries({ queryKey: COMPLETED_SESSIONS_KEY });
    },
    onError: (error) => {
      console.error("Error updating session:", error.message);
    },
  });
};

// Hook to fetch active sessions
export const useActiveSessions = () => {
  return useQuery({
    queryKey: ACTIVE_SESSIONS_KEY,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select(
          `
          *,
          treatment_plans!inner (
            *,
            patients (
              id,
              full_name,
              phone,
              gender,
              age
            )
          )
        `,
        )
        .eq("treatment_plans.status", "active")
        .eq("is_completed", false)
        .order("session_date", { ascending: true });

      if (error) throw new Error(error.message);
      return data;
    },
  });
};

// Hook to fetch completed sessions
export const useCompletedSessions = () => {
  return useQuery({
    queryKey: ["completed-sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sessions")
        .select(
          `
          *,
          treatment_plans!inner (
            *,
            patients (
              id,
              full_name,
              phone,
              gender,
              age
            )
          )
        `,
        )
        .eq("treatment_plans.status", "completed")
        .order("session_date", { ascending: true });

      if (error) throw new Error(error.message);
      return data;
    },
  });
};

// Hook to fetch sessions for a specific patient
export const usePatientSessions = (patientId) => {
  return useQuery({
    queryKey: PATIENT_SESSIONS_KEY(patientId),
    queryFn: async () => {
      const { data: plans, error: plansError } = await supabase
        .from("treatment_plans")
        .select("id")
        .eq("patient_id", patientId)
        .eq("status", "active");

      if (plansError) throw new Error(plansError.message);
      if (!plans || plans.length === 0) return [];

      const planIds = plans.map((plan) => plan.id);

      // جلب جميع الجلسات لهذه الخطط النشطة فقط
      const { data, error } = await supabase
        .from("sessions")
        .select(
          `
          *,
          treatment_plans (
            id,
            diagnosis,
            total_sessions,
            status,
            start_date
          )
        `,
        )
        .in("plan_id", planIds)
        .order("treatment_plans(start_date)", { ascending: false })
        .order("session_number", { ascending: true });

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!patientId,
  });
};

// Hook to fetch sessions for a specific treatment plan
export const usePatientPlanSessions = (patientId, planId) => {
  return useQuery({
    queryKey: ["patient-plan-sessions", patientId, planId],
    queryFn: async () => {
      const { data: plan, error: planError } = await supabase
        .from("treatment_plans")
        .select("id, patient_id, diagnosis, total_sessions, status, start_date")
        .eq("id", planId)
        .eq("patient_id", patientId)
        .single();

      if (planError || !plan) {
        throw new Error("الخطة العلاجية غير موجودة أو لا تخص هذا المريض");
      }

      // جلب جلسات الخطة المحددة
      const { data: sessions, error: sessionsError } = await supabase
        .from("sessions")
        .select("*")
        .eq("plan_id", planId)
        .order("session_number", { ascending: true });

      if (sessionsError) throw new Error(sessionsError.message);

      // إرجاع البيانات مع معلومات الخطة
      return {
        plan,
        sessions: sessions || [],
        totalSessions: plan.total_sessions,
        completedSessions: sessions?.filter((s) => s.is_completed).length || 0,
        remainingSessions: sessions?.filter((s) => !s.is_completed).length || 0,
      };
    },
    enabled: !!patientId && !!planId,
  });
};

// Hook to fetch active treatment plans
export const useActiveTreatmentPlans = () => {
  return useQuery({
    queryKey: ["active-treatment-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("treatment_plans")
        .select("*")
        .eq("status", "active");

      if (error) throw new Error(error.message);
      return data;
    },
  });
};
