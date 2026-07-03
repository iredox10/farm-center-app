import { create } from 'zustand';
import { type Models } from 'appwrite';
import { account } from '@/lib/appwrite/client';
import { databases } from '@/lib/appwrite/client';
import { DATABASE_ID, PROFILES_COLLECTION } from '@/lib/appwrite/config';
import type { UserProfile } from '@/types';

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  profile: UserProfile | null;
  isLoading: boolean;
}

interface AuthActions {
  setUser: (user: Models.User<Models.Preferences> | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>()((set) => ({
  user: null,
  profile: null,
  isLoading: true,

  setUser: (user) => set({ user }),

  setProfile: (profile) => set({ profile }),

  logout: async () => {
    try {
      await account.deleteSession('current');
    } catch {
      // Session may already be expired — safe to ignore
    }
    set({ user: null, profile: null });
  },

  initialize: async () => {
    set({ isLoading: true });

    try {
      const currentUser = await account.get();
      set({ user: currentUser });

      try {
        const profileDoc = await databases.getDocument(
          DATABASE_ID,
          PROFILES_COLLECTION,
          currentUser.$id
        );

        const profile: UserProfile = {
          userId: profileDoc.$id,
          fullName: profileDoc.fullName as string,
          phone: profileDoc.phone as string,
          role: profileDoc.role as UserProfile['role'],
          avatarUrl: profileDoc.avatarUrl as string,
          createdAt: profileDoc.$createdAt,
        };

        set({ profile });
      } catch {
        // Profile not yet created — user exists but hasn't onboarded
        set({ profile: null });
      }
    } catch {
      // No active session
      set({ user: null, profile: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
