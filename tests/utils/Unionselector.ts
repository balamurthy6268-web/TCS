import { Page } from '@playwright/test';

//union type to define the allowed locator types

type LocatorType = 'css' | 'xpath' | 'text';

  export function clickElement(
    page: Page,
    locatorType: LocatorType,
    locatorValue: string
  ) {
    switch (locatorType) {
      case 'css':
         page.locator(locatorValue).click();
        break;

      case 'xpath':
        page.locator(`xpath=${locatorValue}`).click();
        break;

      case 'text':
        page.getByText(locatorValue).click();
        break;
    }
  }


