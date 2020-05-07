import { EntityRepository, Repository } from 'typeorm';

import IAppointmenteRepository from '@modules/appoitments/repositories/IAppoitmentsRepository';

import Appointment from '@modules/appoitments/infra/typeorm/entities/Appointment';

@EntityRepository(Appointment)
class AppointmentsRepository extends Repository<Appointment>
  implements IAppointmenteRepository {
  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.findOne({ where: { date } });

    return findAppointment;
  }
}

export default AppointmentsRepository;
