const { Builder, until, By, WebElement } = require("selenium-webdriver");

async function testLoginForm() {
    let driver = await new Builder().forBrowser("chrome").build();

    try {

        await driver.get("http://localhost:4200/login");
        await driver.manage().window().fullscreen();
        await driver.findElement(By.id('username')).sendKeys("consultant.demo1@eisi-consulting.fr");
        await driver.findElement(By.id('password')).sendKeys("Eisi2020");
        await driver.findElement(By.id('btn-login')).click();

    } finally {
        console.log("ERROR");
    }
}

testLoginForm();