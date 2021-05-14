import { provider } from '../config/init-pact';
import { AnimalController } from '../../../controllers';
import { Matchers } from '@pact-foundation/pact';

const animal = {
    'name': 'pruebaaa',
    'breed': 'Birmano',
    'gender': 'Male',
    'isVaccinated': true,
    'vaccines': ["gripe","peritonitisInfecciosa"]
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
                    path: '/animals'
                },
                willRespondWith: {
                    status: 201,
                    body: Matchers.eachLike({
                        name: Matchers.string('Manchas'),
                        breed: Matchers.like("Bengali"),
                        //gender: Matchers.term({generate: 'Female', matcher: 'Female|Male'}),
                        gender: Matchers.like("Female"),
                        vaccinated: Matchers.boolean(true),
                        vaccines: Matchers.eachLike("Rabia", {min: 1})
                    }, {min: 1})
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
