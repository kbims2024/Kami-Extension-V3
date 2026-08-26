'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ArrowLeft,
  Home,
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
  ShieldCheck,
  BookOpen,
  BadgeCheck,
  Landmark,
  Wallet,
  Building,
  Building2,
  Store,
  Wifi,
  Heart,
  Droplets,
  Dumbbell,
  Users,
  Gavel,
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
  onHome?: () => void;
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
      {
        title: 'Champ d\'application territorial',
        rules: [
          'Le présent règlement s\'applique à l\'intérieur des bornes cadastrales du lotissement KAMI-EXTENSION, telles que définies par l\'arrêté de lotissement et le plan cadastral en vigueur.',
          'Les zones tampons situées aux abords immédiats du village, y compris les voies d\'accès principale et secondaire, sont soumises aux dispositions relatives à la circulation, à la sécurité et à l\'environnement du présent règlement.',
          'Toute extension future du périmètre du village fera l\'objet d\'un avenant au présent règlement, soumis à l\'approbation de l\'assemblée générale.',
          'Les servitudes de passage, réseaux et équipements traversant le périmètre restent soumises aux conventions passées avec les concessionnaires publics et les autorités locales.',
        ],
      },
      {
        title: 'Principes directeurs',
        rules: [
          'Le village KAMI-EXTENSION est fondé sur les principes de solidarité, de respect mutuel, de développement durable et de préservation du patrimoine commun.',
          'Toute décision prise dans le cadre du village doit concilier l\'intérêt individuel des propriétaires avec l\'intérêt collectif de la communauté.',
          'Les valeurs culturelles camerounaises de vivre-ensemble, de tolérance et d\'entraide constituent le socle des relations de voisinage.',
          'Le développement du village doit intégrer les impératifs d\'adaptation au changement climatique, notamment en matière de gestion des ressources en eau et de lutte contre l\'érosion des sols.',
        ],
      },
    ],
  },
  {
    id: 'acquisition',
    title: 'Conditions d\'Acquisition et de Cession des Lots',
    icon: <BadgeCheck className="h-6 w-6" />,
    color: 'text-teal-600 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-950/30',
    borderColor: 'border-l-teal-500',
    articles: [
      {
        title: 'Modalités d\'acquisition',
        rules: [
          'L\'acquisition d\'un lot au sein de KAMI-EXTENSION s\'effectue par la signature d\'un contrat de réservation, suivi d\'un acte de vente définitif établi devant un notaire ou un huissier compétent.',
          'L\'acquéreur doit fournir les pièces justificatives requises : pièce d\'identité nationale valide, justificatif de domicile, certificat de non-poursuite, et attestations fiscales à jour.',
          'Le paiement du prix d\'acquisition peut s\'effectuer par virement bancaire, par Mobile Money (MTN Mobile Money, Orange Money, Moov Money) ou par tout autre moyen agréé par le Comité de gestion.',
          'L\'acquéreur dispose d\'un délai de 90 jours à compter de la signature du contrat de réservation pour procéder à la signature de l\'acte de vente définitif, sous peine de résolution du contrat.',
          'Tout acquéreur accepte expressément le présent règlement intérieur dont il reconnaît avoir pris connaissance préalablement à la signature.',
          'En cas de paiement échelonné, l\'acquéreur ne dispose pas du droit de construire tant que la totalité du prix n\'est pas acquittée, sauf accord exprès du Comité de gestion.',
        ],
      },
      {
        title: 'Droit de préemption',
        rules: [
          'En cas de projet de cession d\'un lot par un propriétaire, le Comité de gestion dispose d\'un droit de préemption pour le rétrocéder à un autre propriétaire du village souhaitant agrandir sa parcelle.',
          'Le propriétaire cédant doit notifier au Comité de gestion son intention de vendre, en précisant les conditions de prix et de modalités de paiement, par lettre recommandée ou message écrit sur la plateforme.',
          'Le Comité de gestion dispose d\'un délai de 30 jours pour exercer son droit de préemption. Passé ce délai, le propriétaire est libre de céder son lot à un tiers.',
          'Le droit de préemption ne s\'applique pas aux cessions entre ascendants et descendants directs, ni aux donations familiales.',
          'En cas d\'exercice du droit de préemption, le Comité de gestion s\'engage à procéder au paiement dans un délai de 60 jours à compter de sa réponse favorable.',
        ],
      },
      {
        title: 'Cession et revente',
        rules: [
          'Toute cession ou revente d\'un lot doit être notifiée au Comité de gestion et faire l\'objet d\'un avenant au contrat d\'origine.',
          'Le nouveau propriétaire doit souscrire au présent règlement intérieur et s\'acquitter des éventuelles cotisations arriérées du vendeur.',
          'Les frais de mutation, droits d\'enregistrement et honoraires notariaux sont à la charge de l\'acquéreur, conformément à la législation camerounaise en vigueur.',
          'Il est interdit de céder un lot grevé de dettes de cotisations non réglées. Le Comité de gestion se réserve le droit d\'opposer son veto à toute transaction portant sur un lot non régularisé.',
          'Le Comité de gestion se réserve un droit de regard sur l\'identité du nouveau propriétaire afin de préserver l\'harmonie sociale du village.',
        ],
      },
      {
        title: 'Succession et transmission',
        rules: [
          'En cas de décès d\'un propriétaire, les droits attachés au lot sont transmis aux héritiers légaux conformément aux dispositions du droit camerounais des successions.',
          'Les héritiers doivent se manifester auprès du Comité de gestion dans un délai de six mois à compter du décès pour régulariser la situation administrative du lot.',
          'Le Comité de gestion accorde aux héritiers un délai de grâce de 12 mois pour le règlement des cotisations arriérées, avant l\'application de toute pénalité.',
          'En cas de succession litigieuse ou d\'indivision, les parties doivent désigner un mandataire unique pour représenter le lot dans les instances du village.',
          'Les donations entre vifs et les legs testamentaires sont soumis aux mêmes formalités de notification que les cessions ordinaires.',
        ],
      },
      {
        title: 'Séquestre et opposition',
        rules: [
          'Le Comité de gestion peut prononcer la mise sous séquestre d\'un lot en cas de litige grave entre copropriétaires ou en cas de contestation judiciaire portant sur la propriété.',
          'Le séquestre entraîne la suspension temporaire des droits d\'usage et de construction sur le lot concerné, jusqu\'à la résolution du litige.',
          'Le Comité de gestion peut opposer une opposition sur un lot en cas de non-paiement répété des cotisations, de construction non autorisée ou de manquement grave au règlement.',
          'Toute opposition doit être notifiée par écrit au propriétaire concerné, avec indication des motifs et des voies de recours disponibles.',
          'L\'opposition est levée de plein droit dès la régularisation de la situation ayant motivé sa mise en place.',
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
      {
        title: 'Matériaux et techniques de construction',
        rules: [
          'L\'utilisation de matériaux locaux (terre stabilisée, briques cuites, bambou traité) est encouragée pour favoriser l\'intégration architecturale et réduire l\'empreinte carbone du village.',
          'Les matériaux de construction importés doivent être conformes aux normes camerounaises et être accompagnés d\'un certificat de conformité.',
          'L\'utilisation de parpaings de qualité inférieure ou de matériaux de récupération non certifiés est interdite pour les structures porteuses.',
          'Les techniques de construction doivent tenir compte des conditions climatiques locales : vents de l\'harmattan, saison des pluies (mars-octobre), et températures élevées.',
          'Les propriétaires sont encouragés à recourir aux artisans et professionnels référencés par la plateforme KAMI-EXTENSION pour garantir la qualité des travaux.',
        ],
      },
      {
        title: 'Contrôle de conformité',
        rules: [
          'Le Comité de gestion effectue des visites de chantier régulières pour vérifier la conformité des constructions en cours avec les plans approuvés.',
          'À l\'achèvement des travaux, le propriétaire doit solliciter une visite de réception auprès du Comité, qui délivrera un certificat de conformité.',
          'Le certificat de conformité est un préalable indispensable à toute mise en habitation ou occupation du lot.',
          'En cas de non-conformité constatée, le propriétaire dispose de 30 jours pour effectuer les corrections requises, sous peine de sanctions prévues au chapitre des sanctions.',
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
      {
        title: 'Éclairage public',
        rules: [
          'L\'éclairage public du village est assuré par des lampadaires solaires et de connexion au réseau CIE. Le Comité de gestion est responsable de leur entretien.',
          'Il est interdit de débrancher, endommager ou modifier les installations d\'éclairage public sous quelque prétexte que ce soit.',
          'Les propriétaires dont les lots sont situés à proximité des lampadaires doivent veiller à ne pas obstruer leur rayonnement lumineux par des plantations ou constructions.',
          'Le Comité de gestion pourra installer un éclairage complémentaire dans les zones identifiées comme insuffisamment éclairées, sur proposition des résidents.',
          'En cas de panne d\'éclairage public, les résidents sont invités à la signaler immédiatement via la plateforme KAMI-EXTENSION ou auprès du Comité.',
        ],
      },
      {
        title: 'Gaz et combustibles',
        rules: [
          'Le stockage de gaz en bouteille doit se faire dans un local ventilé, à l\'abri du soleil et des sources de chaleur, et en respectant les quantités réglementaires.',
          'Les bonbonnes de gaz vides doivent être évacuées par les fournisseurs agréés. Il est interdit de les stocker en plein air ou sur les espaces communs.',
          'L\'utilisation de charbon de bois comme combustible domestique est autorisée mais doit se faire dans des foyers appropriés, avec une ventilation adéquate pour éviter les risques d\'intoxication.',
          'Le stockage de carburant ou de produits inflammables en grande quantité sur un lot est interdit au-delà de 50 litres, sauf autorisation spéciale du Comité de gestion.',
          'Les réservoirs de gaz domestique (butane, propane) doivent être vérifiés tous les deux ans par un professionnel agréé.',
        ],
      },
    ],
  },
  {
    id: 'eaux-pluviales',
    title: 'Gestion des Eaux Pluviales et Drainage',
    icon: <Droplets className="h-6 w-6" />,
    color: 'text-sky-600 dark:text-sky-400',
    bgColor: 'bg-sky-50 dark:bg-sky-950/30',
    borderColor: 'border-l-sky-500',
    articles: [
      {
        title: 'Caniveaux et fossés',
        rules: [
          'Chaque propriétaire est responsable de l\'entretien des caniveaux et fossés bordant son lot. Un curage semestriel est obligatoire avant le début de la saison des pluies (mars) et après la fin de celle-ci (novembre).',
          'Il est strictement interdit de combler, rétrécir ou détourner les caniveaux et fossés de drainage public à des fins privées.',
          'Les matériaux de construction, déchets végétaux ou tout obstacle ne doivent en aucun cas être déposés dans les caniveaux, sous peine de sanctions immédiates.',
          'Les propriétaires doivent s\'assurer que les regards de visite et bouches d\'évacuation situés sur ou à proximité de leur lot restent librement accessibles et dégagés en permanence.',
          'Le Comité de gestion procède à un contrôle annuel de l\'ensemble du réseau de drainage et adresse des mises en demeure aux propriétaires défaillants.',
          'En cas de bouchage imputable à un lot particulier, les frais de débouchage sont à la charge du propriétaire concerné.',
        ],
      },
      {
        title: 'Gestion des inondations',
        rules: [
          'Le village KAMI-EXTENSION est situé dans une zone soumise aux risques d\'inondation pendant la saison des pluies. Chaque propriétaire doit prendre les mesures préventives nécessaires.',
          'Les constructions doivent respecter un niveau de seuil minimal par rapport au niveau naturel du terrain, fixé par le plan d\'urbanisme du village, afin de prévenir les infiltrations.',
          'Le Comité de gestion élabore chaque année, avant le mois de mars, un plan de prévention des inondations incluant les actions de curage, de renforcement des berges et de sensibilisation des résidents.',
          'En cas de crue ou d\'inondation, le Comité de gestion coordonne les actions de secours et d\'assistance aux résidents sinistrés.',
          'Les propriétaires sont tenus de signaler immédiatement toute situation de risque d\'inondation (ruissellement anormal, érosion, glissement de terrain) au Comité de gestion.',
        ],
      },
      {
        title: 'Rétention et infiltration des eaux',
        rules: [
          'Les lots doivent être aménagés de manière à favoriser l\'infiltration naturelle des eaux pluviales. Les surfaces imperméabilisées (béton, bitume) ne doivent pas excéder 50 % de la surface du lot.',
          'Les propriétaires sont encouragés à installer des dispositifs de récupération d\'eau de pluie (citernes, cuves) pour l\'arrosage et les usages domestiques non potables.',
          'Les noues de rétention, bassins d\'orage et puits d\'infiltration collectifs sont gérés par le Comité de gestion et ne doivent en aucun cas être obstrués ou modifiés.',
          'Les rejets d\'eaux pluviales provenant d\'un lot ne doivent pas se déverser directement sur le lot voisin. Le propriétaire doit aménager un dispositif de ruissellement conforme.',
          'Le Comité de gestion peut imposer à tout propriétaire la réalisation de travaux de drainage complémentaires si le lot est identifié comme contributeur à un problème de ruissellement.',
        ],
      },
    ],
  },
  {
    id: 'telecom',
    title: 'Télécommunications et Numérique',
    icon: <Wifi className="h-6 w-6" />,
    color: 'text-cyan-600 dark:text-cyan-400',
    bgColor: 'bg-cyan-50 dark:bg-cyan-950/30',
    borderColor: 'border-l-cyan-500',
    articles: [
      {
        title: 'Réseau internet et téléphonie',
        rules: [
          'Le village KAMI-EXTENSION encourage le déploiement de l\'accès à internet haut débit. Les propriétaires peuvent souscrire aux offres des opérateurs télécoms locaux (MTN, Orange, Moov).',
          'L\'installation de connexions internet par fibre optique, câble ou satellite est libre, sous réserve du respect des règles d\'esthétique et de non-nuisance.',
          'Les propriétaires sont encouragés à participer au financement d\'un réseau internet communautaire (Wi-Fi partagé) si une telle initiative est proposée par le Comité de gestion.',
          'Les coupures de ligne téléphonique ou d\'internet affectant les réseaux collectifs doivent être signalées au Comité de gestion, qui coordonnera les interventions avec les opérateurs.',
          'L\'utilisation de technologies numériques doit respecter la législation ivoirienne en vigueur relative aux télécommunications et aux communications électroniques.',
        ],
      },
      {
        title: 'Antennes et équipements',
        rules: [
          'L\'installation d\'antennes de téléphonie mobile, de paraboliques, de répéteurs Wi-Fi ou de tout équipement de transmission sur un lot privé nécessite l\'autorisation du Comité de gestion.',
          'Les équipements de télécommunication doivent être installés de manière discrète, sans dénaturer l\'aspect extérieur des constructions ni gêner le voisinage.',
          'Les opérateurs télécoms souhaitant installer des antennes relais dans le périmètre du village doivent obtenir l\'accord préalable du Comité de gestion et respecter les normes d\'émission électromagnétique.',
          'Les propriétaires ne doivent en aucun cas installer des équipements de télécommunication sur les toits ou façades donnant sur la voie publique sans autorisation.',
          'En cas de danger ou de dégradation d\'un équipement de télécommunication, le propriétaire doit immédiatement en informer le Comité de gestion et l\'opérateur concerné.',
        ],
      },
      {
        title: 'Données personnelles et vie privée',
        rules: [
          'Les données personnelles des résidents collectées par la plateforme KAMI-EXTENSION sont traitées conformément à la loi relative à la protection des données personnelles en Côte d\'Ivoire.',
          'Il est interdit de collecter, stocker ou utiliser les données personnelles d\'un autre résident sans son consentement express.',
          'Les caméras de surveillance individuelles ne doivent pas filmer les espaces communs ni les lots voisins. Leur orientation doit être strictement limitée au périmètre privé du propriétaire.',
          'Toute utilisation abusive de données personnelles (harcèlement numérique, divulgation d\'informations privées) sera sanctionnée conformément au présent règlement et aux lois en vigueur.',
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
      {
        title: 'Lutte antivectorielle et santé publique',
        rules: [
          'Les propriétaires doivent veiller à éliminer les gîtes larvaires de moustiques (eaux stagnantes, pneus usés, récipients abandonnés) pour prévenir le paludisme et la dengue, particulièrement endémiques dans la région.',
          'Le Comité de gestion organise des campagnes régulières de démoustication et de lutte antivectorielle, auxquelles tous les résidents sont tenus de participer.',
          'L\'utilisation d\'insecticides et de produits de traitement doit se conformer aux normes de l\'Organisation Mondiale de la Santé (OMS) et ne pas nuire à l\'environnement.',
          'En cas de déclaration d\'épidémie (choléra, fièvre typhoïde, COVID-19 ou autre), les résidents sont tenus de se conformer aux directives des autorités sanitaires et du Comité de gestion.',
          'Les latrines et systèmes d\'assainissement doivent être maintenus dans un état d\'hygiène irréprochable, avec une vidange régulière par des prestataires agréés.',
        ],
      },
      {
        title: 'Gestion des eaux usées ménagères',
        rules: [
          'Les eaux grises (cuisine, douche, lessive) doivent être dirigées vers un système de filtration ou d\'infiltration conforme avant tout rejet dans le milieu naturel.',
          'Il est formellement interdit de déverser des eaux usées sur la voie publique, dans les caniveaux pluviaux ou sur les lots voisins.',
          'Les fosses septiques doivent être construites selon les normes en vigueur, avec une distance minimale de 15 mètres par rapport aux puits et sources d\'eau potable.',
          'Le Comité de gestion peut imposer la mise en place de bacs à graisse pour les lots abritant des activités de restauration ou de services générant des effluents chargés.',
          'Les vidanges de fosses septiques doivent être réalisées par des entreprises spécialisées disposant des agréments nécessaires, et les boues doivent être évacuées vers les stations d\'épuration agréées.',
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
      {
        title: 'Lutte contre l\'érosion et la désertification',
        rules: [
          'Conscients de la vulnérabilité du contexte sahélo-soudanien, les propriétaires sont tenus de mettre en place des mesures de lutte contre l\'érosion sur leur lot (plantation d\'arbres, diguettes en pierre, banquettes anti-érosives).',
          'Le défrichage excessif des terrains en pente est interdit. Les pentes supérieures à 15 % doivent conserver une couverture végétale permanente.',
          'Le Comité de gestion organise annuellement une campagne de reboisement communal à laquelle tous les propriétaires sont invités à participer.',
          'Les constructions en bordure de ravins ou de cours d\'eau saisonniers doivent respecter un recul minimal de 10 mètres par rapport au lit majeur.',
          'L\'utilisation de techniques de conservation des eaux et des sols (CES) est fortement encouragée et peut faire l\'objet de subventions par le Comité de gestion.',
        ],
      },
    ],
  },
  {
    id: 'loisirs',
    title: 'Espaces Récréatifs et Sportifs',
    icon: <Dumbbell className="h-6 w-6" />,
    color: 'text-lime-600 dark:text-lime-400',
    bgColor: 'bg-lime-50 dark:bg-lime-950/30',
    borderColor: 'border-l-lime-500',
    articles: [
      {
        title: 'Aires de jeux et espaces de détente',
        rules: [
          'Le village dispose d\'aires de jeux pour enfants et d\'espaces de détente ouverts à l\'ensemble des résidents. Ces espaces sont entretenus par le Comité de gestion.',
          'L\'utilisation des aires de jeux est réservée aux mineurs de moins de 14 ans. Les enfants de moins de 8 ans doivent être accompagnés d\'un adulte responsable.',
          'Il est interdit d\'endommager, vandaliser ou détourner de leur usage les équipements de jeu (balançoires, toboggans, bancs, tables).',
          'Les animaux ne sont pas admis dans les aires de jeux, à l\'exception des chiens guides d\'aveugle.',
          'Le Comité de gestion se réserve le droit de fermer temporairement une aire de jeux pour travaux d\'entretien ou en cas de danger constaté.',
        ],
      },
      {
        title: 'Installations sportives',
        rules: [
          'Les terrains de sport (football, basket, volley) mis à disposition par le village sont ouverts à tous les résidents du lundi au samedi, de 7h00 à 18h00.',
          'L\'utilisation des installations sportives le dimanche est soumise à autorisation préalable, afin de préserver le repos dominical des résidents riverains.',
          'Les utilisateurs doivent respecter les équipements, nettoyer les installations après usage et signaler toute dégradation constatée.',
          'Les matchs ou compétitions sportives organisés sur les installations du village doivent être déclarés au Comité de gestion 48 heures à l\'avance.',
          'Il est interdit d\'installer des équipements sportifs permanents (buts, filets fixes) sans l\'autorisation du Comité de gestion.',
        ],
      },
      {
        title: 'Règles d\'utilisation',
        rules: [
          'Les espaces récréatifs et sportifs sont des biens collectifs. Leur usage doit respecter les principes de partage, de sécurité et de respect d\'autrui.',
          'La consommation d\'alcool et de substances illicites est strictement interdite dans et aux abords des espaces récréatifs et sportifs.',
          'Les comportements violents, les insultes et les discriminations lors d\'activités sportives ou récréatives sont passibles de sanctions immédiates et d\'interdiction temporaire.',
          'Les mineurs non accompagnés ne sont pas autorisés dans les installations sportives après 18h00.',
          'Le Comité de gestion peut organiser des tournois, animations sportives et événements culturels sur ces espaces, en concertation avec les résidents.',
          'Toute proposition de création d\'un nouvel espace récréatif ou sportif peut être soumise au Comité de gestion, qui l\'examinera en fonction des ressources disponibles.',
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
      {
        title: 'Motos-taxis et transport informel',
        rules: [
          'Les motos-taxis (benskins) et autres véhicules de transport informel sont soumis à une réglementation spécifique au sein du village.',
          'Les stations d\'attente des motos-taxis doivent être situées dans les zones désignées par le Comité de gestion, à l\'entrée principale du village.',
          'Il est interdit aux motos-taxis de pénétrer dans les zones strictement résidentielles, sauf pour déposer ou récupérer un client à son domicile.',
          'Les conducteurs de motos-taxis doivent être en possession de leur permis de conduire et de leur carte professionnelle de transport.',
          'Le Comité de gestion se réserve le droit de réguler le nombre de motos-taxis autorisées à stationner dans le village, en fonction de la capacité d\'accueil disponible.',
          'Les courses nocturnes par motos-taxi au sein du village sont interdites entre 22h00 et 6h00, sauf urgences médicales dûment justifiées.',
        ],
      },
      {
        title: 'Pédestres et trottoirs',
        rules: [
          'Les trottoirs et espaces piétonniers sont exclusivement réservés aux piétons, aux personnes à mobilité réduite et aux véhicules non motorisés.',
          'Il est interdit d\'encombrer les trottoirs avec des objets, matériaux, plantations ou véhicules de quelque nature que ce soit.',
          'Les descentes d\'eau de toiture ne doivent pas se déverser directement sur les trottoirs mais être raccordées au réseau de drainage.',
          'Le Comité de gestion veillera à la maintenance et à l\'accessibilité des trottoirs, y compris en saison des pluies où les surfaces peuvent devenir glissantes.',
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
      {
        title: 'Gardiennage et surveillance',
        rules: [
          'Le Comité de gestion peut mettre en place un service de gardiennage communal, dont le financement est assuré par les cotisations des propriétaires.',
          'Les gardiens communautaires sont habilités à effectuer des rondes de surveillance, contrôler les accès au village et signaler les situations anormales.',
          'Les résidents doivent coopérer avec les gardiens et leur fournir toute information utile à la sécurité collective.',
          'En cas de disparition d\'effets ou de suspicion de vol, le résident doit déposer plainte auprès des forces de l\'ordre et en informer simultanément le Comité de gestion.',
          'L\'accès au village peut être régulé par un système de portail automatique ou de barrière, selon les décisions de l\'assemblée générale.',
        ],
      },
      {
        title: 'Sécurité pendant les événements',
        rules: [
          'Tout événement rassemblant plus de 50 personnes doit faire l\'objet d\'un plan de sécurité incluant les issues de secours, la disponibilité d\'extincteurs et les numéros d\'urgence.',
          'L\'organisateur d\'un événement privé est responsable de la sécurité des participants pendant la durée de l\'événement.',
          'Le Comité de gestion peut imposer la présence de vigiles ou de gardiens supplémentaires pour les événements de grande envergure.',
          'Les issues de secours des lots et espaces communs doivent être clairement signalées et accessibles en permanence, y compris pendant les événements.',
        ],
      },
    ],
  },
  {
    id: 'assurances',
    title: 'Assurances et Gestion des Risques',
    icon: <ShieldCheck className="h-6 w-6" />,
    color: 'text-slate-600 dark:text-slate-400',
    bgColor: 'bg-slate-50 dark:bg-slate-950/30',
    borderColor: 'border-l-slate-500',
    articles: [
      {
        title: 'Assurances obligatoires',
        rules: [
          'Tout propriétaire d\'un lot construit au sein de KAMI-EXTENSION doit souscrire une assurance multirisque habitation couvrant les risques d\'incendie, de dégât des eaux, de catastrophe naturelle et de responsabilité civile.',
          'L\'attestation d\'assurance doit être fournie au Comité de gestion dans un délai de 30 jours suivant la fin des travaux ou la mise en habitation.',
          'Le Comité de gestion se réserve le droit de vérifier la validité des attestations d\'assurance lors des visites de conformité.',
          'Tout propriétaire non assuré encoure une amende mensuelle de 10 % du montant de la cotisation annuelle, jusqu\'à régularisation de sa situation.',
          'Les assurances souscrites doivent comporter une clause couvrant les dommages causés aux tiers, y compris aux voisins et aux espaces communs.',
        ],
      },
      {
        title: 'Responsabilité civile',
        rules: [
          'Tout propriétaire est responsable des dommages causés par sa construction, ses installations, ses animaux ou les personnes résidant sur son lot aux tiers et aux espaces communs.',
          'En cas de dommage causé à un lot voisin (infiltration d\'eau, effondrement, nuisance), le propriétaire responsable doit prendre à sa charge les frais de réparation dans un délai de 30 jours.',
          'Le Comité de gestion ne saurait être tenu pour responsable des dommages causés individuellement par un propriétaire à un autre propriétaire.',
          'Les litiges de responsabilité civile entre voisins sont soumis à la procédure de médiation prévue au présent règlement avant tout recours judiciaire.',
        ],
      },
      {
        title: 'Catastrophes naturelles',
        rules: [
          'En cas de catastrophe naturelle (inondation, séisme, tempête), le Comité de gestion active immédiatement le plan d\'urgence communal.',
          'Un fonds de solidarité catastrophe est alimenté par une contribution annuelle de 2 % du montant des cotisations, destiné à aider les résidents sinistrés.',
          'Les résidents sinistrés peuvent bénéficier d\'une exonération temporaire de cotisation, sur décision de l\'assemblée générale extraordinaire.',
          'Le Comité de gestion coordonne l\'aide aux sinistrés avec les services de la protection civile, la Croix-Rouge camerounaise et les organisations humanitaires compétentes.',
          'Chaque propriétaire est tenu de souscrire une garantie catastrophe naturelle dans le cadre de son assurance multirisque.',
        ],
      },
      {
        title: 'Garanties des travaux',
        rules: [
          'Les travaux de construction réalisés dans le village bénéficient des garanties légales : garantie de parfait achèvement (1 an), garantie biennale (2 ans), et garantie décennale (10 ans).',
          'Les entrepreneurs et artisans intervenant dans le village doivent être en mesure de justifier de leur assurance décennale pour les travaux de gros œuvre.',
          'Le Comité de gestion tient un registre des entrepreneurs et artisans agréés, accessible aux propriétaires via la plateforme KAMI-EXTENSION.',
          'En cas de malfaçon ou de défaut de construction dans le délai de garantie, le propriétaire doit notifier le constructeur et le Comité de gestion pour faire jouer les garanties applicables.',
          'Les entrepreneurs non assurés ou ne disposant pas des qualifications requises se voient refuser l\'autorisation de travailler dans le village par le Comité de gestion.',
        ],
      },
    ],
  },
  {
    id: 'activites',
    title: 'Activités Économiques et Artisanales',
    icon: <Store className="h-6 w-6" />,
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/30',
    borderColor: 'border-l-indigo-500',
    articles: [
      {
        title: 'Activités commerciales',
        rules: [
          'Les activités commerciales (boutiques, épiceries, restaurants, bars, salons de coiffure) exercées au sein du village sont soumises à l\'autorisation préalable du Comité de gestion.',
          'Le demandeur doit fournir un dossier comprenant : le plan d\'aménagement du local, l\'autorisation d\'exploitation municipale, l\'attestation de patente, et une copie de la pièce d\'identité.',
          'Les activités commerciales doivent être exercées dans les lots à usage mixte ou commercial identifiés dans le plan d\'urbanisme du village. Les zones purement résidentielles sont exclues.',
          'Les horaires d\'ouverture des commerces sont fixés par le Comité de gestion. En principe, la fermeture est obligatoire à 22h00 du lundi au samedi et à 20h00 le dimanche.',
          'Le nombre de commerces de même nature peut être régulé par le Comité pour éviter une concurrence déloyale et préserver l\'équilibre commercial du village.',
          'Toute modification de l\'activité commerciale initiale nécessite une nouvelle autorisation du Comité de gestion.',
        ],
      },
      {
        title: 'Professions libérales et services',
        rules: [
          'Les professions libérales (avocats, médecins, architectes, experts-comptables) et les services (écoles privées, centres de formation, cabinets) sont autorisés sous réserve d\'autorisation du Comité.',
          'Les cabinets et bureaux professionnels doivent respecter les normes d\'accessibilité, de sécurité et de stationnement prévues par le présent règlement.',
          'Les enseignes et plaques professionnelles doivent respecter les dimensions et l\'esthétique fixées par le Comité de gestion. La publicité sauvage est interdite.',
          'Les activités médicales et paramédicales doivent être exercées dans le strict respect des normes sanitaires camerounaises et disposer des agréments requis par le MINSANTE.',
          'Les écoles et centres de formation doivent obtenir les autorisations d\'ouverture délivrées par les autorités de l\'éducation nationale et les communiquer au Comité de gestion.',
        ],
      },
      {
        title: 'Agriculture maraîchère et élevage',
        rules: [
          'L\'agriculture maraîchère à petite échelle (jardins potagers) est encouragée sur les lots dans le respect de l\'emprise au sol et des normes d\'assainissement.',
          'L\'utilisation de pesticides et d\'engrais chimiques doit être conforme aux recommandations du Ministère de l\'Agriculture et du Développement Rural (MINADER).',
          'L\'élevage d\'animaux de basse-cour (poules, lapins) à des fins familiales est autorisé sous réserve d\'un nombre limité (moins de 20 têtes) et de conditions d\'hygiène satisfaisantes.',
          'L\'élevage de bétail (bovins, ovins, caprins) est strictement interdit à l\'intérieur du périmètre résidentiel du village.',
          'Les cultures maraîchères ne doivent pas utiliser l\'eau du réseau d\'assainissement, même traitée, pour l\'irrigation des plantes comestibles.',
          'Le Comité de gestion peut organiser des formations et des démonstrations d\'agriculture urbaine durable pour les résidents intéressés.',
        ],
      },
      {
        title: 'Interdictions commerciales',
        rules: [
          'Sont interdites au sein du village : la vente d\'alcool non enregistré (sodabi, bière artisanale sans licence), la vente de produits illicites ou contrefaits, et les activités liées au jeu clandestin.',
          'Les activités de transformation industrielle (fabriques, ateliers de mécanique lourde, briqueteries) sont interdites à l\'intérieur du périmètre résidentiel du village.',
          'Le commerce ambulant itinérant (vendeurs à domicile non autorisés, colporteurs) est soumis à autorisation préalable du Comité de gestion.',
          'Les activités générant des nuisances sonores, olfactives ou environnementales excessives (abattoirs, tanneries, fonderies) sont formellement interdites dans le village.',
          'Tout manquement aux dispositions du présent article entraîne la révocation immédiate de l\'autorisation d\'exercer une activité au sein du village.',
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
      {
        title: 'Célébrations et cérémonies coutumières',
        rules: [
          'Les cérémonies coutumières (mariages traditionnels, funérailles, rites initiatiques) peuvent se dérouler dans le village dans le respect des lois camerounaises et du présent règlement.',
          'Les cérémonies funéraires doivent être déclarées au Comité de gestion dans les 24 heures suivant le décès. Le Comité facilite la logistique et la circulation pendant la cérémonie.',
          'Les manifestations culturelles collectives (fêtes de village, journées culturelles, festivals) sont organisées par le Comité de gestion en concertation avec les résidents.',
          'L\'utilisation d\'instruments de musique traditionnels (tam-tams, cors) est autorisée lors de cérémonies coutumières, dans le respect des horaires de tranquillité nocturne.',
          'Les défilés, processions et marches à caractère coutumier ou religieux doivent emprunter les itinéraires définis par le Comité de gestion et ne pas entraver la circulation.',
        ],
      },
      {
        title: 'Médiation de voisinage',
        rules: [
          'Le Comité de gestion désigne, parmi ses membres ou des résidents volontaires formés, des médiateurs de voisinage chargés de faciliter la résolution des conflits.',
          'Tout résident peut solliciter l\'intervention d\'un médiateur en cas de conflit avec un voisin, sans frais et de manière confidentielle.',
          'La médiation est un préalable obligatoire à toute procédure contentieuse entre résidents, sauf en cas d\'urgence ou de danger grave.',
          'Les médiateurs rendent compte de leurs interventions au Comité de gestion de manière anonymisée, dans le respect de la vie privée des parties.',
        ],
      },
    ],
  },
  {
    id: 'solidarite',
    title: 'Accessibilité et Solidarité',
    icon: <Heart className="h-6 w-6" />,
    color: 'text-rose-600 dark:text-rose-400',
    bgColor: 'bg-rose-50 dark:bg-rose-950/30',
    borderColor: 'border-l-rose-500',
    articles: [
      {
        title: 'Personnes à mobilité réduite',
        rules: [
          'Les constructions neuves doivent respecter les normes d\'accessibilité pour les personnes à mobilité réduite (PMR) : seuils de porte adaptés, rampes d\'accès, sanitaires accessibles, largeur de circulation minimale de 90 cm.',
          'Les espaces publics et communs du village (voies, trottoirs, aires de jeux, installations sportives) doivent être aménagés pour permettre l\'accès et la circulation des PMR.',
          'Les places de stationnement réservées aux PMR doivent être signalées et situées à proximité des accès principaux des lots et des espaces communs.',
          'Le Comité de gestion veillera à la prise en compte des besoins spécifiques des personnes âgées et des PMR lors de l\'aménagement des infrastructures collectives.',
          'Toute discrimination fondée sur le handicap ou l\'état de santé est formellement interdite et passible de sanctions.',
        ],
      },
      {
        title: 'Aide sociale et solidarité',
        rules: [
          'Le village KAMI-EXTENSION encourage la solidarité entre résidents. Le Comité de gestion peut créer un fonds de solidarité pour venir en aide aux résidents en situation de difficulté.',
          'Les résidents confrontés à des difficultés financières temporaires peuvent solliciter un étalement de paiement de leurs cotisations, sur décision du Comité de gestion.',
          'Le Comité de gestion organise des actions de solidarité en faveur des résidents sinistrés, malades ou en situation de précarité, notamment lors des périodes de soudure.',
          'Les résidents sont encouragés à participer aux œuvres caritatives et aux initiatives communautaires de soutien aux plus démunis.',
          'Le Comité de gestion peut conclure des partenariats avec des ONG, des associations caritatives et des institutions publiques pour renforcer l\'aide sociale dans le village.',
        ],
      },
      {
        title: 'Associations et groupements',
        rules: [
          'Les associations de résidents (groupements de femmes, associations de jeunes, tontines, coopératives) sont encouragées et doivent se faire enregistrer auprès du Comité de gestion.',
          'Le Comité de gestion met à disposition des associations enregistrées les espaces communs pour la tenue de leurs réunions et activités, sous réserve de disponibilité.',
          'Les tontines et systèmes d\'épargne rotative sont autorisés dans le village. Le Comité de gestion n\'intervient pas dans leur fonctionnement interne mais encourage la transparence.',
          'Les associations de résidents peuvent élire des représentants qui siègent avec voix consultative aux réunions du Comité de gestion.',
          'Les associations sont tenues de communiquer annuellement au Comité de gestion un rapport d\'activités et un bilan financier de leurs opérations.',
          'Toute association dont les activités portent atteinte à l\'ordre public ou aux droits d\'autrui se verra retirer son agrément par le Comité de gestion.',
        ],
      },
    ],
  },
  {
    id: 'locataires',
    title: 'Droits et Devoirs des Locataires',
    icon: <Users className="h-6 w-6" />,
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-l-amber-500',
    articles: [
      {
        title: 'Conditions de location',
        rules: [
          'La mise en location d\'un lot ou d\'une habitation au sein du village est soumise à l\'autorisation préalable du Comité de gestion.',
          'Le propriétaire bailleur doit communiquer au Comité de gestion l\'identité du locataire, la durée du bail et le montant du loyer dans un délai de 15 jours après la signature du contrat.',
          'Le locataire doit prendre connaissance du présent règlement intérieur et s\'engager à le respecter. Sa signature du bail de location vaut acceptation du règlement.',
          'Le contrat de location doit inclure une clause référençant le présent règlement intérieur et rappelant l\'obligation de conformité aux règles de vie commune du village.',
          'Le propriétaire reste solidairement responsable du respect du présent règlement par son locataire, notamment en matière de cotisations, de propreté et de nuisances.',
        ],
      },
      {
        title: 'Obligations du locataire',
        rules: [
          'Le locataire est tenu de payer son loyer aux termes convenus dans le contrat de location et de s\'acquitter des charges locatives qui lui incombent.',
          'Le locataire doit maintenir les lieux loués en bon état de propreté et d\'entretien, et effectuer les réparations locatives définies par la loi camerounaise.',
          'Le locataire ne doit en aucun cas procéder à des modifications de la construction, de la clôture ou de l\'aménagement du lot sans l\'accord exprès du propriétaire et du Comité de gestion.',
          'Le locataire doit respecter les règles de tranquillité, de voisinage et de sécurité prévues par le présent règlement, sous peine de résiliation de son bail.',
          'Le locataire est tenu de reverser au propriétaire ou directement au Comité de gestion la quote-part de cotisation prévue dans son contrat de location.',
        ],
      },
      {
        title: 'Droits du locataire',
        rules: [
          'Le locataire bénéficie des mêmes droits d\'usage des espaces communs que les propriétaires occupants, dans le respect du présent règlement.',
          'Le locataire a le droit de recevoir de la part du propriétaire un logement décent, conforme aux normes de sécurité, de salubrité et d\'habitabilité.',
          'Le locataire peut participer aux assemblées générales du village avec voix consultative, sur invitation du Comité de gestion.',
          'Le locataire a le droit de former des réclamations auprès du Comité de gestion en cas de manquement du propriétaire à ses obligations (carences d\'entretien, défauts de sécurité).',
          'Le locataire a le droit d\'être informé de toute décision du Comité de gestion affectant directement ses conditions de logement ou d\'occupation.',
        ],
      },
      {
        title: 'Résiliation et fin de bail',
        rules: [
          'La résiliation du bail par le propriétaire doit respecter le préavis légal fixé par la législation camerounaise, sauf clause résolutoire pour manquement du locataire.',
          'En cas de non-respect du présent règlement par le locataire, le Comité de gestion peut adresser une mise en demeure au locataire et, en cas de persistance, requérir du propriétaire la résiliation du bail.',
          'Le locataire doit restituer les lieux dans l\'état initial, sous réserve de la vétusté normale. Un état des lieux contradictoire est établi à l\'entrée et à la sortie.',
          'Le propriétaire doit signaler le départ de son locataire au Comité de gestion dans les 48 heures suivant la fin du bail.',
          'En cas de litige locatif, les parties sont invitées à recourir à la procédure de médiation prévue par le présent règlement avant toute action judiciaire.',
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
      {
        title: 'Moyens de paiement',
        rules: [
          'Les cotisations, amendes et redevances peuvent être réglées par virement bancaire, Mobile Money (MTN Mobile Money, Orange Money, Moov Money), chèque ou espèces.',
          'Le Comité de gestion émet des reçus officiels pour tout paiement effectué, qui tiennent lieu de quitus de paiement.',
          'Les paiements par Mobile Money doivent être effectués sur le numéro de téléphone officiel du Comité de gestion, communiqué via la plateforme KAMI-EXTENSION.',
          'Le Comité de gestion peut proposer des facilités de paiement échelonné aux propriétaires en difficulté financière temporaire, sur demande motivée et après examen du dossier.',
          'Les cotisations annuelles sont dues au plus tard le 31 janvier de chaque année. Au-delà de cette date, les pénalités de retard s\'appliquent automatiquement.',
        ],
      },
      {
        title: 'Transparence et contrôle financier',
        rules: [
          'Le Comité de gestion tient une comptabilité rigoureuse de toutes les recettes et dépenses du village, vérifiable à tout moment par tout propriétaire en faisant la demande.',
          'Un commissaire aux comptes (bénévole ou professionnel) peut être désigné par l\'assemblée générale pour contrôler la gestion financière du Comité.',
          'Le rapport financier annuel doit être présenté lors de l\'assemblée générale et comprendre : le bilan, le compte de résultat, l\'état des encaissements et des restes à recouvrer.',
          'Toute dépense supérieure à un montant fixé par l\'assemblée générale doit être approuvée par vote en assemblée ou par délégation du Comité de gestion.',
          'Les fonds du village sont déposés sur un compte bancaire ouvert au nom du village KAMI-EXTENSION. Les retraits nécessitent la signature conjointe d\'au moins deux membres du bureau du Comité.',
        ],
      },
    ],
  },
  {
    id: 'autorites',
    title: 'Relations avec les Autorités Publiques',
    icon: <Building2 className="h-6 w-6" />,
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-50 dark:bg-gray-950/30',
    borderColor: 'border-l-gray-500',
    articles: [
      {
        title: 'Conformité légale',
        rules: [
          'Le village KAMI-EXTENSION et l\'ensemble de ses occupants doivent se conformer aux lois et règlements en vigueur de la République du Cameroun, y compris le Code de l\'Urbanisme, le Code de l\'Environnement et le Code pénal.',
          'Le Comité de gestion veille au respect des obligations légales incombant au village et informe les résidents de toute nouvelle législation ou réglementation applicable.',
          'Les propriétaires doivent obtenir les autorisations de construire (permis de construire) délivrées par les services municipaux compétents avant tout démarrage de travaux.',
          'Le Comité de gestion entretient des relations régulières avec la mairie, la sous-préfecture, les services de l\'urbanisme et les autres autorités administratives concernées.',
          'Tout propriétaire doit se conformer aux obligations déclaratives et fiscales liées à la propriété foncière au Cameroun (titre foncier, impôt foncier, taxe d\'habitation).',
        ],
      },
      {
        title: 'Impôts et taxes',
        rules: [
          'Chaque propriétaire est personnellement responsable de l\'acquittement de ses impôts et taxes (impôt foncier, taxe d\'encombrement, patente pour les activités commerciales).',
          'Le Comité de gestion n\'est en aucun cas responsable du non-paiement par un propriétaire de ses obligations fiscales envers l\'État.',
          'Le Comité de gestion peut, à la demande d\'un propriétaire, fournir une attestation de propriété ou de résidence utile aux démarches fiscales.',
          'Les résidents exerçant une activité économique au sein du village doivent être en règle avec l\'administration fiscale et fournir leur attestation de patente au Comité de gestion.',
          'En cas de contentieux fiscal, le propriétaire concerné doit en informer le Comité de gestion, qui pourra l\'orienter vers les services compétents ou les professionnels agréés.',
        ],
      },
      {
        title: 'Droits de passage et servitudes',
        rules: [
          'Les droits de passage existants sur le périmètre du village (lignes électriques haute tension, canalisations d\'eau, gazoducs, voies ferrées) sont respectés et maintenus.',
          'Aucune construction ne doit être édifiée sous ou sur les servitudes publiques (emprise des routes, réseaux ENEO, Camwater, câbles fibre optique) sans l\'accord des concessionnaires.',
          'Le Comité de gestion représente les intérêts collectifs du village lors des procédures d\'expropriation, d\'occupation temporaire ou de modification de tracé des servitudes.',
          'Les résidents doivent permettre l\'accès aux agents des services publics (ENEO, Camwater, Camtel, CREDO) pour l\'entretien des réseaux traversant leur lot, sous réserve d\'un préavis raisonnable.',
        ],
      },
      {
        title: 'Urbanisme municipal',
        rules: [
          'Le village KAMI-EXTENSION est soumis au Plan d\'Urbanisme de la commune d\'implantation. Tout aménagement doit être compatible avec les orientations du Schéma Directeur d\'Aménagement et d\'Urbanisme (SDAU).',
          'Le Comité de gestion participe aux consultations publiques organisées par la mairie sur les projets d\'aménagement affectant le village ou son environnement.',
          'Les modifications du plan de lotissement du village doivent être approuvées par les services de l\'urbanisme municipal et faire l\'objet d\'une mise à jour cadastrale.',
          'Le Comité de gestion adresse annuellement au maire un rapport sur l\'état du village, les travaux réalisés et les projets en cours, afin de maintenir une coordination étroite avec les autorités municipales.',
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
      {
        title: 'Recours et appel',
        rules: [
          'Tout contrevenant dispose d\'un délai de 30 jours à compter de la notification de la sanction pour exercer un recours auprès du Comité de gestion.',
          'Le recours doit être formulé par écrit, avec indication des motifs de contestation et des pièces justificatives éventuelles.',
          'Le Comité de gestion statue sur le recours dans un délai de 30 jours. En cas de confirmation de la sanction, le contrevenant peut saisir la commission de médiation et d\'arbitrage.',
          'L\'exécution de la sanction est suspendue pendant la durée de l\'examen du recours, sauf en cas d\'urgence liée à la sécurité publique.',
          'Les décisions définitives du Comité de gestion sont exécutoires et peuvent, le cas échéant, être portées devant les tribunaux compétents.',
        ],
      },
      {
        title: 'Sanctions particulières',
        rules: [
          'En cas de construction sans autorisation, le Comité de gestion peut ordonner l\'interruption immédiate des travaux et, le cas échéant, la démolition aux frais du propriétaire.',
          'En cas de nuisance sonore ou olfactive persistante, le Comité de gestion peut imposer la fermeture temporaire de l\'installation à l\'origine de la nuisance.',
          'En cas de non-paiement des cotisations pendant plus de 12 mois consécutifs, le Comité de gestion peut saisir la juridiction compétente pour le recouvrement forcé.',
          'Les sanctions disciplinaires peuvent aller jusqu\'à l\'interdiction temporaire ou définitive d\'accéder aux espaces communs du village.',
        ],
      },
    ],
  },
  {
    id: 'mediation',
    title: 'Médiation et Arbitrage',
    icon: <Gavel className="h-6 w-6" />,
    color: 'text-stone-600 dark:text-stone-400',
    bgColor: 'bg-stone-50 dark:bg-stone-950/30',
    borderColor: 'border-l-stone-500',
    articles: [
      {
        title: 'Procédure de médiation',
        rules: [
          'La médiation est le mode prioritaire de résolution des litiges entre résidents au sein du village KAMI-EXTENSION. Elle est gratuite, confidentielle et volontaire.',
          'Toute partie à un litige peut saisir le Comité de gestion d\'une demande de médiation, par écrit ou via la plateforme KAMI-EXTENSION.',
          'Le Comité de gestion désigne un médiateur dans un délai de 7 jours ouvrés. Le médiateur doit être indépendant des parties en cause et n\'avoir aucun intérêt dans l\'issue du litige.',
          'La médiation doit aboutir dans un délai de 30 jours à compter de la désignation du médiateur. Un accord trouvé entre les parties est consigné dans un procès-verbal signé.',
          'Les parties sont libres d\'interrompre la médiation à tout moment et de recourir aux voies de droit ordinaires.',
        ],
      },
      {
        title: 'Commission de conciliation',
        rules: [
          'Le Comité de gestion institue une commission de conciliation composée de trois membres élus parmi les résidents reconnus pour leur sagesse et leur expérience.',
          'La commission de conciliation intervient en cas d\'échec de la médiation ou lorsque le litige oppose un résident au Comité de gestion lui-même.',
          'La commission dispose d\'un délai de 45 jours pour rendre un avis motivé, qui n\'est pas contraignant mais fortement incitatif pour les parties.',
          'Les séances de la commission sont publiques, sauf demande de huis clos motivée par l\'une des parties.',
          'L\'avis de la commission est transmis par écrit aux parties et au Comité de gestion, avec recommandations sur les suites à donner.',
        ],
      },
      {
        title: 'Arbitrage',
        rules: [
          'Lorsque la médiation et la conciliation ont échoué, les parties peuvent convenir de recourir à l\'arbitrage pour trancher leur litige de manière définitive.',
          'L\'arbitre est désigné d\'un commun accord entre les parties, ou à défaut par le Comité de gestion sur proposition du Tribunal de Première Instance compétent.',
          'La sentence arbitrale est rendue dans un délai de 60 jours et a force obligatoire entre les parties, conformément à l\'acte uniforme de l\'OHADA portant organisation des procédures simplifiées de recouvrement et des voies d\'exécution.',
          'Les frais d\'arbitrage sont répartis entre les parties sauf décision contraire de l\'arbitre. Une provision peut être demandée avant le début de la procédure.',
        ],
      },
      {
        title: 'Recours judiciaire',
        rules: [
          'En dernier recours, toute partie insatisfaite de l\'issue de la médiation, de la conciliation ou de l\'arbitrage peut saisir la juridiction judiciaire compétente.',
          'Le tribunal compétent est celui du ressort du siège du village KAMI-EXTENSION, conformément aux règles de compétence territoriale en vigueur au Cameroun.',
          'Les décisions de justice sont communiquées au Comité de gestion et inscrites au registre des litiges du village.',
          'Le Comité de gestion peut, avec l\'accord des parties, proposer l\'assistance d\'un avocat commis d\'office pour les résidents en situation de vulnérabilité financière.',
          'Les frais de justice sont à la charge de la partie perdante, sauf décision contraire du tribunal. Le fonds de solidarité du village peut intervenir en cas de besoin.',
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
      {
        title: 'Bureau du Comité',
        rules: [
          'Le Comité de gestion élit en son sein un bureau composé d\'un président, d\'un vice-président, d\'un secrétaire et d\'un trésorier.',
          'Le président représente le Comité à l\'égard des tiers et des autorités. Il convoque les réunions et préside les assemblées générales.',
          'Le trésorier est responsable de la gestion financière du village : encaissement des cotisations, paiement des dépenses, tenue de la comptabilité et élaboration du rapport financier annuel.',
          'Le secrétaire est responsable de la rédaction des procès-verbaux, de la conservation des archives du village et de la communication avec les propriétaires.',
          'En cas de vacance d\'un poste du bureau, une élection partielle est organisée dans un délai de 30 jours.',
        ],
      },
      {
        title: 'Commissions spécialisées',
        rules: [
          'Le Comité de gestion peut créer des commissions spécialisées pour traiter de questions spécifiques : commission d\'urbanisme, commission environnement, commission sécurité, commission financière, commission sociale.',
          'Chaque commission est composée d\'au moins trois membres, dont au moins un membre du bureau du Comité.',
          'Les commissions rendent compte de leurs travaux au Comité de gestion lors de chaque session ordinaire.',
          'Les résidents intéressés peuvent proposer leur candidature pour intégrer une commission spécialisée, sous réserve de l\'approbation du Comité.',
          'Les commissions ont un rôle consultatif. Leurs recommandations sont soumises à l\'approbation du Comité de gestion pour être exécutées.',
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
      {
        title: 'Abrogation et textes antérieurs',
        rules: [
          'Le présent règlement intérieur abroge et remplace toute disposition antérieure relative au fonctionnement et à la vie commune du village KAMI-EXTENSION.',
          'Les actes, décisions et autorisations délivrés sous le régime du règlement antérieur demeurent valables jusqu\'à leur expiration naturelle, sauf incompatibilité avec le présent règlement.',
          'Les procédures en cours à la date d\'entrée en vigueur du présent règlement sont poursuivies conformément aux dispositions applicables au moment de leur initiation.',
        ],
      },
      {
        title: 'Adhésion et engagement',
        rules: [
          'L\'achat d\'un lot au sein du village KAMI-EXTENSION vaut adhésion pleine et entière au présent règlement intérieur et à ses éventuels avenants modificatifs.',
          'Chaque propriétaire s\'engage à respecter le présent règlement et à veiller à son respect par ses locataires, employés, prestataires et visiteurs.',
          'Le présent règlement constitue un engagement de vie commune qui prime sur les accords individuels entre propriétaires lorsqu\'ils sont contraires à l\'intérêt collectif.',
          'Tout propriétaire qui n\'accepte pas les dispositions du présent règlement dispose d\'un délai de 30 jours pour céder son lot avec l\'accord du Comité de gestion, sans pénalité.',
        ],
      },
      {
        title: 'Contacts et informations',
        rules: [
          'Le secrétariat du Comité de gestion est joignable via la plateforme en ligne KAMI-EXTENSION, par courriel et par téléphone, aux coordonnées communiquées lors de l\'acquisition du lot.',
          'Le Comité de gestion tient un registre des propriétaires et résidents à jour, consultable sur demande auprès du secrétariat.',
          'Toute modification des coordonnées d\'un propriétaire ou résident doit être communiquée au Comité de gestion dans un délai de 15 jours.',
          'Le Comité de gestion publie régulièrement des informations sur la vie du village via la plateforme, les panneaux d\'affichage communs et, le cas échéant, par message SMS ou WhatsApp groupé.',
        ],
      },
    ],
  },
];

export function getDefaultRegulationText() {
  return rulesData
    .flatMap((section) => section.articles.flatMap((article) => [article.title, ...article.rules]))
    .join('\n\n');
}

function getRuleSummary(rules: string[]) {
  const summary = rules[0]?.trim() || 'Consultez les dispositions de cet article.';
  return summary.length > 180 ? `${summary.slice(0, 177).trimEnd()}...` : summary;
}

export function RegulationRulesScreen({ setCurrentScreen, onHome }: RegulationRulesScreenProps) {
  const [customRegulation, setCustomRegulation] = useState('');

  useEffect(() => {
    fetch('/api/sav-settings')
      .then((response) => response.json())
      .then((data) => setCustomRegulation(data.savReglement || ''))
      .catch(() => {});
  }, []);

  const displayedRulesData: RulesSection[] = customRegulation.trim()
    ? [{
        id: 'custom-regulation',
        title: 'Règlement intérieur',
        icon: <BookOpen className="h-6 w-6" />,
        color: 'text-brand-blue',
        bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        borderColor: 'border-l-brand-blue',
        articles: [{
          title: 'Dispositions en vigueur',
          rules: customRegulation.trim().split(/\n\s*\n/).filter(Boolean),
        }],
      }]
    : rulesData;

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [expandedArticles, setExpandedArticles] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  // Expand the first available section, including a loaded custom document.
  useEffect(() => {
    if (displayedRulesData.length > 0) {
      setExpandedSections(
        Object.fromEntries(displayedRulesData.map((section) => [section.id, true]))
      );
    }
  }, [customRegulation]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const toggleArticle = (articleKey: string) => {
    setExpandedArticles((prev) => ({ ...prev, [articleKey]: !prev[articleKey] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    displayedRulesData.forEach((s) => {
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
    ? displayedRulesData.map((section) => ({
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
    : displayedRulesData;

  const totalArticles = displayedRulesData.reduce((sum, s) => sum + s.articles.length, 0);
  const totalRules = displayedRulesData.reduce(
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
          {onHome && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onHome}
            >
              <Home className="h-5 w-5 text-muted-foreground" />
            </Button>
          )}
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
                      const isExpanded = expandedArticles[articleKey] === true;

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
                              <span className="block">{article.title}</span>
                              {!isExpanded && (
                                <span className="block text-xs font-normal text-muted-foreground mt-1 line-clamp-2">
                                  {getRuleSummary(article.rules)}
                                </span>
                              )}
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
