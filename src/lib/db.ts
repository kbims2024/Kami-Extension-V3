/**
 * MongoDB/Mongoose database wrapper for API routes.
 *
 * This file connects all `db` calls to MongoDB using Mongoose.
 */
import { connectDB } from './mongodb';
import { User } from './models/User';
import { Lot } from './models/Lot';
import { Reservation } from './models/Reservation';
import { Payment } from './models/Payment';
import { Message } from './models/Message';
import { Settings } from './models/Settings';
import { Logo } from './models/Logo';
import { AdminFile } from './models/AdminFile';
import { Notification } from './models/Notification';
import { ProgressUpdate } from './models/ProgressUpdate';
import { ExpertApplication } from './models/ExpertApplication';
import { UploadedFile } from './models/UploadedFile';
import { Model } from 'mongoose';

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
  where: Record<string, any>;
  data: Record<string, any>;
  select?: PrismaSelect;
}

interface DeleteArgs {
  where: Record<string, any>;
}

const operatorMap: Record<string, string> = {
  in: '$in',
  not: '$ne',
  gte: '$gte',
  lte: '$lte',
  gt: '$gt',
  lt: '$lt',
};

function buildQuery(where?: PrismaWhere): Record<string, any> {
  if (!where) return {};
  const query: Record<string, any> = {};

  for (const [key, value] of Object.entries(where)) {
    if (key === 'OR' && Array.isArray(value)) {
      query.$or = value.map((item) => buildQuery(item));
      continue;
    }

    if (key === 'id') {
      query._id = value;
      continue;
    }

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      query[key] = normalizeOperators(value);
      continue;
    }

    query[key] = value;
  }

  return query;
}

function normalizeOperators(value: Record<string, any>): Record<string, any> {
  const normalized: Record<string, any> = {};

  for (const [key, innerValue] of Object.entries(value)) {
    const operator = operatorMap[key] ?? key;
    normalized[operator] = innerValue;
  }

  return normalized;
}

function applySort(orderBy?: PrismaOrderBy): Record<string, 1 | -1> {
  if (!orderBy) return {};
  const sort: Record<string, 1 | -1> = {};
  for (const [field, direction] of Object.entries(orderBy)) {
    sort[field] = direction === 'asc' ? 1 : -1;
  }
  return sort;
}

function normalizeDoc(doc: Record<string, any>): Record<string, any> {
  if (!doc) return doc;
  const result: Record<string, any> = { ...doc };
  if (result._id !== undefined) {
    result.id = String(result._id);
    delete result._id;
  }
  delete result.__v;
  return result;
}

function applySelect(doc: Record<string, any>, select?: PrismaSelect): Record<string, any> {
  if (!select) return doc;
  const result: Record<string, any> = {};
  for (const [k, v] of Object.entries(select)) {
    if (v && Object.prototype.hasOwnProperty.call(doc, k)) {
      result[k] = doc[k];
    }
  }
  return result;
}

async function applyIncludes(docs: any[], include?: PrismaInclude): Promise<any[]> {
  if (!include) return docs;

  return Promise.all(
    docs.map(async (doc) => {
      const result = { ...doc };

      for (const [relation, options] of Object.entries(include)) {
        if (relation === 'user') {
          const userId = doc.userId || doc.senderId;
          if (!userId) continue;
          const user = await User.findOne(buildQuery({ id: userId })).lean();
          if (user) {
            let normalized = normalizeDoc(user);
            if (options?.select) normalized = applySelect(normalized, options.select);
            result.user = normalized;
          }
        }

        if (relation === 'lot') {
          const lotId = doc.lotId;
          if (!lotId) continue;
          const lot = await Lot.findOne(buildQuery({ id: lotId })).lean();
          if (lot) {
            let normalized = normalizeDoc(lot);
            if (options?.select) normalized = applySelect(normalized, options.select);
            result.lot = normalized;
          }
        }

        if (relation === 'payments') {
          const payments = await Payment.find({ userId: doc.id }).lean();
          result.payments = payments.map(normalizeDoc);
        }

        if (relation === 'reservations') {
          const reservations = await Reservation.find({ userId: doc.id }).lean();
          result.reservations = reservations.map(normalizeDoc);
        }

        if (relation === 'sender') {
          const sender = await User.findOne(buildQuery({ id: doc.senderId })).lean();
          if (sender) {
            result.sender = normalizeDoc(sender);
          }
        }

        if (relation === 'receiver') {
          const receiver = await User.findOne(buildQuery({ id: doc.receiverId })).lean();
          if (receiver) {
            result.receiver = normalizeDoc(receiver);
          }
        }
      }

      return result;
    })
  );
}

