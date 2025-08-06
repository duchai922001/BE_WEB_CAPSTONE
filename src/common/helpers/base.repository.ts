import { ClientSession, Model, Document } from 'mongoose';

export class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>, session?: ClientSession): Promise<T> {
    const doc = new this.model(data);
    return doc.save({ session });
  }

  async find(
    condition: any,
    limit?: number,
    session?: ClientSession,
  ): Promise<T[]> {
    const query = this.model.find(condition);
    if (limit) query.limit(limit);
    if (session) query.session(session);
    return query.exec();
  }

  async findById(id: string, session?: ClientSession): Promise<T | null> {
    const query = this.model.findById(id);
    if (session) query.session(session);
    return query.exec();
  }

  async updateById(
    id: string,
    data: Partial<T>,
    session?: ClientSession,
  ): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, data, { new: true, session })
      .exec();
  }

  async deleteById(id: string, session?: ClientSession): Promise<T | null> {
    return this.model.findByIdAndDelete(id, { session }).exec();
  }
}
