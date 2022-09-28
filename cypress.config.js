//import { defineConfig } from "cypress";
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  video: false,
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json'
  },
  e2e: {
    baseUrl: 'http://localhost:4200',
    specPattern: 'cypress/integration/**/*.{js,jsx,ts,tsx}',
    excludeSpecPattern: ['**/1-getting-started/*','**/2-advanced-examples/*']
    
  },
  env: {
    username: "abmael@mail.com",
    password: "123456",
    apiURL: "https://api.realworld.io/"
  },
  retries: {
    runMode: 2,
    openMode: 1
  }
})



/*export default defineConfig({
  viewportHeight: 1080,
  viewportWidth: 1920,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});*/