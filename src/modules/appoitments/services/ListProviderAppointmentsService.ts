import { injectable, inject } from 'tsyringe';

import IAppoitmentsRepository from '@modules/appoitments/repositories/IAppoitmentsRepository';
import Appointment from '../infra/typeorm/entities/Appointment';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

@injectable()
class ListProviderAppointmentsService {
  constructor(
    @inject('AppointmentsRepository')
    private appoitmentsRepository: IAppoitmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<Appointment[]> {
    const appoitments = await this.appoitmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        day,
        month,
        year,
      },
    );

    return appoitments;
  }
}

export default ListProviderAppointmentsService;
