import { baseApi } from "../services/baseApi";
import { setCredentials } from "./authSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // 🔹 LOGIN
    login: builder.mutation({
      query: (payload) => ({
        url: "admin/login",
        method: "POST",
        data: payload,
      }),

      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // Dispatch setCredentials to update auth state in Redux and localStorage
          dispatch(setCredentials({ token: data.token, user: data.user }));
        } catch (err) { }

      },
    }),
  }),
});

export const {
  useLoginMutation,
} = authApi;
