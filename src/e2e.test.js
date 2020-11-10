import 'expect-puppeteer'
import puppeteer from 'puppeteer'

let browser, page

describe('Google', () => {
  beforeAll(async () => {
    browser = await puppeteer.launch({ headless: false })
    page = await browser.newPage()
    await page.goto('http://localhost:3000/login')
  })

  afterAll(async () => {
    await browser.close()
  })

  it('should be titled "FunnyBoard"', async () => {
    await expect(page.title()).resolves.toMatch('FunnyBoard')
  })

  it('should log in', async (done) => {
    await page.mainFrame().type('#login-email', 'dev@domain.com', { delay: 100 })
    await page.mainFrame().type('#login-password', 'qwe123', { delay: 100 })
    await page.mainFrame().click('#login-button', { delay: 100 })
    await browser.waitForTarget(target => target.url() === 'http://localhost:3000/')
    expect(await page.$('#app-header')).toBeTruthy()
    done()
  })
})