function createWrapper(model: Model<any>) {
  return {
    findUnique: async (args: { where: Record<string, any>; include?: PrismaInclude; select?: PrismaSelect }): Promise<any | null> => {
      await connectDB();
      const query = buildQuery(args.where);
      const doc = await model.findOne(query).lean();
      if (!doc) return null;
      let normalized = normalizeDoc(doc);
      if (args.select) normalized = applySelect(normalized, args.select);
      if (args.include) {
        const populated = await applyIncludes([normalized], args.include);
        return populated[0] || null;
      }
      return normalized;
    },

    findFirst: async (args?: QueryOptions): Promise<any | null> => {
      await connectDB();
      const query = buildQuery(args?.where);
      const cursor = model.find(query).sort(applySort(args?.orderBy));
      if (args?.skip) cursor.skip(args.skip);
      if (args?.take) cursor.limit(args.take ?? 1);
      const docs = await cursor.lean();
      if (docs.length === 0) return null;
      let doc = normalizeDoc(docs[0]);
      if (args?.select) doc = applySelect(doc, args.select);
      if (args?.include) {
        const populated = await applyIncludes([doc], args.include);
        return populated[0] || null;
      }
      return doc;
    },

    findMany: async (args?: QueryOptions): Promise<any[]> => {
      await connectDB();
      const query = buildQuery(args?.where);
      const cursor = model.find(query).sort(applySort(args?.orderBy));
      if (args?.skip) cursor.skip(args.skip);
      if (args?.take) cursor.limit(args.take);
      const docs = await cursor.lean();
      let results = docs.map(normalizeDoc);
      if (args?.select) results = results.map((doc) => applySelect(doc, args.select));
      if (args?.include) results = await applyIncludes(results, args.include);
      return results;
    },

    create: async (args: CreateArgs): Promise<any> => {
      await connectDB();
      const doc = await model.create(args.data);
      return normalizeDoc(doc.toObject({ virtuals: true }));
    },

    update: async (args: UpdateArgs): Promise<any> => {
      await connectDB();
      const query = buildQuery(args.where);
      const updateData: Record<string, any> = { ...args.data, updatedAt: new Date() };
      const setData: Record<string, any> = {};
      const unsetData: Record<string, any> = {};

      for (const [key, value] of Object.entries(updateData)) {
        if (value === null || value === undefined) {
          unsetData[key] = '';
        } else {
          setData[key] = value;
        }
      }

      const updateObject: Record<string, any> = {};
      if (Object.keys(setData).length > 0) updateObject.$set = setData;
      if (Object.keys(unsetData).length > 0) updateObject.$unset = unsetData;

      const doc = await model.findOneAndUpdate(query, updateObject, { new: true, lean: true });
      if (!doc) {
        const notFound: Record<string, any> = { id: args.where.id || 'unknown', ...args.data, updatedAt: new Date() };
        return normalizeDoc(notFound);
      }

      let normalized = normalizeDoc(doc);
      if (args.select) normalized = applySelect(normalized, args.select);
      return normalized;
    },

    updateMany: async (args?: { where?: Record<string, any>; data: Record<string, any> }): Promise<{ count: number }> => {
      await connectDB();
      const query = buildQuery(args?.where);
      const updateData: Record<string, any> = { ...args?.data, updatedAt: new Date() };
      const setData: Record<string, any> = {};
      const unsetData: Record<string, any> = {};

      for (const [key, value] of Object.entries(updateData)) {
        if (value === null || value === undefined) {
          unsetData[key] = '';
        } else {
          setData[key] = value;
        }
      }

      const updateObject: Record<string, any> = {};
      if (Object.keys(setData).length > 0) updateObject.$set = setData;
      if (Object.keys(unsetData).length > 0) updateObject.$unset = unsetData;

      const result = await model.updateMany(query, updateObject);
      return { count: result.modifiedCount ?? result.nModified ?? 0 };
    },

    delete: async (args: DeleteArgs): Promise<any> => {
      await connectDB();
      const query = buildQuery(args.where);
      const doc = await model.findOneAndDelete(query).lean();
      if (!doc) return {};
      return normalizeDoc(doc);
    },

    deleteMany: async (args?: { where?: Record<string, any> }): Promise<{ count: number }> => {
      await connectDB();
      const query = buildQuery(args?.where);
      const result = await model.deleteMany(query);
      return { count: result.deletedCount ?? 0 };
    },

    count: async (args?: { where?: Record<string, any> }): Promise<number> => {
      await connectDB();
      const query = buildQuery(args?.where);
      return model.countDocuments(query);
    },
  };
}

export const db = {
  user: createWrapper(User),
  lot: createWrapper(Lot),
  reservation: createWrapper(Reservation),
  payment: createWrapper(Payment),
  message: createWrapper(Message),
  settings: createWrapper(Settings),
  logo: createWrapper(Logo),
  adminFile: createWrapper(AdminFile),
  notification: createWrapper(Notification),
  progressUpdate: createWrapper(ProgressUpdate),
  expertApplication: createWrapper(ExpertApplication),
  uploadedFile: createWrapper(UploadedFile),
};
