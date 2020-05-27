import FakeAppointmentRepository from '@modules/appoitments/repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';

let createAppointment: CreateAppointmentService;
let fakeAppointmentRepository: FakeAppointmentRepository;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentRepository);
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: 'as45s4454545asd45',
    });

    await expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: 'as45s4454545asd45',
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: 'as45s4454545asd45',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
