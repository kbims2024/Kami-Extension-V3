'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  TreePine,
  Zap,
  Car,
  Trash2,
  Scale,
  FileText,
  Eye,
  Handshake,
  ShieldAlert,
  BookOpen,
  BadgeCheck,
  Landmark,
  Wallet,
  Building,
} from 'lucide-react';

interface RulesSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
  articles: {
    title: string;
    rules: string[];
  }[];
}

interface RegulationRulesScreenProps {
  setCurrentScreen: (screen: string) => void;
}

const rulesData: RulesSection[] = [
  {
    id: 'general',
    title: 'Dispositions Générales',
    icon: <BookOpen className="h-6 w-6" />,
    color: 'text-brand-blue',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-l-brand-blue',
    articles: [
      {
        title: 'Objet du règlement',
        rules: [
          'Le présent règlement intérieur a pour objet de définir les règles de vie commune au sein du village KAMI-EXTENSION, garantissant à chaque résident et propriétaire un cadre de vie harmonieux, sécurisé et respectueux de l\'environnement.',
          'Il s\'applique à l\'ensemble des propriétaires de lots, résidents occupants, locataires, visiteurs et toute personne entrant dans le périmètre du village.',
          'L\'ignorance du règlement ne saurait être invoquée pour justifier un manquement. Chaque propriétaire est tenu de le communiquer à ses locataires et occupants.',
          'Tout propriétaire acquiert son lot dans le respect des présentes dispositions. La signature du contrat de réservation ou d\'achat vaut acceptation pleine et entière du présent règlement.',
        ],
      },
      {
        title: 'Définitions',
        rules: [
          '« Lot » désigne la parcelle de terrain cadastrée attribuée à un propriétaire au sein du village KAMI-EXTENSION.',
          '« Résident » désigne toute personne physiquement installée sur un lot du village, qu\'en soit le titre d\'occupation.',
          '« Comité de gestion des lots » désigne l\'organe chargé de l\'administration, de la coordination et du respect des règles du village.',
          '« Périmètre du village » désigne l\'ensemble des lots, voies, espaces communs et zones collectives délimitant KAMI-EXTENSION.',
        ],
      },
      {
        title: 'Publication et modifications',
        rules: [
          'Le règlement intérieur est affiché dans les espaces communs et accessible en ligne via la plateforme KAMI-EXTENSION.',
          'Toute modification du règlement doit être approuvée par le Comité de gestion des lots et communiquée à l\'ensemble des propriétaires au moins 30 jours avant son entrée en vigueur.',
          'Les propriétaires peuvent formuler des suggestions de modification via le Comité de gestion, qui les examinera lors de ses réunions ordinaires.',
        ],
      },
    ],
  },
  {
    id: 'urbanisme',
    title: 'Normes d\'Urbanisme et Construction',
    icon: <Building className="h-6 w-6" />,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    borderColor: 'border-l-orange-500',
    articles: [
      {
        title: 'Plan de construction',
        rules: [
          'Tout propriétaire souhaitant construire sur son lot doit soumettre un plan de construction au Comité de gestion pour approbation avant le début des travaux.',
          'Le plan doit inclure : la vue en plan, les élévations, les dimensions, les matériaux envisagés, l\'emprise au sol et la hauteur maximale de la construction.',
          'Le Comité dispose d\'un délai de 15 jours ouvrés pour donner son accord ou formuler des observations. En l\'absence de réponse dans ce délai, le plan est réputé approuvé.',
          'Toute construction non conforme au plan approuvé devra être remise en conformité aux frais du propriétaire, sous peine de sanctions.',
        ],
      },
      {
        title: 'Normes architecturales',
        rules: [
          'La hauteur maximale des constructions est fixée à deux niveaux (RDC + 1 étage), sauf dérogation expresse du Comité.',
          'L\'emprise au sol ne doit pas excéder 60 % de la surface du lot. Les 40 % restants doivent être réservés aux espaces verts, jardins et dégagements.',
          'Les façades doivent respecter une harmonie chromatique avec l\'environnement du village. Les couleurs criardes ou trop contrastées sont proscrites.',
          'Les clôtures ne doivent pas dépasser 2 mètres de hauteur. Les murs plein sont déconseillés au profit de clôtures ajourées (grilles, brise-vent végétalisés).',
          'Les toitures doivent respecter un style homogène avec les constructions avoisinantes. L\'utilisation de matériaux neufs et durables est fortement encouragée.',
          'Les fondations doivent être réalisées par des professionnels certifiés et respecter les normes parasismiques en vigueur dans la région.',
        ],
      },
      {
        title: 'Travaux et chantiers',
        rules: [
          'Les travaux doivent être réalisés exclusivement pendant les heures autorisées : du lundi au samedi, de 7h00 à 18h00. Les travaux le dimanche et jours fériés sont interdits.',
          'Le bruit excessif (percussion, utilisation de matériel lourd) est toléré uniquement entre 8h00 et 17h00 en semaine.',
          'Un panneau de chantier doit être installé avec les coordonnées de l\'entrepreneur et du propriétaire, ainsi que la durée prévue des travaux.',
          'Le chantier doit être sécurisé : clôture de protection, signalisation, accès interdit aux enfants et aux personnes non autorisées.',
          'Les déchets de chantier doivent être évacués quotidiennement. L\'accumulation de matériaux sur la voie publique est strictement interdite.',
          'Les entrepreneurs doivent être couverts par une assurance responsabilité civile professionnelle.',
        ],
      },
      {
        title: 'Extensions et modifications',
        rules: [
          'Toute extension, modification de façade, surélévation ou changement de destination doit faire l\'objet d\'une demande préalable auprès du Comité de gestion.',
          'Les installations annexes (garages, kiosques, appentis, citernes, panneaux solaires) doivent être intégrées au plan initial ou faire l\'objet d\'une autorisation séparée.',
          'La démolition partielle ou totale d\'une construction existante nécessite l\'accord préalable du Comité de gestion.',
        ],
      },
    ],
  },
  {
    id: 'proprete',
    title: 'Propreté et Hygiène',
    icon: <Trash2 className="h-6 w-6" />,
    color: 'text-emerald-600 dark:text-emerald-400',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    borderColor: 'border-l-emerald-500',
    articles: [
      {
        title: 'Entretien des lots',
        rules: [
          'Chaque propriétaire est tenu de maintenir son lot propre, entretenu et exempt de tout déchet, même en l\'absence de construction.',
          'La végétation doit être régulièrement entretenue. Les herbes hautes (supérieures à 30 cm) doivent être fauchées sous peine de mise en demeure par le Comité.',
          'Les eaux usées et de pluie doivent être correctement évacuées. Le rejet d\'eaux stagnantes ou polluantes sur la voie publique est formellement interdit.',
          'En période sèche, le propriétaire doit veiller à prévenir tout risque d\'incendie en maintenant un périmètre de sécurité autour de son lot.',
        ],
      },
      {
        title: 'Gestion des déchets',
        rules: [
          'Le tri sélectif des déchets est obligatoire. Des bacs de tri sont mis à disposition dans les points de collecte désignés par le Comité.',
          'Les ordures ménagères doivent être déposées dans les bacs prévus à cet effet avant 6h00 du matin. Le dépôt de déchets en dehors des horaires et lieux prévus est sanctionné.',
          'Les déchets encombrants, gravats et matériaux de construction doivent être évacués par le propriétaire à ses frais dans les décharges agréées.',
          'Il est formellement interdit d\'enterrer, brûler ou déverser des déchets quelconques dans le village ou à ses abords immédiats.',
          'Les produits chimiques, peintures, solvants et autres substances dangereuses doivent être éliminés conformément à la réglementation environnementale en vigueur.',
        ],
      },
      {
        title: 'Espaces communs',
        rules: [
          'Les voies, rues et chemins du village doivent rester propres et praticables. Chaque résident doit veiller à ne pas y déposer d\'obstacles ni de déchets.',
          'Il est interdit de stocker des matériaux, véhicules hors d\'usage, ou tout autre objet sur les espaces communs.',
          'Les espaces verts communs sont entretenus par le Comité de gestion. Tout résident peut y contribuer volontairement.',
        ],
      },
    ],
  },
  {
    id: 'securite',
    title: 'Sécurité et Prévention',
    icon: <ShieldAlert className="h-6 w-6" />,
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    borderColor: 'border-l-red-500',
    articles: [
      {
        title: 'Sécurité des personnes',
        rules: [
          'La circulation des véhicules motorisés dans le village est limitée à 20 km/h dans les zones résidentielles et 30 km/h sur les voies principales.',
          'Les enfants de moins de 12 ans doivent être accompagnés d\'un adulte lorsqu\'ils circulent sur les voies du village.',
          'Les terrains vagues, chantiers non sécurisés et zones dangereuses sont interdits d\'accès. Les parents sont responsables de la surveillance de leurs enfants.',
          'Toute situation de danger immédiat doit être signalée au Comité de gestion ou aux services de secours compétents.',
        ],
      },
      {
        title: 'Prévention des incendies',
        rules: [
          'Les feux de broussailles, feux de joie et brûlages à l\'air libre sont strictement interdits sans autorisation préalable du Comité de gestion.',
          'Chaque construction doit disposer d\'un extincteur conforme aux normes en vigueur, accessible et régulièrement vérifié.',
          'Les installations électriques doivent être réalisées par un professionnel certifié et respecter les normes en vigueur. Les raccordements sauvages sont formellement interdits.',
          'Un plan d\'évacuation doit être affiché dans chaque habitation. Les issues de secours doivent rester dégagées en permanence.',
          'En saison sèche (novembre à mars), le brûlage de tout débris végétal est interdit sur l\'ensemble du périmètre du village.',
        ],
      },
      {
        title: 'Sécurité des biens',
        rules: [
          'Chaque propriétaire est responsable de la sécurité de son lot et de ses biens. L\'installation de dispositifs de surveillance est encouragée.',
          'Les systèmes d\'alarme ne doivent pas perturber excessivement le voisinage. Les fausses alarmes répétées pourront faire l\'objet de sanctions.',
          'Le Comité de gestion se réserve le droit de mettre en place des dispositifs de surveillance collective (caméras, éclairage public) pour la sécurité de tous.',
          'Tout acte de vandalisme, vol ou dégradation sera signalé aux autorités compétentes et au Comité de gestion.',
        ],
      },
    ],
  },
  {
    id: 'circulation',
    title: 'Circulation et Stationnement',
    icon: <Car className="h-6 w-6" />,
    color: 'text-violet-600 dark:text-violet-400',
    bgColor: 'bg-violet-50 dark:bg-violet-950/30',
    borderColor: 'border-l-violet-500',
    articles: [
      {
        title: 'Règles de circulation',
        rules: [
          'Les véhicules doivent circuler sur les voies aménagées. La circulation hors piste est interdite sauf nécessité technique.',
          'La vitesse est limitée à 20 km/h dans les zones résidentielles et à 30 km/h sur les axes principaux du village.',
          'Les véhicules lourds (camions, engins de chantier) doivent obtenir une autorisation de circulation du Comité de gestion avant leur entrée dans le village.',
          'Les véhicules à moteur bruyant (motos sans silencieux, engins modifiés) doivent maintenir un niveau sonore acceptable sous peine d\'interdiction.',
        ],
      },
      {
        title: 'Stationnement',
        rules: [
          'Le stationnement est autorisé uniquement sur les aires prévues à cet effet et devant les lots dans le respect des dégagements.',
          'Il est interdit de stationner en double file, sur les trottoirs, aux intersections et devant les accès aux voies publiques.',
          'Les véhicules hors d\'usage, en panne prolongée ou non immatriculés doivent être retirés du village dans un délai de 15 jours sous peine de mise en fourrière.',
          'Le stationnement des poids lourds, engins de chantier et véhicules commerciaux de grande taille doit se faire dans les zones désignées à cet effet.',
          'Les deux-roues doivent être stationnés dans les espaces prévus, sans gêner la circulation piétonne ni automobile.',
        ],
      },
      {
        title: 'Véhicules non motorisés',
        rules: [
          'Les vélos, trottinettes et autres véhicules non motorisés sont encouragés et doivent circuler sur les voies prévues.',
          'Les circulations nocturnes de véhicules non motorisés doivent se faire avec un dispositif d\'éclairage.',
        ],
      },
    ],
  },
  {
    id: 'environnement',
    title: 'Environnement et Cadre de Vie',
    icon: <TreePine className="h-6 w-6" />,
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-l-green-500',
    articles: [
      {
        title: 'Protection de la nature',
        rules: [
          'L\'abattage d\'arbres existants sur le lot ou les espaces communs est soumis à l\'autorisation du Comité de gestion.',
          'Le débroussaillement doit respecter un périmètre de sécurité de 3 mètres autour des constructions.',
          'Il est encouragé de planter des arbres et arbustes locaux pour embellir le cadre de vie et contribuer à la lutte contre l\'érosion.',
          'Les espèces invasives doivent être signalées au Comité de gestion qui prendra les mesures appropriées.',
          'La chasse, la pêche et le prélèvement de ressources naturelles sont interdits dans le périmètre du village sans autorisation.',
        ],
      },
      {
        title: 'Gestion de l\'eau',
        rules: [
          'L\'utilisation rationnelle de l\'eau est une obligation pour tous. Le gaspillage d\'eau potable est proscrit.',
          'Les forages et puits individuels doivent être déclarés au Comité de gestion et respecter les normes sanitaires en vigueur.',
          'Le rejet d\'eaux usées non traitées dans la nature ou les nappes phréatiques est formellement interdit.',
          'Chaque propriétaire doit installer un système d\'assainissement conforme aux normes en vigueur avant toute occupation.',
        ],
      },
      {
        title: 'Pollution sonore et lumineuse',
        rules: [
          'Le repos nocturne doit être respecté entre 21h00 et 6h00. Toute nuisance sonore (musique, bruits divers, aboiements) est interdite pendant cette période.',
          'Les activités bruyantes (fêtes, événements) doivent faire l\'objet d\'une déclaration préalable auprès du Comité et respecter un horaire raisonnable (fin au plus tard à 22h00).',
          'L\'utilisation d\'éclairages extérieurs excessifs ou directionnels gênant le voisinage doit être évitée.',
          'Les alarms de véhicules, sirènes et dispositifs sonores d\'alerte doivent être réglés de manière à ne pas perturber le voisinage.',
        ],
      },
      {
        title: 'Animaux',
        rules: [
          'Les animaux de compagnie (chiens, chats) sont autorisés sous réserve d\'être tenus en laisse dans les espaces communs.',
          'Les propriétaires d\'animaux sont responsables des dégradations et nuisances causées par leurs animaux (aboiements, déjections, agressivité).',
          'Les animaux errants ou non identifiés seront signalés aux services compétents. L\'abandon d\'animaux dans le village est strictement interdit.',
          'L\'élevage d\'animaux de ferme (volailles, bétail) sur un lot résidentiel est soumis à l\'autorisation du Comité de gestion.',
          'Les vaccinations obligatoires doivent être à jour pour tous les animaux détenus dans le village.',
        ],
      },
    ],
  },
  {
    id: 'equipements',
    title: 'Réseaux et Équipements',
    icon: <Zap className="h-6 w-6" />,
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-950/30',
    borderColor: 'border-l-yellow-500',
    articles: [
      {
        title: 'Électricité',
        rules: [
          'Chaque lot est alimenté en électricité via le réseau du village. Le raccordement doit être réalisé par un électricien certifié.',
          'Les compteurs individuels sont la responsabilité de chaque propriétaire. Les fraudes de compteur sont passibles de poursuites.',
          'Les panneaux solaires sont encouragés. Leur installation doit être approuvée par le Comité de gestion.',
          'Les générateurs de secours doivent être installés dans des locaux ventilés, insonorisés et ne doivent pas dépasser un niveau sonore de 60 décibels à 5 mètres.',
          'Le passage des câbles aériens sur la voie publique est interdit. Les raccordements doivent être souterrains.',
        ],
      },
      {
        title: 'Eau et Assainissement',
        rules: [
          'L\'eau courante est distribuée via le réseau communal. Toute dérivation non autorisée du réseau est interdite.',
          'Les fuites sur le réseau individuel doivent être réparées dans les 48 heures de leur détection.',
          'Les systèmes d\'assainissement individuels (fosses septiques, bacs à graisse) doivent être vidangés régulièrement par des entreprises agréées.',
          'Il est interdit de connecter directement les eaux pluviales au réseau d\'assainissement.',
        ],
      },
      {
        title: 'Voirie et espaces publics',
        rules: [
          'La voirie du village est entretenue par le Comité de gestion. Les résidents doivent signaler toute dégradation constatée.',
          'Il est interdit de modifier, obstruer ou dégrader les voies publiques, trottoirs, caniveaux et espaces verts communs.',
          'Les plantations ornementales sur les espaces communs sont gérées par le Comité. Toute initiative privée doit recevoir son accord.',
        ],
      },
    ],
  },
  {
    id: 'voisinage',
    title: 'Vie de Voisinage et Cohésion Sociale',
    icon: <Handshake className="h-6 w-6" />,
    color: 'text-pink-600 dark:text-pink-400',
    bgColor: 'bg-pink-50 dark:bg-pink-950/30',
    borderColor: 'border-l-pink-500',
    articles: [
      {
        title: 'Respect et bonne conduite',
        rules: [
          'Tous les résidents se doivent un respect mutuel, sans distinction d\'origine, de religion, d\'opinion ou de statut social.',
          'Les injures, menaces, harcèlement moral ou physique, discriminations et comportements antisociaux sont strictement interdits et passibles de sanctions.',
          'Les conflits entre voisins doivent dans un premier temps faire l\'objet d\'une tentative de résolution à l\'amiable, avec l\'assistance du Comité de gestion si nécessaire.',
          'L\'entraide et la solidarité entre résidents sont fortement encouragées. Le Comité de gestion organisera des activités de cohésion sociale.',
        ],
      },
      {
        title: 'Événements et rassemblements',
        rules: [
          'Les événements privés (fêtes, cérémonies) doivent être déclarés au Comité de gestion au minimum 72 heures à l\'avance.',
          'Les événements collectifs sur les espaces communs sont organisés par le Comité de gestion. Les résidents peuvent proposer des initiatives.',
          'Le nombre de participants aux événements privés ne doit pas causer de nuisance au voisinage (stationnement, bruit, surpeuplement).',
          'Les commerces, activités économiques et services à domicile exercés dans le village nécessitent l\'autorisation du Comité de gestion.',
        ],
      },
      {
        title: 'Liberté de culte et coutumes',
        rules: [
          'La liberté de culte est garantie à tous les résidents, dans le respect des lois de la République.',
          'Les activités religieuses doivent se dérouler dans le respect de la tranquillité publique, sans nuisance sonore ni obstruction de la voie publique.',
          'Les pratiques culturelles et traditionnelles sont respectées dans la mesure où elles ne portent pas atteinte aux droits d\'autrui ni au présent règlement.',
        ],
      },
    ],
  },
  {
    id: 'cotisations',
    title: 'Cotisations et Finances',
    icon: <Wallet className="h-6 w-6" />,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-l-amber-500',
    articles: [
      {
        title: 'Cotisations obligatoires',
        rules: [
          'Chaque propriétaire est redevable d\'une cotisation annuelle pour l\'entretien des espaces communs, la voirie, l\'éclairage public et les services collectifs du village.',
          'Le montant de la cotisation est fixé par le Comité de gestion en assemblée générale, en fonction des besoins du village et des charges réelles.',
          'La cotisation est due dès la prise de possession du lot, même en l\'absence de construction.',
          'Le défaut de paiement de la cotisation dans les délais impartis entraînera des pénalités de retard et, le cas échéant, des poursuites.',
        ],
      },
      {
        title: 'Charges de copropriété',
        rules: [
          'Les frais d\'entretien des équipements collectifs (éclairage, adduction d\'eau, assainissement, voirie) sont répartis entre les propriétaires au prorata de la surface de leur lot.',
          'Les travaux d\'intérêt général décidés par le Comité de gestion peuvent faire l\'objet d\'une contribution supplémentaire temporaire.',
          'Le Comité de gestion doit publier annuellement un rapport financier détaillant les dépenses et recettes, accessible à tous les propriétaires.',
        ],
      },
      {
        title: 'Redevances spéciales',
        rules: [
          'Une redevance spéciale pourra être demandée aux propriétaires dont les projets de construction nécessitent des adaptations des réseaux ou équipements collectifs.',
          'Les frais de raccordement aux réseaux (eau, électricité) sont à la charge du propriétaire du lot.',
        ],
      },
    ],
  },
  {
    id: 'sanctions',
    title: 'Sanctions et Procédures',
    icon: <Scale className="h-6 w-6" />,
    color: 'text-red-700 dark:text-red-500',
    bgColor: 'bg-red-50 dark:bg-red-950/30',
    borderColor: 'border-l-red-600',
    articles: [
      {
        title: 'Types de manquements',
        rules: [
          'Sont considérés comme manquements : le non-respect de toute disposition du présent règlement, les nuisances de voisinage, les dégradations des espaces communs, les constructions non autorisées, le non-paiement des cotisations, et tout comportement portant atteinte à la sécurité ou à la tranquillité publique.',
          'Les manquements sont classés en trois catégories : légers (première infraction mineure), moyens (répétition ou infraction significative), graves (infraction mettant en danger la sécurité ou portant atteinte aux droits d\'autrui).',
        ],
      },
      {
        title: 'Procédure de sanction',
        rules: [
          'En cas de manquement constaté, le Comité de gestion adressera au contrevenant un avertissement écrit, lui enjoignant de régulariser la situation dans un délai de 15 jours.',
          'Si le manquement persiste après avertissement, le Comité pourra prononcer une amende dont le montant est fixé en fonction de la gravité de l\'infraction.',
          'Pour les manquements graves (construction non autorisée, nuisance grave, dégradation volontaire), le Comité pourra saisir les autorités compétentes.',
          'Tout propriétaire a le droit d\'être entendu avant toute décision de sanction. Il peut faire appel auprès du Comité de gestion dans un délai de 30 jours.',
        ],
      },
      {
        title: 'Amendes et pénalités',
        rules: [
          'Le barème des amendes est fixé par le Comité de gestion et communiqué à l\'ensemble des propriétaires.',
          'Les pénalités de retard sur les cotisations sont fixées à 2 % par mois de retard sur le montant dû.',
          'Les frais de remise en conformité (nettoyage, démolition, replantation, etc.) sont intégralement à la charge du contrevenant.',
          'Le non-paiement répété des cotisations et amendes peut entraîner des poursuites judiciaires et, en dernier recours, la mise en vente forcée du lot.',
        ],
      },
    ],
  },
  {
    id: 'comite',
    title: 'Comité de Gestion des Lots',
    icon: <Landmark className="h-6 w-6" />,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-l-purple-500',
    articles: [
      {
        title: 'Rôle et missions',
        rules: [
          'Le Comité de gestion des lots est l\'organe de direction et de coordination du village KAMI-EXTENSION.',
          'Il est chargé de : veiller au respect du présent règlement, gérer les espaces et équipements communs, organiser les assemblées générales, administrer les finances du village, coordonner les travaux d\'intérêt général.',
          'Le Comité représente les propriétaires auprès des autorités locales et des tiers.',
        ],
      },
      {
        title: 'Composition et fonctionnement',
        rules: [
          'Le Comité est composé de membres élus parmi les propriétaires pour un mandat de 2 ans renouvelable.',
          'Le Comité se réunit en session ordinaire une fois par trimestre. Des sessions extraordinaires peuvent être convoquées en cas de nécessité.',
          'Les décisions du Comité sont prises à la majorité simple des membres présents. Les décisions modifiant le règlement nécessitent une majorité des deux tiers.',
          'Les comptes rendus de réunions sont communiqués à l\'ensemble des propriétaires via la plateforme KAMI-EXTENSION.',
        ],
      },
      {
        title: 'Assemblée générale',
        rules: [
          'Une assemblée générale des propriétaires est convoquée au moins une fois par an pour l\'approbation des comptes, le vote du budget et les décisions importantes.',
          'Chaque propriétaire dispose d\'une voix par lot possédé. Le vote peut se faire en présentiel ou par procuration.',
          'L\'assemblée générale a le pouvoir de modifier le règlement intérieur, d\'approuver les dépenses exceptionnelles, et de révoquer les membres du Comité.',
        ],
      },
    ],
  },
  {
    id: 'dispositions',
    title: 'Dispositions Finales',
    icon: <FileText className="h-6 w-6" />,
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-50 dark:bg-slate-950/30',
    borderColor: 'border-l-slate-500',
    articles: [
      {
        title: 'Entrée en vigueur',
        rules: [
          'Le présent règlement intérieur entre en vigueur dès son approbation par le Comité de gestion des lots.',
          'Il s\'applique immédiatement à l\'ensemble des propriétaires et résidents actuels, ainsi qu\'à tout futur propriétaire ou résident.',
        ],
      },
      {
        title: 'Litiges',
        rules: [
          'En cas de litige entre résidents, une médiation sera proposée par le Comité de gestion avant tout recours judiciaire.',
          'Si la médiation échoue, les parties pourront saisir la juridiction compétente.',
          'Les litiges entre un résident et le Comité de gestion seront soumis à l\'arbitrage d\'un tiers indépendant désigné d\'un commun accord.',
        ],
      },
      {
        title: 'Révision',
        rules: [
          'Le présent règlement pourra être révisé par le Comité de gestion à tout moment, sur proposition d\'un membre ou d\'un groupe de propriétaires représentant au moins 10 % des lots.',
          'Toute proposition de révision doit être notifiée à l\'ensemble des propriétaires 30 jours avant la tenue de l\'assemblée générale chargée de l\'examiner.',
        ],
      },
    ],
  },
];

