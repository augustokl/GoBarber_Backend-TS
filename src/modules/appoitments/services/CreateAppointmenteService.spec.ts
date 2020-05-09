import FakeAppointmenteRepository from '@modules/appoitments/repositories/fakes/FakeAppointmentsRepository';
import AppError from '@shared/errors/AppError';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmenteRepository = new FakeAppointmenteRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmenteRepository,
    );

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: 'as45s4454545asd45',
    });

    expect(appointment).toHaveProperty('id');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const fakeAppointmenteRepository = new FakeAppointmenteRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmenteRepository,
    );

    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: 'as45s4454545asd45',
    });

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: 'as45s4454545asd45',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
