//Usage: 
//await ScreenshotUtil.capture(page);


class ScreenshotUtil {

  static async capture(page: any) {

    await page.screenshot({
      path: 'test.png'
    });
  }
}