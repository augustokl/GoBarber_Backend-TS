import { container } from 'tsyringe';

import IAppointmentsRepository from '@modules/appoitments/repositories/IAppoitmentsRepository';
import ApppointmentsRepository from '@modules/appoitments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

container.registerSingleton<IAppointmentsRepository>(
  'ApppointmentsRepository',
  ApppointmentsRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);