export function RegulationRulesScreen({ setCurrentScreen }: RegulationRulesScreenProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Expand first section by default
  useState(() => {
    if (rulesData.length > 0) {
      setExpandedSections({ [rulesData[0].id]: true });
    }
  });

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const toggleArticle = (articleKey: string) => {
    setExpandedArticles((prev) => ({ ...prev, [articleKey]: !prev[articleKey] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    rulesData.forEach((s) => {
      all[s.id] = true;
      s.articles.forEach((a, i) => {
        all[`${s.id}-${i}`] = true;
      });
    });
    setExpandedSections(all);
    setExpandedArticles(all);
  };

  const collapseAll = () => {
    setExpandedSections({});
    setExpandedArticles({});
  };

  // Filter based on search
  const filteredData = searchQuery
    ? rulesData.map((section) => ({
        ...section,
        articles: section.articles.map((article) => ({
          ...article,
          rules: article.rules.filter(
            (rule) =>
              rule.toLowerCase().includes(searchQuery.toLowerCase()) ||
              article.title.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        })).filter((article) => article.rules.length > 0),
      })).filter((section) => section.articles.length > 0)
    : rulesData;

  const totalArticles = rulesData.reduce((sum, s) => sum + s.articles.length, 0);
  const totalRules = rulesData.reduce(
    (sum, s) => sum + s.articles.reduce((aSum, a) => aSum + a.rules.length, 0),
    0
  );

  return (
    <div className="flex-1 flex flex-col bg-card pt-4 pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentScreen('home')}
          >
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Button>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-[#8B5E3C] flex items-center justify-center gap-2">
              <Scale className="h-5 w-5" />
              Règlement Intérieur
            </h2>
            <p className="text-xs text-muted-foreground text-center">
              KAMI-EXTENSION — {rulesData.length} chapitres • {totalArticles} articles • {totalRules} dispositions
            </p>
          </div>
        </div>

        {/* Search + Controls */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <input
              placeholder="Rechercher dans le règlement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#8B5E3C]"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={expandAll}
            className="text-xs whitespace-nowrap"
          >
            Tout ouvrir
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={collapseAll}
            className="text-xs whitespace-nowrap"
          >
            Tout fermer
          </Button>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="px-4 py-4 space-y-4">
          {searchQuery && filteredData.length === 0 && (
            <div className="text-center py-12">
              <Eye className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Aucun résultat pour « {searchQuery} »</p>
            </div>
          )}

          {filteredData.map((section) => (
            <Card key={section.id} className={`border-l-4 ${section.borderColor} overflow-hidden`}>
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full text-left"
              >
                <CardHeader className="p-4 pb-2 cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${section.bgColor}`}>
                      <span className={section.color}>{section.icon}</span>
                    </div>
                    <div className="flex-1">
                      <CardTitle className={`text-base ${section.color}`}>
                        {section.title}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {section.articles.length} article{section.articles.length > 1 ? 's' : ''}
                      </p>
                    </div>
                    {expandedSections[section.id] ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
              </button>

              {/* Articles */}
              {expandedSections[section.id] && (
                <CardContent className="pt-0 pb-4 px-4">
                  <div className="space-y-3 mt-2">
                    {section.articles.map((article, articleIdx) => {
                      const articleKey = `${section.id}-${articleIdx}`;
                      const isExpanded = expandedArticles[articleKey] !== false; // expanded by default

                      return (
                        <div
                          key={articleKey}
                          className="border border-border rounded-lg overflow-hidden"
                        >
                          {/* Article Header */}
                          <button
                            onClick={() => toggleArticle(articleKey)}
                            className="w-full text-left px-3 py-2.5 flex items-center gap-2 hover:bg-muted/30 transition-colors"
                          >
                            <Badge variant="outline" className="text-xs font-mono flex-shrink-0">
                              Art. {articleIdx + 1}
                            </Badge>
                            <span className="text-sm font-semibold text-foreground flex-1">
                              {article.title}
                            </span>
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            )}
                          </button>

                          {/* Article Content */}
                          {isExpanded && (
                            <div className="px-3 pb-3 space-y-2">
                              {article.rules.map((rule, ruleIdx) => (
                                <div
                                  key={ruleIdx}
                                  className="flex items-start gap-2 text-sm text-foreground/90 leading-relaxed"
                                >
                                  <span className="text-xs text-muted-foreground mt-1 flex-shrink-0 font-mono min-w-[16px]">
                                    {ruleIdx + 1}.
                                  </span>
                                  <p>{rule}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}

          {/* Footer */}
          <div className="mt-8 text-center">
            <Separator className="mb-6" />
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <BadgeCheck className="h-4 w-4" />
              <p className="text-xs">
                Règlement Intérieur du Village KAMI-EXTENSION
              </p>
            </div>
            <p className="text-xs text-muted-foreground/60 mt-1">
              Document adopté par le Comité de Gestion des Lots
            </p>
            <p className="text-xs text-muted-foreground/60">
              Pour toute question, contactez le Comité de Gestion via la plateforme.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// Search icon (since we're not importing from lucide here to keep it self-contained)
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
