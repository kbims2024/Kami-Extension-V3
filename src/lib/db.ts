/**
 * Drop-in replacement for Prisma db client using Mongoose.
 * Provides Prisma-like API (findUnique, findMany, create, update, delete, etc.)
 * so that existing route files need minimal changes.
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

// Helper: ensure DB connection before any operation
async function ensureConnection() {
  await connectDB();
}

// Helper: convert Mongoose doc to plain object with id
function toPlain<T>(doc: any): T | null {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  if (obj._id) {
    obj.id = obj._id.toString();
    delete obj._id;
  }
  if (obj.__v !== undefined) delete obj.__v;
  return obj as T;
}

function toPlainArray<T>(docs: any[]): T[] {
  return docs.map(d => toPlain<T>(d)!);
}

// ─── Helper: build Mongoose query from Prisma-like options ───

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

function buildSort(orderBy?: PrismaOrderBy): Record<string, 1 | -1> | undefined {
  if (!orderBy) return undefined;
  const sort: Record<string, 1 | -1> = {};
  for (const [key, val] of Object.entries(orderBy)) {
    sort[key] = val === 'desc' ? -1 : 1;
  }
  return sort;
}

function buildMongoWhere(where?: PrismaWhere): Record<string, any> {
  if (!where) return {};
  const mongoWhere: Record<string, any> = {};

  for (const [key, val] of Object.entries(where)) {
    if (val === undefined || val === null) continue;

    // Handle { in: [...] } syntax
    if (typeof val === 'object' && !Array.isArray(val) && 'in' in val) {
      mongoWhere[key] = { $in: val.in };
    }
    // Handle { not: ... } syntax
    else if (typeof val === 'object' && !Array.isArray(val) && 'not' in val) {
      mongoWhere[key] = { $ne: val.not };
    }
    // Handle plain values
    else {
      mongoWhere[key] = val;
    }
  }

  return mongoWhere;
}

// ─── Include/populate helpers for relations ───

interface PopulatedDoc extends Record<string, any> {
  id?: string;
  [key: string]: any;
}

async function applyIncludes<T extends PopulatedDoc>(
  docs: T[],
  include?: PrismaInclude,
  select?: PrismaSelect
): Promise<T[]> {
  if (!include) return docs;

  const populated = await Promise.all(
    docs.map(async (doc) => {
      const result = { ...doc };

      for (const [relation, options] of Object.entries(include)) {
        if (relation === 'user') {
          // Find user by userId or senderId/receiverId
          let userId = doc.userId || doc.senderId;
          if (!userId && relation === 'receiver') userId = doc.receiverId;
          if (!userId) continue;

          const userQuery = User.findById(userId);
          if (options?.select) {
            const fields: Record<string, number> = {};
            for (const [k, v] of Object.entries(options.select)) {
              fields[k] = v ? 1 : 0;
            }
            userQuery.select(fields);
          }
          const user = await userQuery.lean();
          result.user = user ? toPlain(user) : null;
          if (user) {
            result.user.id = user._id?.toString();
            delete result.user._id;
          }
        }
        if (relation === 'lot') {
          const lotId = doc.lotId;
          if (!lotId) continue;

          const lotQuery = Lot.findById(lotId);
          if (options?.select) {
            const fields: Record<string, number> = {};
            for (const [k, v] of Object.entries(options.select)) {
              fields[k] = v ? 1 : 0;
            }
            lotQuery.select(fields);
          }
          const lot = await lotQuery.lean();
          result.lot = lot ? toPlain(lot) : null;
          if (lot) {
            result.lot.id = lot._id?.toString();
            delete result.lot._id;
          }
        }
        if (relation === 'payments') {
          const payments = await Payment.find({ userId: doc.id || doc._id?.toString() }).lean();
          result.payments = toPlainArray(payments);
        }
        if (relation === 'reservations') {
          const reservations = await Reservation.find({ userId: doc.id || doc._id?.toString() }).lean();
          result.reservations = toPlainArray(reservations);
        }
        if (relation === 'sender') {
          const sender = await User.findById(doc.senderId).lean();
          result.sender = sender ? toPlain(sender) : null;
          if (sender) {
            result.sender.id = sender._id?.toString();
            delete result.sender._id;
          }
        }
        if (relation === 'receiver') {
          const receiver = await User.findById(doc.receiverId).lean();
          result.receiver = receiver ? toPlain(receiver) : null;
          if (receiver) {
            result.receiver.id = receiver._id?.toString();
            delete result.receiver._id;
          }
        }
      }

      return result as T;
    })
  );

  return populated;
}

// ─── Model wrapper helpers ───

function createModelWrapper<T extends PopulatedDoc>(model: any) {
  return {
    findUnique: async (args: { where: Record<string, string> }): Promise<T | null> => {
      await ensureConnection();
      const { where } = args;

      // Find by any unique field
      let doc: any = null;
      if (where.id) {
        doc = await model.findById(where.id).lean();
      } else if (where.phone) {
        doc = await model.findOne({ phone: where.phone }).lean();
      } else if (where.email) {
        doc = await model.findOne({ email: where.email }).lean();
      } else if (where.pseudo) {
        doc = await model.findOne({ pseudo: where.pseudo }).lean();
      } else {
        // Try other fields
        const keys = Object.keys(where);
        if (keys.length > 0) {
          doc = await model.findOne(where).lean();
        }
      }

      if (doc) {
        doc.id = doc._id?.toString();
        delete doc._id;
        if (doc.__v !== undefined) delete doc.__v;
      }

      // Apply includes if present
      if (doc && args.include) {
        const populated = await applyIncludes([doc as T], args.include, args.select);
        return populated[0] || null;
      }

      return toPlain<T>(doc);
    },

    findFirst: async (args?: QueryOptions): Promise<T | null> => {
      await ensureConnection();
      const mongoWhere = buildMongoWhere(args?.where);
      const sort = buildSort(args?.orderBy);

      let query = model.findOne(mongoWhere);
      if (sort) query = query.sort(sort);
      if (args?.select) {
        const fields: Record<string, number> = {};
        for (const [k, v] of Object.entries(args.select)) {
          fields[k] = v ? 1 : 0;
        }
        query = query.select(fields);
      }

      const doc = await query.lean();
      if (!doc) return null;

      doc.id = doc._id?.toString();
      delete doc._id;
      if (doc.__v !== undefined) delete doc.__v;

      if (args?.include) {
        const populated = await applyIncludes([doc as T], args.include, args.select);
        return populated[0] || null;
      }

      return toPlain<T>(doc);
    },

    findMany: async (args?: QueryOptions): Promise<T[]> => {
      await ensureConnection();
      const mongoWhere = buildMongoWhere(args?.where);
      const sort = buildSort(args?.orderBy);

      let query = model.find(mongoWhere);
      if (sort) query = query.sort(sort);
      if (args?.skip) query = query.skip(args.skip);
      if (args?.take) query = query.limit(args.take);

      let docs = await query.lean();
      docs = docs.map((d: any) => {
        d.id = d._id?.toString();
        delete d._id;
        if (d.__v !== undefined) delete d.__v;
        return d;
      });

      if (args?.include) {
        return applyIncludes(docs as T[], args.include, args.select);
      }

      return toPlainArray<T>(docs);
    },

    create: async (args: { data: Record<string, any> }): Promise<T> => {
      await ensureConnection();
      const { data } = args;

      // Remove id from data (MongoDB generates _id)
      const createData = { ...data };
      if (createData.id) delete createData.id;

      // Remove null/undefined values so sparse unique indexes don't conflict
      for (const key of Object.keys(createData)) {
        if (createData[key] === null || createData[key] === undefined) {
          delete createData[key];
        }
      }

      const doc = await model.create(createData);
      return toPlain<T>(doc)!;
    },

    update: async (args: { where: Record<string, string>; data: Record<string, any>; select?: Record<string, boolean> }): Promise<T> => {
      await ensureConnection();
      const { where, data, select } = args;

      const updateData = { ...data };
      if (updateData.id) delete updateData.id;

      // Separate null values (use $unset) from real values (use $set)
      const setData: Record<string, any> = {};
      const unsetData: Record<string, any> = {};
      for (const [key, val] of Object.entries(updateData)) {
        if (val === null || val === undefined) {
          unsetData[key] = 1;
        } else {
          setData[key] = val;
        }
      }

      const updateOp: Record<string, any> = {};
      if (Object.keys(setData).length > 0) updateOp.$set = setData;
      if (Object.keys(unsetData).length > 0) updateOp.$unset = unsetData;

      let query: any;
      if (where.id) {
        query = model.findByIdAndUpdate(where.id, updateOp, { new: true, runValidators: true });
      } else {
        const filter = buildMongoWhere(where);
        query = model.findOneAndUpdate(filter, updateOp, { new: true, runValidators: true });
      }

      if (select) {
        const fields: Record<string, number> = {};
        for (const [k, v] of Object.entries(select)) {
          fields[k] = v ? 1 : 0;
        }
        query = query.select(fields);
      }

      const doc = await query.lean();
      doc.id = doc._id?.toString();
      delete doc._id;
      if (doc.__v !== undefined) delete doc.__v;

      return toPlain<T>(doc)!;
    },

    updateMany: async (args: { where: Record<string, any>; data: Record<string, any> }): Promise<{ count: number }> => {
      await ensureConnection();
      const { where, data } = args;

      const filter = buildMongoWhere(where);
      const updateData = { ...data };
      if (updateData.id) delete updateData.id;

      const result = await model.updateMany(filter, { $set: updateData });
      return { count: result.modifiedCount };
    },

    delete: async (args: { where: Record<string, string> }): Promise<T> => {
      await ensureConnection();
      let doc: any;
      if (args.where.id) {
        doc = await model.findByIdAndDelete(args.where.id).lean();
      } else {
        doc = await model.findOneAndDelete(buildMongoWhere(args.where)).lean();
      }

      if (doc) {
        doc.id = doc._id?.toString();
        delete doc._id;
        if (doc.__v !== undefined) delete doc.__v;
      }

      return toPlain<T>(doc)!;
    },

    deleteMany: async (args?: { where?: Record<string, any> }): Promise<{ count: number }> => {
      await ensureConnection();
      const filter = args?.where ? buildMongoWhere(args.where) : {};
      const result = await model.deleteMany(filter);
      return { count: result.deletedCount };
    },

    count: async (args?: { where?: Record<string, any> }): Promise<number> => {
      await ensureConnection();
      const filter = args?.where ? buildMongoWhere(args.where) : {};
      return model.countDocuments(filter);
    },
  };
}

// ─── Export db object with Prisma-like API ───

export const db = {
  user: createModelWrapper(User),
  lot: createModelWrapper(Lot),
  reservation: createModelWrapper(Reservation),
  payment: createModelWrapper(Payment),
  message: createModelWrapper(Message),
  settings: createModelWrapper(Settings),
  logo: createModelWrapper(Logo),
  adminFile: createModelWrapper(AdminFile),
  notification: createModelWrapper(Notification),
  progressUpdate: createModelWrapper(ProgressUpdate),
  expertApplication: createModelWrapper(ExpertApplication),
  uploadedFile: createModelWrapper(UploadedFile),
};