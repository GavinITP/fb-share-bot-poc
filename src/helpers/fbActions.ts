import { Page } from "puppeteer";

export async function login(page: Page, email: string, password: string) {
  await page.goto("https://web.facebook.com");
  await page.type("#email", email);
  await page.type("#pass", password);
  await page.click('button[name="login"]');
  await page.waitForNavigation();
}

export async function clickShareButton(page: Page) {
  await page.evaluate(async () => {
    const selector =
      "div.x9f619.x1n2onr6.x1ja2u2z.x78zum5.x1r8uery.x1iyjqo2.xs83m0k.xeuugli.xl56j7k.x6s0dn4.xozqiw3.x1q0g3np.xn6708d.x1ye3gou.xexx8yu.xcud41i.x139jcc6.x4cne27.xifccgj.xn3w4p2.xuxw1ft > div";
    const elements = document.querySelectorAll(selector);
    const shareButton = elements[2];
    if (!shareButton) {
      throw new Error("Share button not found");
    }

    (shareButton as HTMLElement).click();
    await window.scrollTo(0, document.body.scrollHeight);
  });
}

export async function clickGroupButton(page: Page) {
  await page.evaluate(async () => {
    const groupButtons = document.querySelectorAll("span");
    const groupButton = Array.from(groupButtons).find(
      (span) => span.textContent === "Group"
    );

    if (!groupButton) {
      throw new Error("Share to group button not found");
    }

    groupButton.click();
  });
}

export async function selectGroup(page: Page, groupName: string) {
  await page.evaluate(async (groupName) => {
    const spanElements = document.querySelectorAll("span");
    const group = Array.from(spanElements).find(
      (span) => span.textContent === groupName
    );

    if (!group) {
      console.log("group", group);
      throw new Error("Group not found");
    }

    group.scrollIntoView({ block: "nearest" });
    group.click();
  }, groupName);
}

export async function clickPostButton(page: Page) {
  await page.evaluate(async () => {
    const spanElements = document.querySelectorAll("span");
    const postButton = Array.from(spanElements).find(
      (div) => div.textContent === "Post"
    );
    if (!postButton) {
      throw new Error("Post button not found");
    }

    postButton.click();
  });
}
