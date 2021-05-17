import { provider } from '../config/init-pact';
import { AnimalController } from '../../../controllers';

const animal_name = 'Manchas';

describe('Given an animal service', () =>{ 
    beforeAll(async() => {
        await provider.setup();
    });

   describe('When a request to delete an animal is made', () =>{
        beforeAll(async ()=>{
            await provider.addInteraction({
                uponReceiving: 'a request to delete an animal',
                state:"exists at least default animal, Manchas",
                withRequest: {
                    method: 'DELETE',
                    path: `/animals/${animal_name}`,			
                },
                willRespondWith: {
                    status:204
                }
            });
       });

        test("Then it should return the right data", async() => {
            const response = await AnimalController.delete(animal_name);
            expect(response.status).toEqual(204);
            //Here, well in the response I FOUND A BUG. When animal DOES NOT exist, should return 404 Not Found and it's coded...
            //But for some reason not enter to catch and continue and launch noContent() that it's a 204 code, like successful but with no content
            //The interesting fact it's only here, as far as I manual tested, because in postman launches a 404 error.
            await provider.verify();
            
        });
    });

    afterAll(async ()=>{
        await provider.finalize();
    });
});