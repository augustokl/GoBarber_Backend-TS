import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppoitmentsRepository from '@modules/appoitments/repositories/IAppoitmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appoitmentsRepository: IAppoitmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appoitments = await this.appoitmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        day,
        month,
        year,
      },
    );

    const hourStart = 8;

    const eachHourArray = Array.from(
      { length: 10 },
      (_, index) => index + hourStart,
    );

    const currentDate = new Date(Date.now());

    const availability = eachHourArray.map(hour => {
      const hasAppointmentInhour = appoitments.find(
        appoitment => getHours(appoitment.date) === hour,
      );

      const compareData = new Date(year, month - 1, day, hour);
      return {
        hour,
        available: !hasAppointmentInhour && isAfter(compareData, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
