// src/lib/stores/auth.store.svelte.ts
import type { User, UserLogin, UserRegister } from '$lib/schemas/user';
import { authApi } from '$lib/api/auth.api'; // <-- Correction : On importe l'objet global authApi

interface AsyncState<T> {
  state: 'idle' | 'loading' | 'success' | 'error';
  data: T | null;
  error: any | null;
}

class AuthStore {
  // État réactif de l'utilisateur connecté
  authState = $state<AsyncState<User>>({
    state: 'idle',
    data: null,
    error: null
  });

  // Getter pour savoir si l'utilisateur est authentifié
  isAuthenticated = $derived(this.authState.data !== null);

  /**
   * Connexion utilisateur
   */
  async login(credentials: UserLogin) {
    this.authState.state = 'loading';
    this.authState.error = null;

    // Correction ici : appel via la méthode de l'objet authApi
    const response = await authApi.login(credentials);
    
    if (response.success) {
      const authData = response.data; // Contient { user: User, token: string }
      
      this.authState.state = 'success';
      this.authState.data = authData.user; // On sauvegarde l'utilisateur dans l'état
      
      return { success: true };
    } else {
      this.authState.state = 'error';
      this.authState.error = response.error.message || 'Une erreur est survenue';
      
      return { success: false, error: this.authState.error };
    }
  }

  /**
   * Inscription utilisateur (Ajouté pour compléter ton Module 05)
   */
  async register(data: UserRegister) {
    this.authState.state = 'loading';
    this.authState.error = null;

    const response = await authApi.register(data);
    
    if (response.success) {
      this.authState.state = 'success';
      this.authState.data = response.data.user;
      return { success: true };
    } else {
      this.authState.state = 'error';
      this.authState.error = response.error.message || "Échec de l'inscription";
      return { success: false, error: this.authState.error };
    }
  }

  /**
   * Déconnexion utilisateur
   */
  async logout() {
    this.authState.state = 'loading';
    
    const response = await authApi.logout();
    
    if (response.success) {
      this.authState.state = 'idle';
      this.authState.data = null;
    }
  }
}

// Instance unique partagée dans toute l'application
export const authStore = new AuthStore();