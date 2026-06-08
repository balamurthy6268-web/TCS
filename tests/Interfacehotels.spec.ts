import {  test,expect } from '@playwright/test';

interface InterfaceHotel {
    prepareTomatoSoup(): Promise<string>;
}

// Vegan hotel
class Hotel1 implements InterfaceHotel {

    constructor() {}

    async prepareTomatoSoup(): Promise<string> {
        console.log(
            'Preparing vegan tomato soup with fresh tomatoes and herbs.'
        );
        return 'Vegan tomato soup is ready!';
    }
}

// Non-vegan hotel
class Hotel2 implements InterfaceHotel {

    constructor() {}

    async prepareTomatoSoup(): Promise<string> {
        console.log(
            'Preparing tomato soup with fresh tomatoes and herbs. Adding cream for a richer flavor.'
        );
        return 'Tomato soup is ready with fresh cream';
    }
}

test('Interface Example', async ({  }) => {

    //instantiating the hotels and calling the prepareTomatoSoup method

    //Vegan hotel
    const veganHotel = new Hotel1();
    const veganSoup = await veganHotel.prepareTomatoSoup();
    expect(veganSoup).toContain('Vegan');

    //non vegan hotel
    const nonVeganHotel = new Hotel2();
    const nonVeganSoup = await nonVeganHotel.prepareTomatoSoup();
    expect(nonVeganSoup).toContain('cream');
});
