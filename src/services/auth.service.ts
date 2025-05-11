import api from '@/services/api.service'

export default  {
  /**
   * Enregistre un nouvel utilisateur.
   * @param user - Les informations de l'utilisateur à enregistrer.
   * @returns Les données de la réponse de l'API.
   */
  async register(user: any) {
    return await api.post('/auth/register/user', user)
  },
  /**
   * Connecte un utilisateur.
   * @param user - Les informations de l'utilisateur pour la connexion.
   * @returns les nouvelles données de l'utilisateur comme réponse API, y compris les tokens
   */
  async login(user) {
    return await api.post('/auth/login', user);
  },

  /**
   * Déconnecte un utilisateur.
   */
  async logout() {
      await api.post('/auth/logout')
  },

  /**
   * Vérifie si un utilisateur est connecté.
   * @returns les nouvelles données de l'utilisateur comme réponse API
   */

  async checkAuth() {
    return await api.get('/auth/me');
  },

  /**
   * Rafraîchit le token d'accès.
   * @returns les nouvelles données de l'utilisateur comme réponse API
   */

  async refreshToken() {
    await api.post('/auth/refresh-token');
  },
  /**
   * Demande une réinitialisation de mot de passe pour un utilisateur.
   * @param email - L'email de l'utilisateur pour la réinitialisation du mot de passe.
   * @returns les nouvelles données de l'utilisateur comme réponse API
   */
  async requestPasswordReset(email: string) {
      return await api.post('/auth/request-password-reset', { email })
  },
  /**
   * Réinitialise le mot de passe d'un utilisateur.
   * @param token - Le token de réinitialisation de mot de passe.
   * @param newPassword - Le nouveau mot de passe.
   * @returns les nouvelles données de l'utilisateur comme réponse API
   */
  async resetPassword(token: string, newPassword: string) {
      return await api.post('/auth/reset-password', {
        token: token,
        newPassword: newPassword
      })
  },

  async updateAccessCode(accessCode: string) {
      const response = await api.patch(`/users/access-code`, { accessCode: accessCode });
      return response.data;

  },

  async validateAccessCode(accessCode: string) {
      const response = await api.post(`/users/validate-access-code`, { accessCode: accessCode });
      return response.data;
  },

  async setAccessCode(accessCode: string) {
      return await api.post(`/users/access-code`, { accessCode: accessCode });
  },

  /**
   * Fetch all users with the role of therapist.
   */
  async fetchAllTherapists() {
    const response = await api.get('/users/therapists');
    return response.data;
  },

  async findOneById(id: string) {
      const response = await api.get(`/users/${id}`);
      return response.data;
  },

  async updateUser(userId: string, updatedUser: any) {
      const response = await api.patch(`/users/${userId}`, updatedUser);
      return response.data;
  },

  async updateUserTags(userId: string, tags: string[]) {
      const response = await api.patch(`/users/${userId}/tags`, { tagIds: tags });
      return response.data;
  },

  async updateUserTriggers(userId: string, triggers: string[]) {
      const response = await api.patch(`/users/${userId}/triggers`, { triggerIds: triggers });
      return response.data;
  },

  async deleteUser(userId: string) {
      const response = await api.delete(`/users/${userId}`);
      return response.data;
  },

}

