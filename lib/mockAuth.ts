// Mock authentication service - stores users in localStorage
// For demo purposes only, not for production use

interface User {
  id: string;
  email: string;
  password: string; // In production, never store plain passwords!
}

const USERS_KEY = 'todo_app_users';
const CURRENT_USER_KEY = 'todo_app_current_user';

export const mockAuthService = {
  // Sign up
  signUp: async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[];
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return { error: { message: 'Email này đã được đăng ký' } };
    }

    // Create new user
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password, // In production, hash this!
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return { user: { id: newUser.id, email: newUser.email } };
  },

  // Sign in
  signInWithPassword: async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return { error: { message: 'Email hoặc mật khẩu không chính xác' } };
    }

    // Set current user
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ id: user.id, email: user.email }));

    return { user: { id: user.id, email: user.email } };
  },

  // Sign out
  signOut: async () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    return { error: null };
  },

  // Get session
  getSession: async () => {
    const currentUser = localStorage.getItem(CURRENT_USER_KEY);
    if (!currentUser) {
      return { data: { session: null } };
    }

    const user = JSON.parse(currentUser);
    return {
      data: {
        session: {
          user,
        },
      },
    };
  },

  // Reset password
  resetPasswordForEmail: async (email: string) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[];
    const userExists = users.find(u => u.email === email);

    if (!userExists) {
      // For security, don't reveal if email exists
      return { error: null };
    }

    // In a real app, you'd send an email
    // For demo, just show a message
    alert(`Link khôi phục mật khẩu được gửi đến ${email} (Demo - kiểm tra console)`);
    console.log(`Reset link for: ${email}`);

    return { error: null };
  },

  // Update user password
  updateUser: async (email: string, newPassword: string) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as User[];
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return { error: { message: 'User not found' } };
    }

    users[userIndex].password = newPassword;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return { user: { id: users[userIndex].id, email: users[userIndex].email } };
  },

  // On auth state change - returns a mock unsubscribe function
  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    // Return mock subscription
    return {
      unsubscribe: () => {},
    };
  },
};
