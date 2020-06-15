import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviders = new ListProvidersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });
  it('should be able to show list the providers', async () => {
    const user1 = await fakeUsersRepository.create({
      email: 'johndoe@test.com',
      name: 'John Doe',
      password: '123456',
    });

    const user2 = await fakeUsersRepository.create({
      email: 'johndoel@test.com',
      name: 'John Doel',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      email: 'john@test.com',
      name: 'John Teste',
      password: '123456',
    });

    const providers = await listProviders.execute({ user_id: loggedUser.id });

    expect(providers).toEqual([user1, user2]);
  });
});
