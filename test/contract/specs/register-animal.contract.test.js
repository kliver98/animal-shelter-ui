import { provider } from '../config/init-pact';
import { AnimalController } from '../../../controllers';
import { Matchers } from '@pact-foundation/pact';

const animal = {
    'name': 'Manchitas',
    'breed': 'Bengali',
    'gender': 'Female',
    'isVaccinated': true,
    'vaccines': []
}

describe('Given an animal service', () => {
    beforeAll(async() => {
        await provider.setup();
    });

    describe('When a request to create an animal is made', () => {
        beforeAll(async() => {
            await provider.addInteraction({
                state: 'backend service is up',
                uponReceiving: 'a request to create an animal',
                withRequest: {
                    method: 'POST',
                    path: '/animals',
                    body: animal
                },
                willRespondWith: {
                    status: 201,
                    body: Matchers.like(animal)
                }
            });
        });

        test('Then it should return the right data', async() => {
            const response = await AnimalController.register(animal);
            expect(response.data).toMatchSnapshot();

            await provider.verify();
        })

    });

    afterAll(async () => {
        await provider.finalize();
    });
});
