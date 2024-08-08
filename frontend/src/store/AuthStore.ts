import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "axios";
const apiUrl = import.meta.env.VITE_BASE_URL;
interface AuthState {
  status: string;
  userDetails: any[];
  tempDetails: any[];
  loading: boolean;
  currentUser: any | null;
  currentRole: string | null;
  error: string | null;
  response: string | null;
  darkMode: boolean;
  accessToken: string;
  refreshToken: string;
  subjectDetails: any;
  sclassStudents: any[];
  authRequest: () => void;
  authSuccess: (user: any) => void;
  authFailed: (error: string) => void;
  authError: (error: string) => void;
  authLogout: () => void;
  doneSuccess: (data: any[]) => void;
  getDeleteSuccess: () => void;
  getRequest: () => void;
  getFailed: (error: string) => void;
  getError: (error: string) => void;
  toggleDarkMode: () => void;
  login: (fields: any, role: string) => Promise<void>;
  register: (fields: any, role: string) => Promise<void>;
  logout: () => void;
  getUserDetails: (id: string, address: string) => Promise<void>;
  updateUser: (fields: any, id: string, address: string) => Promise<void>;
  addStuff: (fields: any, address: string) => Promise<void>;
  getAllTeachers: (id: string) => Promise<void>;
  getTeacherDetails: (id: string) => Promise<void>;
  updateTeachSubject: (
    teacherId: string,
    teachSubject: string
  ) => Promise<void>;
  getAllStudents: (id: string) => Promise<void>;
  updateStudentFields: (
    id: string,
    fields: any,
    address: string
  ) => Promise<void>;
  removeStuff: (id: string, address: string) => Promise<void>;
  getAllSclasses: (id: string, address: string) => Promise<void>;
  getClassStudents: (id: string) => Promise<void>;
  getClassDetails: (id: string, address: string) => Promise<void>;
  getSubjectList: (id: string, address: string) => Promise<void>;
  getTeacherFreeClassSubjects: (id: string) => Promise<void>;
  getSubjectDetails: (id: string) => Promise<void>;
  resetAuthStatus: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      status: "idle",
      userDetails: [],
      tempDetails: [],
      loading: false,
      currentUser: JSON.parse(localStorage.getItem("user") || "null"),
      currentRole:
        (JSON.parse(localStorage.getItem("user") || "{}") || {}).role || null,
      error: null,
      response: null,
      darkMode: true,
      accessToken: "",
      refreshToken: "",
      subjectDetails: null,
      sclassStudents: [],
      authRequest: () => set({ status: "loading" }),
      authSuccess: (user) => {
        // const { accessToken, refreshToken, role } = admin;
        set({
          status: "success",
          currentUser: user,
          currentRole: user.user.role || [], //
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        });
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("accessToken", user.accessToken);
        localStorage.setItem("refreshToken", user.refreshToken);
        console.log("Access Token:", user.accessToken);
        console.log("Refresh Token:", user.refreshToken);
      },
      authFailed: (error) => set({ status: "failed", response: error }),
      authError: (error) => set({ status: "error", error }),
      authLogout: () => {
        localStorage.removeItem("user");
        set({
          currentUser: null,
          status: "idle",
          error: null,
          currentRole: null,
          accessToken: "",
          refreshToken: "",
        });
      },
      doneSuccess: (data) => set({ userDetails: data, loading: false }),
      getDeleteSuccess: () => set({ loading: false }),
      getRequest: () => set({ loading: true }),
      getFailed: (error) => set({ response: error, loading: false }),
      getError: (error) => set({ error, loading: false }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      login: async (fields, role) => {
        set({ status: "loading" });
        try {
          const result = await axios.post(`${apiUrl}/${role}/login`, fields, {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          });
          {
            console.log(result);
          }
          // if (result.data.role && result.data.role.length > 0) {
          //   set({
          //     accessToken: result.data.accessToken,
          //     refreshToken: result.data.refreshToken,
          //   });
          //   useAuthStore.getState().authSuccess(result.data);
          // } else {
          //   set({ status: "failed", response: result.data.message });
          // }
          if (result.data.accessToken && result.data.refreshToken) {
            useAuthStore.getState().authSuccess(result.data);
          } else {
            set({ status: "failed", response: result.data.message });
          }
        } catch (error: any) {
          set({ status: "error", error: error.message || "Unknown error" });
        }
      },
      register: async (fields, role) => {
        set({ status: "loading" });
        try {
          const result = await axios.post(
            `${apiUrl}/${role}/register`,
            fields,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          if (result.data.schoolName) {
            set({
              accessToken: result.data.accessToken,
              refreshToken: result.data.refreshToken,
            });
            useAuthStore.getState().authSuccess(result.data);
          } else if (result.data.school) {
            set({ tempDetails: result.data });
          } else {
            set({ status: "failed", response: result.data.message });
          }
        } catch (error: any) {
          set({ status: "error", error: error.message || "Unknown error" });
        }
      },
      logout: () => {
        set({
          status: "idle",
          currentUser: null,
          currentRole: null,
          accessToken: "",
          refreshToken: "",
        });
        localStorage.removeItem("user");
      },
      getUserDetails: async (id, address) => {
        set({ loading: true });
        try {
          const result = await axios.get(`${apiUrl}/${address}/${id}`);
          if (result.data) {
            set({ userDetails: result.data, loading: false });
          }
        } catch (error: any) {
          set({ error: error.message || "Unknown error", loading: false });
        }
      },
      updateUser: async (fields, id, address) => {
        set({ loading: true });
        try {
          const result = await axios.put(`${apiUrl}/${address}/${id}`, fields, {
            headers: { "Content-Type": "application/json" },
          });
          if (result.data.schoolName) {
            set({
              accessToken: result.data.access_token,
              refreshToken: result.data.refresh_token,
            });
            useAuthStore.getState().authSuccess(result.data);
          } else {
            set({ userDetails: result.data, loading: false });
          }
        } catch (error: any) {
          set({ error: error.message || "Unknown error", loading: false });
        }
      },
      addStuff: async (fields, address) => {
        set({ status: "loading" });
        try {
          const result = await axios.post(
            `${apiUrl}/${address}Create`,
            fields,
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          if (result.data.message) {
            set({ status: "failed", response: result.data.message });
          } else {
            set({ tempDetails: result.data });
          }
        } catch (error: any) {
          set({ status: "error", error: error.message || "Unknown error" });
        }
      },
      getAllTeachers: async (id) => {
        set({ loading: true });
        try {
          const result = await axios.get(
            `${apiUrl}/teacher/get-all-teachers/${id}`
          );
          if (result.data.message) {
            set({ response: result.data.message, loading: false });
          } else {
            set({ userDetails: result.data, loading: false });
          }
        } catch (error: any) {
          set({ error: error.message || "Unknown error", loading: false });
        }
      },
      getTeacherDetails: async (id) => {
        set({ loading: true });
        try {
          const result = await axios.get(`${apiUrl}/teacher/get-details/${id}`);
          if (result.data) {
            set({ tempDetails: result.data, loading: false });
          }
        } catch (error: any) {
          set({ error: error.message || "Unknown error", loading: false });
        }
      },

      updateTeachSubject: async (teacherId, teachSubject) => {
        set({ loading: true });
        try {
          await axios.put(
            `${apiUrl}/teacher/update-teacher-subject`,
            { teacherId, teachSubject },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
          set({ response: "Update successful", loading: false });
        } catch (error: any) {
          set({ error: error.message || "Unknown error", loading: false });
        }
      },

      getAllStudents: async (id) => {
        set({ loading: true });
        try {
          const result = await axios.get(
            `${apiUrl}/student/get-all-students/${id}`
          );
          if (result.data.message) {
            set({ response: result.data.message, loading: false });
          } else {
            set({ userDetails: result.data, loading: false });
          }
        } catch (error: any) {
          set({ error: error.message || "Unknown error", loading: false });
        }
      },

      updateStudentFields: async (id, fields, address) => {
        set({ loading: true });
        try {
          const result = await axios.put(`${apiUrl}/${address}/${id}`, fields, {
            headers: { "Content-Type": "application/json" },
          });
          if (result.data.message) {
            set({ response: result.data.message, loading: false });
          } else {
            set({ response: "Update successful", loading: false });
          }
        } catch (error: any) {
          set({ error: error.message || "Unknown error", loading: false });
        }
      },

      removeStuff: async (id, address) => {
        set({ loading: true });
        try {
          const result = await axios.put(`${apiUrl}/${address}/${id}`);
          if (result.data.message) {
            set({ response: result.data.message, loading: false });
          } else {
            set({ response: "Remove successful", loading: false });
          }
        } catch (error: any) {
          set({ error: error.message || "Unknown error", loading: false });
        }
      },

      getAllSclasses: async (id, address) => {
        set({ loading: true });
        try {
          const result = await axios.get(
            `${apiUrl}/${address}/class-list/${id}`
          );
          if (result.data.message) {
            set({ response: result.data.message, loading: false });
          } else {
            set({ tempDetails: result.data, loading: false });
          }
        } catch (error: any) {
          set({ error: error.message || "Unknown error", loading: false });
        }
      },

      getClassStudents: async (id) => {
        set({ loading: true });
        try {
          const result = await axios.get(`${apiUrl}/class/students/${id}`);
          if (result.data.message) {
            set({ response: result.data.message, loading: false });
          } else {
            set({ sclassStudents: result.data, loading: false });
          }
        } catch (error: any) {
          set({ error: error.message || "Unknown error", loading: false });
        }
      },

      getClassDetails: async (id, address) => {
        set({ loading: true });
        try {
          const result = await axios.get(`${apiUrl}/class/${id}`);
          if (result.data) {
            set({ tempDetails: result.data, loading: false });
          }
        } catch (error: any) {
          set({ error: error.message || "Unknown error", loading: false });
        }
      },

      getSubjectList: async (id, address) => {
        set({ loading: true });
        try {
          const result = await axios.get(
            `${apiUrl}/${address}/free-subject-list/${id}`
          );
          if (result.data.message) {
            set({ response: result.data.message, loading: false });
          } else {
            set({ tempDetails: result.data, loading: false });
          }
        } catch (error: any) {
          set({ error: error.message || "Unknown error", loading: false });
        }
      },

      getTeacherFreeClassSubjects: async (id) => {
        set({ loading: true });
        try {
          const result = await axios.get(
            `${apiUrl}/teacher/free-subject-list/${id}`
          );
          if (result.data.message) {
            set({ response: result.data.message, loading: false });
          } else {
            set({ userDetails: result.data, loading: false });
          }
        } catch (error: any) {
          set({ error: error.message || "Unknown error", loading: false });
        }
      },

      getSubjectDetails: async (id) => {
        set({ loading: true });
        try {
          const result = await axios.get(`${apiUrl}/subject/${id}`);
          if (result.data) {
            set({ subjectDetails: result.data, loading: false });
          }
        } catch (error: any) {
          set({ error: error.message || "Unknown error", loading: false });
        }
      },

      resetAuthStatus: () => {
        set({ status: "idle", response: null, error: null });
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = useAuthStore.getState().refreshToken;
      try {
        const response = await axios.post(`${apiUrl}/auth/refresh-token`, {
          token: refreshToken,
        });
        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;
        useAuthStore.setState({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });
        console.log("Refreshing Token...");
        console.log("New Access Token:", newAccessToken);
        console.log("New Refresh Token:", newRefreshToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().authLogout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
