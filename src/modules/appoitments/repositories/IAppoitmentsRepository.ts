import Appointment from '@modules/appoitments/infra/typeorm/entities/Appointment';
import ICreateAppoitmentDTO from '../dtos/ICreateAppoitmentDTO';

export default interface IAppointmentsRepository {
  create(data: ICreateAppoitmentDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
}
