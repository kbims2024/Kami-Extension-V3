/**
 * Configuration des discussions utilisateur ↔ CGL.
 *
 * Ces valeurs sont enregistrées dans le document Settings (champ
 * `discussionConfig`) et exposées :
 *  - en lecture seule côté public (`/api/discussion-config`) ;
 *  - en lecture/écriture côté admin (`/api/admin/discussion-config`).
 */

export interface DiscussionConfig {
  /** Activer / désactiver globalement les discussions utilisateur ↔ CGL. */
  enabled: boolean;
  /** Nom affiché dans l'en-tête du chat utilisateur. */
  cglName: string;
  /** Texte affiché sous le nom du CGL (ex. délai de réponse). */
  responseTimeText: string;
  /** Réponse automatique envoyée à l'utilisateur à son premier message. */
  autoReply: string;
}

export const DISCUSSION_CONFIG_DEFAULTS: DiscussionConfig = {
  enabled: true,
  cglName: 'Comité de Gestion des Lots',
  responseTimeText: 'Réponse du CGL sous 24 h ouvrées',
  autoReply:
    "Bonjour, votre message a bien été transmis au Comité de Gestion des Lots. Un membre vous répondra sous 24 h ouvrées. Merci de votre patience.",
};

export function normalizeDiscussionConfig(input: unknown): DiscussionConfig {
  const base: DiscussionConfig = { ...DISCUSSION_CONFIG_DEFAULTS };
  if (!input || typeof input !== 'object') return base;

  const obj = input as Record<string, any>;
  if (typeof obj.enabled === 'boolean') base.enabled = obj.enabled;
  if (typeof obj.cglName === 'string' && obj.cglName.trim()) {
    base.cglName = obj.cglName.trim();
  }
  if (typeof obj.responseTimeText === 'string') {
    base.responseTimeText = obj.responseTimeText.trim();
  }
  if (typeof obj.autoReply === 'string') {
    base.autoReply = obj.autoReply.trim();
  }
  return base;
}

/** Config exposée au public (sans le message de réponse automatique). */
export interface PublicDiscussionConfig {
  enabled: boolean;
  cglName: string;
  responseTimeText: string;
}

export function toPublicDiscussionConfig(
  config: DiscussionConfig
): PublicDiscussionConfig {
  return {
    enabled: config.enabled,
    cglName: config.cglName,
    responseTimeText: config.responseTimeText,
  };
}
