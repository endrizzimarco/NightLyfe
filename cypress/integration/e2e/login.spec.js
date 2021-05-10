/// <reference types="cypress" />

describe('Testing login functionality', () => {
  beforeEach(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb')
    cy.visit('http://localhost:8080/#/auth')
    cy.url().should('include', 'auth')
  })

  it('Should login', () => {
    // https://on.cypress.io/type
    cy.get('[type="email"]')
      .type('test@test.com')
      .should('have.value', 'test@test.com')

    cy.get('[type="password"]')
      .type('123456')
      .should('have.value', '123456')
    
    cy.get('span').contains('Sign In').click()
    cy.url().should('not.include', 'auth')
  })
})
