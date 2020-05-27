import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeUsersRepository: FakeUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorageProvider,
    );
  });
  it('should be able to upload a avatar for user', async () => {
    const user = await fakeUsersRepository.create({
      email: 'johndoe@test.com',
      name: 'John Doe',
      password: '123456',
    });

    await updateUserAvatar.execute({
      avatarFilename: 'avatar.jpg',
      user_id: user.id,
    });

    await expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update a avatar for non existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        avatarFilename: 'avatar.jpg',
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update a avatar for user', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUsersRepository.create({
      email: 'johndoe@test.com',
      name: 'John Doe',
      password: '123456',
    });

    await updateUserAvatar.execute({
      avatarFilename: 'avatar.jpg',
      user_id: user.id,
    });

    await updateUserAvatar.execute({
      avatarFilename: 'avatar2.jpg',
      user_id: user.id,
    });

    await expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

    await expect(user.avatar).toBe('avatar2.jpg');
  });
});
