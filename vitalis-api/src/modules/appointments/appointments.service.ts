import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAppointmentDto: CreateAppointmentDto) {
    return this.prisma.appointment.create({
      data: createAppointmentDto,
    });
  }

  async findAll() {
    return this.prisma.appointment.findMany({
      orderBy: { dateTime: 'asc' },
    });
  }

  async findUpcoming() {
    return this.prisma.appointment.findMany({
      where: {
        dateTime: { gte: new Date() },
        status: 'SCHEDULED',
      },
      orderBy: { dateTime: 'asc' },
    });
  }
}

