import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createOrder(data: { userId: string; stripeSessionId: string }) {
    // User araması
    const user = await this.userRepository.findOne({
      where: { id: data.userId },
    });
    if (!user) {
      throw new Error('User not found');
    }

    // Order oluşturma
    const order = this.orderRepository.create({
      user,
      stripeSessionId: data.stripeSessionId,
      status: 'pending',
    });

    return this.orderRepository.save(order);
  }

  async updateOrderStatus(
    stripeSessionId: string,
    status: 'completed' | 'failed',
  ) {
    // Stripe Session ID ile Order araması
    const order = await this.orderRepository.findOne({
      where: { stripeSessionId },
    });
    if (order) {
      order.status = status;
      await this.orderRepository.save(order);
    }
  }
}
