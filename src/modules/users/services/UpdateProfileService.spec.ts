import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@test.com',
      name: 'John Doe',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      email: 'johndoel@test.com.br',
      name: 'John Doel',
    });

    await expect(updatedUser.name).toBe('John Doel');
    await expect(updatedUser.email).toBe('johndoel@test.com.br');
  });

  it('should not be able to change to another user email', async () => {
    await fakeUsersRepository.create({
      email: 'johndoe@test.com',
      name: 'John Doe',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      email: 'jorel@test.com',
      name: 'Jor El',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'johndoe@test.com',
        name: 'John Doe',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@test.com',
      name: 'John Doe',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      email: 'johndoel@test.com.br',
      name: 'John Doel',
      old_password: '123456',
      password: '123123',
    });

    await expect(updatedUser.password).toBe('123123');
  });

  it('should be able to update the password without old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@test.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'johndoel@test.com.br',
        name: 'John Doel',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@test.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        email: 'johndoel@test.com.br',
        name: 'John Doel',
        password: '123123',
        old_password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile none exits user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'none-exists-id',
        email: 'johndoel@test.com.br',
        name: 'John Doel',
        password: '123123',
        old_password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
