/**
 * Local JSON-file-based database.
 * Drop-in replacement for MongoDB/Mongoose — same Prisma-like API.
 * 
 * Data persists to db/test-data.json so it survives HMR.
 * For production deployment on Vercel, swap back to the Mongoose version.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

// ─── Types ───

type PrismaWhere = Record<string, any>;
type PrismaOrderBy = Record<string, 'asc' | 'desc'>;
type PrismaInclude = Record<string, any>;
type PrismaSelect = Record<string, boolean>;

interface QueryOptions {
  where?: PrismaWhere;
  orderBy?: PrismaOrderBy;
  include?: PrismaInclude;
  select?: PrismaSelect;
  skip?: number;
  take?: number;
}

interface CreateArgs {
  data: Record<string, any>;
}

interface UpdateArgs {
  where: Record<string, string>;
  data: Record<string, any>;
  select?: PrismaSelect;
}

interface DeleteArgs {
  where: Record<string, string>;
}

// ─── Storage ───

const DB_DIR = join(process.cwd(), 'db');
const DB_FILE = join(DB_DIR, 'test-data.json');

// Default seed data
const DEFAULT_DATA: Record<string, any[]> = {
  user: [],
  lot: [],
  reservation: [],
  payment: [],
  message: [],
  settings: [{
    id: 'settings-default',
    heroBackground: null,
    savPhone: '+225 27 22 49 00 00',
    savWhatsapp: '+225 07 58 42 10 00',
    savEmail: 'sav@kami-extension.com',
    savHoraires: JSON.stringify([
      { day: 'Lundi - Vendredi', hours: '08h00 - 18h00' },
      { day: 'Samedi', hours: '09h00 - 13h00' },
      { day: 'Dimanche & jours fériés', hours: 'Fermé' },
    ]),
    savFaq: JSON.stringify([
      {
        question: "Comment suivre l'avancée de mon paiement ?",
        answer: "Connectez-vous à votre espace client pour voir l'historique complet de vos versements et le solde restant. Vous pouvez aussi contacter notre SAV par téléphone ou WhatsApp.",
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }],
  logo: [],
  adminFile: [],
  notification: [],
  progressUpdate: [],
  expertApplication: [],
  uploadedFile: [],
};

// In-memory store
let store: Record<string, any[]> | null = null;

function loadStore(): Record<string, any[]> {
  if (store) return store;
  if (existsSync(DB_FILE)) {
    try {
      store = JSON.parse(readFileSync(DB_FILE, 'utf-8'));
    } catch {
      store = { ...DEFAULT_DATA };
    }
  } else {
    store = { ...DEFAULT_DATA };
  }
  return store!;
}

function saveStore() {
  if (!existsSync(DB_DIR)) {
    mkdirSync(DB_DIR, { recursive: true });
  }
  writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

function ensureCollection(name: string): any[] {
  const s = loadStore();
  if (!Array.isArray(s[name])) s[name] = [];
  return s[name];
}

// ─── Helpers ───

function genId(): string {
  return randomUUID();
}

function matchesWhere(doc: Record<string, any>, where: PrismaWhere): boolean {
  for (const [key, val] of Object.entries(where)) {
    if (val === undefined || val === null) continue;

    // { in: [...] }
    if (typeof val === 'object' && !Array.isArray(val) && 'in' in val) {
      if (!val.in.includes(doc[key])) return false;
    }
    // { not: ... }
    else if (typeof val === 'object' && !Array.isArray(val) && 'not' in val) {
      if (doc[key] === val.not) return false;
    }
    // { gte: ..., lte: ..., gt: ..., lt: ... }
    else if (typeof val === 'object' && !Array.isArray(val)) {
      for (const [op, opVal] of Object.entries(val)) {
        if (op === 'gte' && doc[key] < opVal) return false;
        if (op === 'lte' && doc[key] > opVal) return false;
        if (op === 'gt' && doc[key] <= opVal) return false;
        if (op === 'lt' && doc[key] >= opVal) return false;
      }
    }
    // plain value
    else {
      if (doc[key] !== val) return false;
    }
  }
  return true;
}

function applySort(docs: any[], orderBy?: PrismaOrderBy): any[] {
  if (!orderBy) return docs;
  const sorted = [...docs];
  for (const [key, dir] of Object.entries(orderBy)) {
    sorted.sort((a, b) => {
      const va = a[key];
      const vb = b[key];
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (va < vb) return dir === 'asc' ? -1 : 1;
      if (va > vb) return dir === 'asc' ? 1 : -1;
      return 0;
    });
  }
  return sorted;
}

function applySelect(doc: Record<string, any>, select?: PrismaSelect): Record<string, any> {
  if (!select) return doc;
  const result: Record<string, any> = {};
  for (const [k, v] of Object.entries(select)) {
    if (v) result[k] = doc[k];
  }
  return result;
}

function stripInternal(doc: Record<string, any>): Record<string, any> {
  const { _id, __v, ...rest } = doc;
  return rest;
}

// ─── Include / populate logic ───

async function applyIncludes(docs: any[], include?: PrismaInclude): Promise<any[]> {
  if (!include) return docs;
  return Promise.all(
    docs.map(async (doc) => {
      const result = { ...doc };
      for (const [relation, options] of Object.entries(include)) {
        if (relation === 'user') {
          const userId = doc.userId || doc.senderId;
          if (!userId) continue;
          const users = ensureCollection('user');
          let user = users.find((u: any) => u.id === userId);
          if (!user && typeof userId === 'string') {
            user = users.find((u: any) => u._id === userId);
          }
          if (user) {
            user = stripInternal({ ...user });
            if (options?.select) user = applySelect(user, options.select);
            result.user = user;
          }
        }
        if (relation === 'lot') {
          const lotId = doc.lotId;
          if (!lotId) continue;
          const lots = ensureCollection('lot');
          let lot = lots.find((l: any) => l.id === lotId);
          if (lot) {
            lot = stripInternal({ ...lot });
            if (options?.select) lot = applySelect(lot, options.select);
            result.lot = lot;
          }
        }
        if (relation === 'payments') {
          const payments = ensureCollection('payment').filter((p: any) => p.userId === doc.id);
          result.payments = payments.map(stripInternal);
        }
        if (relation === 'reservations') {
          const reservations = ensureCollection('reservation').filter((r: any) => r.userId === doc.id);
          result.reservations = reservations.map(stripInternal);
        }
        if (relation === 'sender') {
          const senders = ensureCollection('user');
          let sender = senders.find((u: any) => u.id === doc.senderId);
          if (sender) {
            sender = stripInternal({ ...sender });
            result.sender = sender;
          }
        }
        if (relation === 'receiver') {
          const receivers = ensureCollection('user');
          let receiver = receivers.find((u: any) => u.id === doc.receiverId);
          if (receiver) {
            receiver = stripInternal({ ...receiver });
            result.receiver = receiver;
          }
        }
      }
      return result;
    })
  );
}

// ─── Model wrapper ───

function createModelWrapper(collectionName: string) {
  return {
    findUnique: async (args: { where: Record<string, string>; include?: PrismaInclude; select?: PrismaSelect }): Promise<any | null> => {
      const col = ensureCollection(collectionName);
      const { where } = args;
      let doc: any = null;

      if (where.id) {
        doc = col.find((d: any) => d.id === where.id);
      } else if (where.pseudo) {
        doc = col.find((d: any) => d.pseudo === where.pseudo);
      } else if (where.phone) {
        doc = col.find((d: any) => d.phone === where.phone);
      } else if (where.email) {
        doc = col.find((d: any) => d.email === where.email);
      } else if (where.referralCode) {
        doc = col.find((d: any) => d.referralCode === where.referralCode);
      } else if (where.type) {
        doc = col.find((d: any) => d.type === where.type);
      } else if (where.resetToken) {
        doc = col.find((d: any) => d.resetToken === where.resetToken);
      } else {
        // Try matching on all keys
        const keys = Object.keys(where);
        if (keys.length > 0) {
          doc = col.find((d: any) => matchesWhere(d, where));
        }
      }

      if (!doc) return null;
      doc = stripInternal({ ...doc });
      if (args.select) doc = applySelect(doc, args.select);

      if (args.include) {
        const populated = await applyIncludes([doc], args.include);
        return populated[0] || null;
      }

      return doc;
    },

    findFirst: async (args?: QueryOptions): Promise<any | null> => {
      const col = ensureCollection(collectionName);
      let results = col.filter((d: any) => args?.where ? matchesWhere(d, args.where) : true);
      results = applySort(results, args?.orderBy);
      if (args?.skip) results = results.slice(args.skip);
      if (args?.take) results = results.slice(0, args.take);

      if (results.length === 0) return null;
      let doc = stripInternal({ ...results[0] });
      if (args?.select) doc = applySelect(doc, args.select);

      if (args?.include) {
        const populated = await applyIncludes([doc], args.include);
        return populated[0] || null;
      }

      return doc;
    },

    findMany: async (args?: QueryOptions): Promise<any[]> => {
      const col = ensureCollection(collectionName);
      let results = col.filter((d: any) => args?.where ? matchesWhere(d, args.where) : true);
      results = applySort(results, args?.orderBy);
      if (args?.skip) results = results.slice(args.skip);
      if (args?.take) results = results.slice(0, args.take);

      let docs = results.map((d: any) => {
        const doc = stripInternal({ ...d });
        return args?.select ? applySelect(doc, args.select) : doc;
      });

      if (args?.include) {
        docs = await applyIncludes(docs, args.include);
      }

      return docs;
    },

    create: async (args: CreateArgs): Promise<any> => {
      const col = ensureCollection(collectionName);
      const { data } = args;
      const now = new Date().toISOString();
      const doc: Record<string, any> = {
        ...data,
        id: genId(),
        createdAt: data.createdAt || now,
        updatedAt: data.updatedAt || now,
      };
      // Remove undefined/null values (like Mongoose sparse)
      for (const key of Object.keys(doc)) {
        if (doc[key] === undefined) delete doc[key];
      }
      col.push(doc);
      saveStore();
      return stripInternal({ ...doc });
    },

    update: async (args: UpdateArgs): Promise<any> => {
      const col = ensureCollection(collectionName);
      const { where, data, select } = args;
      const now = new Date().toISOString();

      let idx = -1;
      if (where.id) {
        idx = col.findIndex((d: any) => d.id === where.id);
      } else {
        idx = col.findIndex((d: any) => matchesWhere(d, where));
      }

      if (idx === -1) {
        // Return a minimal object to not crash callers
        const notFound: Record<string, any> = { id: where.id || 'unknown', ...data, updatedAt: now };
        return stripInternal(notFound);
      }

      const updateData = { ...data, updatedAt: now };
      // Handle null = delete field
      for (const [k, v] of Object.entries(updateData)) {
        if (v === null || v === undefined) {
          delete col[idx][k];
        } else {
          col[idx][k] = v;
        }
      }

      saveStore();
      let doc = stripInternal({ ...col[idx] });
      if (select) doc = applySelect(doc, select);
      return doc;
    },

    updateMany: async (args: { where?: Record<string, any>; data: Record<string, any> }): Promise<{ count: number }> => {
      const col = ensureCollection(collectionName);
      const { where, data } = args;
      const now = new Date().toISOString();

      let count = 0;
      for (const doc of col) {
        if (!where || matchesWhere(doc, where)) {
          for (const [k, v] of Object.entries(data)) {
            if (v === null || v === undefined) {
              delete doc[k];
            } else {
              doc[k] = v;
            }
          }
          doc.updatedAt = now;
          count++;
        }
      }

      if (count > 0) saveStore();
      return { count };
    },

    delete: async (args: DeleteArgs): Promise<any> => {
      const col = ensureCollection(collectionName);
      let idx = -1;
      if (args.where.id) {
        idx = col.findIndex((d: any) => d.id === args.where.id);
      } else {
        idx = col.findIndex((d: any) => matchesWhere(d, args.where));
      }

      if (idx === -1) {
        return {} as any;
      }

      const removed = col.splice(idx, 1)[0];
      saveStore();
      return stripInternal({ ...removed });
    },

    deleteMany: async (args?: { where?: Record<string, any> }): Promise<{ count: number }> => {
      const col = ensureCollection(collectionName);
      const before = col.length;
      const after = col.filter((d: any) => !args?.where || !matchesWhere(d, args.where));
      const removed = before - after.length;
      // Replace in store
      const s = loadStore();
      s[collectionName] = after;
      if (removed > 0) saveStore();
      return { count: removed };
    },

    count: async (args?: { where?: Record<string, any> }): Promise<number> => {
      const col = ensureCollection(collectionName);
      if (!args?.where) return col.length;
      return col.filter((d: any) => matchesWhere(d, args.where)).length;
    },
  };
}

// ─── Export db object ───

export const db = {
  user: createModelWrapper('user'),
  lot: createModelWrapper('lot'),
  reservation: createModelWrapper('reservation'),
  payment: createModelWrapper('payment'),
  message: createModelWrapper('message'),
  settings: createModelWrapper('settings'),
  logo: createModelWrapper('logo'),
  adminFile: createModelWrapper('adminFile'),
  notification: createModelWrapper('notification'),
  progressUpdate: createModelWrapper('progressUpdate'),
  expertApplication: createModelWrapper('expertApplication'),
  uploadedFile: createModelWrapper('uploadedFile'),
};
