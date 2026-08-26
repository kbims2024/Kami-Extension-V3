import mongoose, { Schema, Document } from 'mongoose';

export interface ISettingsDocument extends Document {
  id: string;
  heroBackground?: string;
  savPhone?: string;
  savWhatsapp?: string;
  savEmail?: string;
  savHoraires?: string;
  savFaq?: string;
  savReglement?: string;
  paymentMoovNumber?: string;
  paymentOrangeNumber?: string;
  paymentMtnNumber?: string;
  paymentWaveNumber?: string;
  cglPermissions?: Record<string, boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const SettingsSchema = new Schema<any>(
  {
    _id: { type: String, default: 'settings-default' },
    heroBackground: { type: String, default: null },
    savPhone: { type: String, default: '+225 27 22 49 00 00' },
    savWhatsapp: { type: String, default: '+225 07 58 42 10 00' },
    savEmail: { type: String, default: 'sav@kami-extension.com' },
    savHoraires: {
      type: String,
      default: JSON.stringify([
        { day: 'Lundi - Vendredi', hours: '08h00 - 18h00' },
        { day: 'Samedi', hours: '09h00 - 13h00' },
        { day: 'Dimanche & jours fériés', hours: 'Fermé' },
      ]),
    },
    savFaq: {
      type: String,
      default: JSON.stringify([
        {
          question: 'Comment suivre l\'avancée de mon paiement ?',
          answer: 'Connectez-vous à votre espace client pour voir l\'historique complet de vos versements et le solde restant. Vous pouvez aussi contacter notre SAV par téléphone ou WhatsApp.',
        },
        {
          question: 'Comment obtenir mon reçu de paiement ?',
          answer: 'Les reçus sont disponibles dans la section « Documents & attestations » de votre espace client. Vous pouvez les télécharger en PDF ou demander une copie physique au bureau.',
        },
        {
          question: 'Quand recevrai-je mes documents de propriété ?',
          answer: 'Après le paiement intégral du lot, les documents sont préparés sous 15 à 30 jours. Vous serez notifié par message dès qu\'ils seront disponibles au retrait.',
        },
        {
          question: 'Que faire si j\'ai un litige ou une réclamation ?',
          answer: 'Adressez votre réclamation par email au service après-vente ou via WhatsApp. Un conseiller vous recontactera sous 48h ouvrées avec un accusé de réception et un numéro de ticket.',
        },
      ]),
    },
    savReglement: { type: String, default: null },
    paymentMoovNumber: { type: String, default: '0140916502' },
    paymentOrangeNumber: { type: String, default: '0749615456' },
    paymentMtnNumber: { type: String, default: '0505623221' },
    paymentWaveNumber: { type: String, default: '0140252521' },
    cglPermissions: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

SettingsSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret) => {
    ret.id = String(ret._id);
    delete (ret as any)._id;
    return ret;
  },
});

export const Settings = mongoose.models.Settings || mongoose.model<ISettingsDocument>('Settings', SettingsSchema);