const { Builder, By, until } = require('selenium-webdriver');
require('geckodriver');

const fileUnderTest = 'file://' + __dirname.replace(/ /g, '%20') + '/../dist/index.html';
const defaultTimeout = 10000;
let driver;

jest.setTimeout(1000 * 60 * 5); // 5 minuter

// Det här körs innan vi kör testerna för att säkerställa att Firefox är igång
beforeAll(async () => {
    try {
        console.log(fileUnderTest);
        driver = await new Builder().forBrowser('firefox').build();
        await driver.get(fileUnderTest);
    } catch (error) {
        console.error('Error occurred during setup:', error);
    }
});

// Allra sist avslutar vi Firefox igen
afterAll(async () => {
    try {
        if (driver) {
            await driver.quit();
        } else {
            console.warn('No driver instance found to quit.');
        }
    } catch (error) {
        console.error('Error occurred during teardown:', error);
    }
}, defaultTimeout);

test('The stack should be empty in the beginning', async () => {
    let stack = await driver.findElement(By.id('top_of_stack')).getText();
    expect(stack).toEqual("n/a");
});

describe('Clicking "Pusha till stacken"', () => {
    it('should open a prompt box', async () => {
        let push = await driver.findElement(By.id('push'));
        await push.click();
        let alert = await driver.switchTo().alert();
        await alert.sendKeys("Bananer");
        await alert.accept();
    });
});

test('Verify presence and functionality of "Push to Stack" button', async () => {
    // Hitta knappen "Push to Stack"
    const pushButton = await driver.findElement(By.id('push'));

    // Verifiera att knappen finns
    expect(pushButton).not.toBeNull();

    // Klicka på knappen
    await pushButton.click();

    // Vänta på att en prompt visas
    await driver.wait(until.alertIsPresent());

    // Verifiera att en prompt visas
    const alert = await driver.switchTo().alert();
    expect(alert).not.toBeNull();

    // Avbryt prompten
    await alert.dismiss();
});