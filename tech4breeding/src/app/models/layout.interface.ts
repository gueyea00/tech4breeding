export interface SidebarItem {
  label: string;
  icon: string;
  link: string;
  subItems?: SidebarItem[];  // Pour les sous-éléments
  isOpen?: boolean;           // Indicateur si les sous-éléments sont ouverts
  action?: () => void;       // Action facultative pour chaque élément (par exemple pour la déconnexion)
  role?: string[];          // Liste des rôles autorisés pour cet élément
}

export interface HeaderItem {
  label: string;
  icon: string;
  link: string;
}
