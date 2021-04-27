/// <reference types="cypress" />

describe('testing "Signals" feature functionality', () => {
  before(() => {
    cy.visit('http://localhost:8080')
  })

  it('should not create signal if signal type not defined', () => {
    // Click center '+' button
    cy.get('[data-cy="centerBtn"]').click()
    // Click new signal
    cy.get('div').contains('New Signal').click()
    // Check if signal form appears
    cy.get('[data-cy="signalForm"]')
    // Click 'Create Signal Button'
    cy.get('div').contains('Create Signal').click()
    // Check for error message
    cy.get('div').contains('Please select a signal type.')
    // Check form has not disappeared 
    cy.get('[data-cy="signalForm"]').should('exist')
  })

  it('should create signal', () => {
    // Select 'Fight Breakout' as signal type
    cy.get('div').contains('Fight Breakout').click()
    // Write some details for the signal
    cy.get('[placeholder="Describe the situation"]')
      .type('I am writing some details')
      .should('have.value', 'I am writing some details')
    // Click 'Create Signal Button'
    cy.get('div').contains('Create Signal').click()
    // Check if popup appears after signal 
    cy.get('div').contains('Signal Sent').should('exist')
    // Check form disappears on button click
    cy.get('[data-cy="signalForm"]').should('not.exist')
  })

  it('should show signal on map', () => {
    // Give time for firebase response
    cy.wait(500) 
    // Click on new signal on the map
    cy.get('div[title][role="button"][tabindex=-1]', {force: true}).last().click()
    // Check signal content is correct
    cy.get('p').contains('Fight Breakout').should('exist')
    cy.get('p').contains('I am writing some details').should('exist')
  })


})
