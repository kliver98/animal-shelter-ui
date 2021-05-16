import { provider } from '../config/init-pact';
import { AnimalController } from '../../../controllers';

const name_not_exist = 'not_exist_never'
describe('Given an animal service', () => {
    beforeAll(async() => {
        await provider.setup();
    });

    describe('When a request to delete an animal is made', () => {
        beforeAll(async () => {
            await provider.addInteraction({
                state: 'animal does not exist',
                uponReceiving: 'a request to delete an animal',
                withRequest: {
                    method: 'DELETE',
                    path: `/animals/${name_not_exist}`,
                },
                willRespondWith: {
                    status: 404
                }
            });
        });

        test("Then it should return the right data", async() =>{
            const response = await AnimalController.delete(name_not_exist);
            await console.log('Hola')
            expect(response.data).toEqual(404);
            await provider.verify();
        });
    });

    afterAll(async () => {
        await provider.finalize();
    });
});