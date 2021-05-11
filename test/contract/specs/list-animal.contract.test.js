import { provider } from './init-pact';
import { AnimalController } from '../../../controllers';
import { Matchers } from '@pact-foundation/pact';

describe('Given an animal service', () => {
    beforeAll(async() => {
        await provider.setup();
    });

    describe('When a request to list all the animal is made', () => {
        beforeAll(async() => {
            await provider.addInteraction({
                state: 'has animals',
                uponReceiving: 'a request to list all animals',
                withRequest: {
                    method: 'GET',
                    path: '/animals'
                },
                willRespondWith: {
                    status: 200,
                    body: Matchers.eachLike({
                        name: Matchers.string('Manchas'),
                        breed: Matchers.like("Bengali"),
                        gender: Matchers.like("Female"),
                        vaccinated: Matchers.boolean(true),
                    }, {min: 1})
                }
            });
        });

        test('Then it should return the right data', async() => {
            const response = await AnimalController.list();
            expect(response.data).toMatchSnapshot();

            await provider.verify();
        })

    });

    afterAll(async () => {
        await provider.finalize();
    });
});
