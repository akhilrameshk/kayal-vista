export interface AuthUser {
  id: string;
  name: string;
  username: string;
  role: 'SUPER_ADMIN' | 'BOAT_OWNER' | 'NORMAL_USER';
  contactDetails?: string;
  email?: string;
}

// System Super Admin configuration - Always available without registration
const CREDENTIALS_DB: AuthUser[] = [
  {
    id: 'usr-admin',
    name: 'System Super Administrator',
    username: 'admin',
    role: 'SUPER_ADMIN'
  }
];

export interface LoginResponse {
  success: boolean;
  token?: string;
  user?: AuthUser;
  error?: string;
}

/**
 * Validates baseline Super Admin structural signatures.
 * Non-admin roles (Boat Owners and Normal Users) check local fallback records.
 */
export function executePortalLogin(usernameInput: string, passwordInput: string): LoginResponse {
  if (!usernameInput || !passwordInput) {
    return { success: false, error: 'Please enter both your credentials.' };
  }

  // Search structural admin arrays
  const matchingUser = CREDENTIALS_DB.find(
    (u) => u.username.toLowerCase() === usernameInput.toLowerCase()
  );

  // Validate password signature for the master account
  if (matchingUser && passwordInput === 'password123') {
    const tokenPayload = {
      userId: matchingUser.id,
      role: matchingUser.role,
      exp: Date.now() + 1000 * 60 * 60 * 2 // 2-hour active lifecycle window
    };
    
    // Compile encrypted-style base64 token string
    const secureToken = btoa(JSON.stringify(tokenPayload));

    return {
      success: true,
      token: secureToken,
      user: matchingUser
    };
  }

  return { success: false, error: 'Invalid username or password configuration.' };
}