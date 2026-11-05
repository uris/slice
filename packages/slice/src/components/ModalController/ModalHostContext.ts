import { createContext } from 'react';

// Internal signal: only the host can declare enforced modal behavior.
export const ModalHostContext = createContext(false);
