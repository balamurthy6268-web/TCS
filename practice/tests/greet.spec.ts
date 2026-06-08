//validate the greeting message on the greet.html file to check if greeting message is appropriate for the time of the day
import { test, expect } from '@playwright/test';
test('should display appropriate greeting message based on the time of the day', async ({ page }) => {
    await page.goto('file:///e:/blaptop/tcs/greet.html');
    const greetingMessage = page.locator('#greet')
    await expect(greetingMessage).toBeVisible({ timeout: 5000 });
    const actualGreeting = (await greetingMessage.textContent())?.toLowerCase();
      

    const currentHour = new Date().getHours();
    /*
    if (currentHour >= 5 && currentHour < 12) {
          //morning greeting should be displayed.
          //contains is used to check if the actual greeting message contains the word "morning"
          await expect(greetingMessage).toHaveText(/morning/i);
    } else if (currentHour >= 12 && currentHour < 17) {
        await expect(greetingMessage).toHaveText(/noon/i);
    } else if (currentHour >= 17 && currentHour < 21) {
        await expect(greetingMessage).toHaveText(/evening/i);
    } else {
        await expect(greetingMessage).toHaveText(/night/i);
    }
        */
       //use switch case to check the greeting message
       switch (true) {
        case (currentHour >= 5 && currentHour < 12):    
            await expect(greetingMessage).toHaveText(/morning/i);
            break;      
        case (currentHour >= 12 && currentHour < 17):
            await expect(greetingMessage).toHaveText(/noon/i);
            break;
        case (currentHour >= 17 && currentHour < 21):
            await expect(greetingMessage).toHaveText(/evening/i);
            break;
        default:
            await expect(greetingMessage).toHaveText(/night/i);
       }    
});