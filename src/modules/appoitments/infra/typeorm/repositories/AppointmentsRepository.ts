import { getRepository, Repository, Raw } from 'typeorm';

import IAppointmentRepository from '@modules/appoitments/repositories/IAppoitmentsRepository';
import ICreateAppointmenteDTO from '@modules/appoitments/dtos/ICreateAppoitmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appoitments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appoitments/dtos/IFindAllInDayFromProviderDTO';

import Appointment from '@modules/appoitments/infra/typeorm/entities/Appointment';

class AppointmentsRepository implements IAppointmentRepository {
  private ormRepository: Repository<Appointment>;

  constructor() {
    this.ormRepository = getRepository(Appointment);
  }

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.ormRepository.findOne({
      where: { date },
    });

    return findAppointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const parsedMonth = String(month).padStart(2, '0');

    const findAppointment = this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'MM-YYYY') == '${parsedMonth} - ${year}'`,
        ),
      },
    });

    return findAppointment;
  }

  public async findAllInDayFromProvider({
    provider_id,
    day,
    month,
    year,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const parsedDay = String(day).padStart(2, '0');
    const parsedMonth = String(month).padStart(2, '0');

    const findAppointment = this.ormRepository.find({
      where: {
        provider_id,
        date: Raw(
          dateFieldName =>
            `to_char(${dateFieldName}, 'DD-MM-YYYY') == '${parsedDay} - ${parsedMonth} - ${year}'`,
        ),
      },
    });

    return findAppointment;
  }

  public async create({
    provider_id,
    date,
  }: ICreateAppointmenteDTO): Promise<Appointment> {
    const appoitment = this.ormRepository.create({ provider_id, date });

    await this.ormRepository.save(appoitment);

    return appoitment;
  }
}

export default AppointmentsRepository;
