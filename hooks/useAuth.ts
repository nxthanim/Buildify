
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// This is just a re-export for convenience, the actual implementation is in AuthContext.tsx
// This follows a common pattern to separate context definition from the hook.
export { useAuth } from '../context/AuthContext';
