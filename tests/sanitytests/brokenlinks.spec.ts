    import { test } from "@playwright/test";
import { checkBrokenLinks } from "./../utils/brokenlinkschecker";

test("Broken link utility test", async ({ page, request }) => {
  await checkBrokenLinks(
    page,
    request,
    "https://the-internet.herokuapp.com/status_codes", // URL
    "broken-linksbala.txt"                                 // Output filename
  );
});
