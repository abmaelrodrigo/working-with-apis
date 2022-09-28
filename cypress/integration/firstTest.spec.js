/// <reference types="cypress" />

describe('Test with backend', () => {
    beforeEach('login to the app', () => {
        //cy.intercept('GET','https://api.realworld.io/api/tags', {fixture: 'tags.json'}) // this fixture command sends the tags on that json file to the web application
        cy.intercept({ method: 'Get', path: 'tags' }, { fixture: 'tags.json' })
        cy.loginToApplication()
        cy.wait(500)
    })

    it('Verify correct request and response', () => {

        cy.intercept('POST', 'https://api.realworld.io/api/articles/').as('postArticles')

        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('This is the title')
        cy.get('[formcontrolname="description"]').type('My desciption')
        cy.get('[formcontrolname="body"]').type('My article body')
        cy.get('[class="form-control ng-untouched ng-pristine ng-valid"]').type('#tags')
        cy.contains('Publish Article').click()

        // it waits for the api call to be completed
        cy.wait('@postArticles').then(xhr => {
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('My article body')
            expect(xhr.response.body.article.description).to.equal('My desciption')
        })

    })

    it('Intercepting and modifying the request and response', () => {

        // cy.intercept('POST','**/articles', (req) => {
        //     req.body.article.description = "My description 2"
        // }).as('postArticles')

        cy.intercept('POST', 'https://api.realworld.io/api/articles/', (req) => {
            req.reply(res => {
                expect(res.body.article.description).to.equal('My description')
                res.body.article.description = "My description 2"

            })
        }).as('postArticles')


        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('This is the title')
        cy.get('[formcontrolname="description"]').type('My description')
        cy.get('[formcontrolname="body"]').type('My article body')
        cy.get('[class="form-control ng-untouched ng-pristine ng-valid"]').type('#tags')
        cy.contains('Publish Article').click()

        cy.wait(500)
        // it waits for the api call to be completed
        cy.wait('@postArticles')

        cy.get('@postArticles').then(xhr => {
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('My article body')
            expect(xhr.response.body.article.description).to.equal('My description 2')
        })

    })

    it('verify if popular tags are displayed', () => {
        cy.get('.tag-list')
            .should('contain', 'cypress')
            .and('contain', 'automation')
            .and('contain', 'testing')
    })

    it('verify global fedd likes count', () => {
        cy.intercept('GET', 'https://api.realworld.io/api/articles/feed*', { "articles": [], "articlesCount": 0 })
        cy.intercept('GET', 'https://api.realworld.io/api/articles*', { fixture: 'articles.json' })

        cy.contains('Global Feed').click()
        cy.get('app-article-list button').then(heartList => {
            expect(heartList[0]).to.contain('1')
            expect(heartList[1]).to.contain('5')
        })

        cy.fixture('articles').then(file => {
            const articleLink = file.articles[1].slug
            file.articles[1].favortiesCount = 6 //a way of writing on the json file

            cy.intercept('POST', 'Solicitar URL: https://api.realworld.io/api/articles/' + articleLink + '/favorite', file)

            cy.get('app-article-list button').eq(1).click().should('contain', '6')
        })
    })

    it.only('delete a new article in a global feed', () => {
        cy.intercept(
            "DELETE",
            "https://api.realworld.io/api/articles/*",
            () => {}
          ).as("deleteArticles")
        
/*         const userCredentials = {
            "user": {
                "email": "abmael@mail.com",
                "password": "123456"
            }
        } */

        const bodyRequest = {
            "article": {
                "tagList": [],
                "title": "Request from API",
                "description": "API description from API",
                "body": "Angular is cool"
            }
        }



       cy.get('@token').then(token => {   //explained on class 31
                //const token = body.user.token

                cy.request({
                    url: Cypress.env('apiURL')+'api/articles/',
                    headers: { 'Authorization': 'Token ' + token },
                    method: 'POST',
                    body: bodyRequest
                })
                    .then(response => {
                        expect(response.status).to.equal(200)
                    })

                cy.contains('Global Feed').click()
                cy.get('.article-preview').first().click()
                cy.get('.article-actions').contains('Delete Article').click()
                cy.wait("@deleteArticles")

                cy.request({
                    url: Cypress.env('apiURL')+'api/articles?limit=10&offset=0',
                    headers: { 'Authorization': 'Token ' + token},
                    method: 'GET'
                }).its('body').then(body => {
                    console.log('AQUI!!!! ' + body.articles[0].title)
                    expect(body.articles[0].title).not.to.equal("Request from API")
                })



            })
    })
})