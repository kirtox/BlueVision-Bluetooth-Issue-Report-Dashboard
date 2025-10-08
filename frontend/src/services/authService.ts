// API 服務層
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

export interface RegisterRequest {
  username: string;
  password: string;
  role?: string;
}

export const authService = {
  // 登入
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('Attempting login to:', `${API_BASE_URL}/login`);
    console.log('Credentials:', { username: credentials.username, password: '***' });

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Response received:', response);
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Login error response:', errorText);

        try {
          const error = JSON.parse(errorText);
          throw new Error(error.detail || 'Login failed');
        } catch {
          throw new Error(`Login failed with status ${response.status}: ${errorText}`);
        }
      }

      const data = await response.json();
      console.log('Login success response:', data);
      console.log('Response data type:', typeof data);
      console.log('Response has user property:', 'user' in data);
      console.log('Response user value:', data.user);
      return data;
    } catch (networkError) {
      console.error('Network error during login:', networkError);
      const errorMessage = networkError instanceof Error ? networkError.message : 'Unknown network error';
      throw new Error(`Network error: ${errorMessage}`);
    }
  },

  // 註冊
  async register(userData: RegisterRequest): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || 'Registration failed');
    }

    return response.json();
  },

  // 驗證 token
  async verifyToken(token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/verify-token`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token verification failed');
    }

    return response.json();
  },
};