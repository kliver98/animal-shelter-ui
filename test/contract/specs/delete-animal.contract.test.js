import { provider } from '../config/init-pact';
import { AnimalController } from '../../../controllers';
import { Matchers } from '@pact-foundation/pact';

const animal_name = 'prueba';

describe('Given an animal service', () => {
    beforeAll(async() => {
        await provider.setup();
    });

    describe('When a request to delete an animal is made', () => {
        beforeAll(async() => {
            await provider.addInteraction({
                state: 'backend service is up',
                uponReceiving: 'a request to delete an animal',
                withRequest: {
                    method: 'DELETE',
                    path: '/animals/'+animal_name
                },
                willRespondWith: {
                    status: 200,
                    body: Matchers.eachLike({
                        message: Matchers.string('Animal deleted successfully'),
                    }, {min: 1})
                }
            });
        });

        test('Then it should return message confirming the animal deleted', async() => {
            const response = await AnimalController.delete(animal_name);
            expect(response.data).toMatchSnapshot();

            await provider.verify();
        })

    });

    afterAll(async () => {
        await provider.finalize();
    });
});
