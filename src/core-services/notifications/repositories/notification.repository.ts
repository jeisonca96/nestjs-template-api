import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../notification.schema';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectModel(Notification.name)
    private readonly model: Model<Notification>,
  ) {}

  async create(
    clientId: string,
    type: string,
    title: string,
    message: string,
    metadata?: Record<string, any>,
  ): Promise<Notification> {
    return this.model.create({ clientId, type, title, message, metadata });
  }

  async findByClientId(clientId: string): Promise<Notification[]> {
    return this.model.find({ clientId }).exec();
  }

  async markAsRead(id: string): Promise<Notification> {
    return this.model.findByIdAndUpdate(id, { read: true }, { new: true });
  }
}
