export interface User{
    id_user : number | null;
    nom : String;
    prenom : String;
    email:String;
    telephone:String;
    mot_de_passe:String;
    localisation:String;
    role: string[];  // Modifié pour être un tableau de rôles
}