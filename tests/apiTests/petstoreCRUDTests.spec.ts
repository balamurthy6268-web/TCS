import { test, expect } from '@playwright/test';

test('PetStore CRUD Operations', async ({ request }) => {

    // Generate unique pet id
    const petId = Date.now();

    // -------------------------
    // CREATE PET
    // -------------------------

    const createPayload = {
        id: petId,
        category: {
            id: 1,
            name: 'Dogs'
        },
        name: 'Bruno',
        photoUrls: [
            'https://sample.com/dog.jpg'
        ],
        tags: [
            {
                id: 10,
                name: 'Friendly'
            }
        ],
        status: 'available'
    };

    const createResponse = await request.post(
        'https://petstore.swagger.io/v2/pet',
        {
            data: createPayload
        }
    );

    expect(createResponse.status()).toBe(200);

    const createdPet = await createResponse.json();

    expect(createdPet.id).toBe(petId);
    expect(createdPet.name).toBe('Bruno');
    expect(createdPet.status).toBe('available');
    expect(createdPet.category.name).toBe('Dogs');
    expect(createdPet.tags[0].name).toBe('Friendly');

    console.log('Pet Created Successfully');

    // -------------------------
    // GET PET
    // -------------------------

    const getResponse = await request.get(
        `https://petstore.swagger.io/v2/pet/${petId}`
    );

    expect(getResponse.ok()).toBeTruthy();

    const petDetails = await getResponse.json();

    expect(petDetails.id).toEqual(petId);
    expect(petDetails.name).toEqual('Bruno');
    expect(petDetails.status).toEqual('available');

    console.log('Pet Retrieved Successfully');

    // -------------------------
    // UPDATE PET
    // -------------------------

    const updatePayload = {
        id: petId,
        category: {
            id: 2,
            name: 'Animals'
        },
        name: 'Rocky',
        photoUrls: [
            'https://sample.com/rocky.jpg'
        ],
        tags: [
            {
                id: 20,
                name: 'Playful'
            }
        ],
        status: 'sold'
    };

    const updateResponse = await request.put(
        'https://petstore.swagger.io/v2/pet',
        {
            data: updatePayload
        }
    );

    expect(updateResponse.status()).toBe(200);

    const updatedPet = await updateResponse.json();

    expect(updatedPet.id).toBe(petId);
    expect(updatedPet.name).toBe('Rocky');
    expect(updatedPet.status).toBe('sold');

    console.log('Pet Updated Successfully');

    // -------------------------
    // VERIFY UPDATE
    // -------------------------

    const verifyResponse = await request.get(
        `https://petstore.swagger.io/v2/pet/${petId}`
    );

    expect(verifyResponse.status()).toBe(200);

    const verifyPet = await verifyResponse.json();

    expect(verifyPet.id).toBe(petId);
    expect(verifyPet.name).toBe('Rocky');
    expect(verifyPet.status).toBe('sold');
    expect(verifyPet.category.name).toBe('Animals');
    expect(verifyPet.tags[0].name).toBe('Playful');

    console.log('Update Verified');

    // -------------------------
    // DELETE PET
    // -------------------------

    const deleteResponse = await request.delete(
        `https://petstore.swagger.io/v2/pet/${petId}`
    );

    expect(deleteResponse.status()).toBe(200);

    const deleteBody = await deleteResponse.json();

    expect(deleteBody.message).toBe(String(petId));

    console.log('Pet Deleted Successfully');

    // -------------------------
    // VERIFY DELETE
    // -------------------------

    const deletedResponse = await request.get(
        `https://petstore.swagger.io/v2/pet/${petId}`
    );

    expect(deletedResponse.status()).toBe(404);

    const deletedBody = await deletedResponse.json();

    expect(deletedBody.type).toBe('error');
    expect(deletedBody.message).toContain('Pet not found');

    console.log('Deletion Verified Successfully');

});
