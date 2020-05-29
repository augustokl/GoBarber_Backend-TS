import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfile = new ShowProfileService(fakeUsersRepository);
  });
  it('should be able to show the profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@test.com',
      name: 'John Doe',
      password: '123456',
    });

    const profile = await showProfile.execute({ user_id: user.id });

    await expect(profile.name).toBe('John Doe');
    await expect(profile.email).toBe('johndoe@test.com');
  });

  it('should not be able to show if user none exist', async () => {
    await expect(
      showProfile.execute({
        user_id: 'none-exist-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
