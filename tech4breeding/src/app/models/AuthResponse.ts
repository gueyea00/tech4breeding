export interface AuthResponse {
  token: string;
  user: {
    email: string;
    id_eleveur: number;
    localisation: string;
    mot_de_passe: string;
    nom: string;
    prenom: string;
    telephone: string;
    role:String
  };
  message: string;
}
