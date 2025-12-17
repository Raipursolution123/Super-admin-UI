import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/authServices';
import { STORAGE_KEYS } from '../../constants/appConstants';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.detail ||
        error.message ||
        'Login failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
    refreshToken: localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
    isAuthenticated: !!localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    },
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      state.accessToken = action.payload.access;
      state.refreshToken = action.payload.refresh;
      state.isAuthenticated = true;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, action.payload.access);
      if (action.payload.refresh) {
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, action.payload.refresh);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.isAuthenticated = true;
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, action.payload.access);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, action.payload.refresh);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
