/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('loginToApplication', () => {
    // cy.visit('/login')
    // cy.get('[placeholder="Email"]').type('abmael@mail.com')
    // cy.get('[placeholder="Password"]').type('123456')
    // cy.get('form').submit()
    
    
    const userCredentials = {
        "user": {
            "email": "abmael@mail.com",
            "password": "123456"
        }
    }

    cy.request('POST', 'https://api.realworld.io/api/users/login', userCredentials)
    .its('body').then( body => {
        const token = body.user.token
        cy.wrap(token).as('token')

        cy.visit('/', {
            onBeforeLoad(win){
                win.localStorage.setItem('jwtToken', token) // explained on class 31
            }
        })
    })


   
   
   

})