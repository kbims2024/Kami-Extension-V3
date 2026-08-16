/**
 * Utilitaires partagés pour la messagerie utilisateur ↔ CGL.
 */

/** Longueur maximale d'un message (en caractères). */
export const MAX_MESSAGE_LENGTH = 4000;

/**
 * Retire l'ancien bloc texte « --- INFORMATIONS UTILISATEUR --- » préfixé
 * dans le contenu des premiers messages. Il a été supprimé de l'API : ce
 * nettoyage ne s'applique qu'aux messages déjà stockés, pour l'affichage.
 */
const LEGACY_USER_HEADER_RE = /^--- INFORMATIONS UTILISATEUR ---[\s\S]*?^\s*[-]{10,}\s*\n*/m;

export function stripLegacyUserHeader(content: string): string {
  if (!content) return content;
  return content.replace(LEGACY_USER_HEADER_RE, '').trim();
}
