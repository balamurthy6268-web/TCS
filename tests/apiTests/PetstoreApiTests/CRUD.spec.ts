import { test, expect } from '@playwright/test';

const BASE_URL = 'https://petstore.swagger.io/v2';

const petId = Date.now();

const petData = {
  id: petId,
  category: {
    id: 1,
    name: 'Dogs'
  },
  name: 'Tommy',
  photoUrls: ['https://example.com/dog.jpg'],
  tags: [
    {
      id: 1,
      name: 'friendly'
    }
  ],
  status: 'available'
};

test.describe('PetStore V2 CRUD Operations', () => {

  test('Create Pet', async ({ request }) => {

    const response = await request.post(
      `${BASE_URL}/pet`,
      {
        data: petData
      }
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.id).toBe(petId);
    expect(body.name).toBe('Tommy');
    expect(body.status).toBe('available');
  });

  test('Get Pet By Id', async ({ request }) => {

    const response = await request.get(
      `${BASE_URL}/pet/${petId}`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.id).toBe(petId);
    expect(body.name).toBe('Tommy');
  });

  test('Update Pet', async ({ request }) => {

    const updatedPet = {
      ...petData,
      name: 'Bruno',
      status: 'pending'
    };

    const response = await request.put(
      `${BASE_URL}/pet`,
      {
        data: updatedPet
      }
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.name).toBe('Bruno');
    expect(body.status).toBe('pending');
  });

  test('Update Pet Status', async ({ request }) => {

    const response = await request.post(
      `${BASE_URL}/pet/${petId}`,
      {
        form: {
          name: 'Bruno',
          status: 'sold'
        }
      }
    );

    expect(response.status()).toBe(200);
  });

  test('Verify Updated Status', async ({ request }) => {

    const response = await request.get(
      `${BASE_URL}/pet/${petId}`
    );

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.status).toBe('sold');
  });

  test('Delete Pet', async ({ request }) => {

    const response = await request.delete(
      `${BASE_URL}/pet/${petId}`
    );

    expect(response.status()).toBe(200);
  });

  test('Verify Pet Deleted', async ({ request }) => {

    const response = await request.get(
      `${BASE_URL}/pet/${petId}`
    );

    expect(response.status()).toBe(404);

    const body = await response.json();

    expect(body.message).toBe(String(petId));
  });

});