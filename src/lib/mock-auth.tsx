"use client";

import { createContext, useContext, ReactNode } from 'react';

interface MockUser {
  id: string;
  fullName: string;
  username: string;
  unsafeMetadata?: {
    role?: 'student' | 'teacher';
  };
  update: (data: any) => Promise<void>;
}

interface MockAuthContext {
  user: MockUser | null;
  isLoaded: boolean;
  isSignedIn: boolean;
}

const mockUser: MockUser = {
  id: 'mock-user-id',
  fullName: 'Mock User',
  username: 'mockuser',
  unsafeMetadata: {
    role: 'student'
  },
  update: async (data: any) => {
    console.log('Mock user update:', data);
  }
};

const MockAuthContext = createContext<MockAuthContext>({
  user: mockUser,
  isLoaded: true,
  isSignedIn: true,
});

export function MockAuthProvider({ children }: { children: ReactNode }) {
  return (
    <MockAuthContext.Provider value={{
      user: mockUser,
      isLoaded: true,
      isSignedIn: true,
    }}>
      {children}
    </MockAuthContext.Provider>
  );
}

export function useMockUser() {
  return useContext(MockAuthContext);
}
