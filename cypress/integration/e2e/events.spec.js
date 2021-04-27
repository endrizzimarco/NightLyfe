/// <reference types="cypress" />

describe('testing "Events" feature functionality', () => {
  before(() => {
    cy.visit('http://localhost:8080')
  })

  it('should not create event if event name missing', () => {
    // Click center '+' button
    cy.get('[data-cy="centerBtn"]').click()
    // Click new event button
    cy.get('div').contains('New Event').click()
    // Check if event form appears
    cy.get('[data-cy="eventForm"]').should('exist')
    // Click 'Submit Event Button'
    cy.get('div').contains('Submit Event').click()
    // Check for error message
    cy.get('div').contains('Please insert a name for the event.').should('exist')
    // Check form has not closed
    cy.get('[data-cy="eventForm"]').should('exist')
  })

  it('should not create event if event date missing', () => {
    // Select name input
    cy.get('input[aria-label="Event Name"]')
      .type('Bestest Party')
      .should('have.value', 'Bestest Party')
    // Click 'Submit Event Button'
    cy.get('div').contains('Submit Event').click()
    // Check for error message
    cy.get('div').contains('Please insert a valid date for the event.').should('exist')
    // Check form has not closed
    cy.get('[data-cy="eventForm"]').should('exist')
  })

  it('should not create event if event time missing', () => {
    // Select date input
    cy.get('input[type="date"]')
    .type('2021-12-12')
    .should('have.value', '2021-12-12')
    // Click 'Submit Event Button'
    cy.get('div').contains('Submit Event').click()
    // Check for error message
    cy.get('div').contains('Please insert a valid time for the event.').should('exist')
    // Check form has not closed
    cy.get('[data-cy="eventForm"]').should('exist')
  })

  it('should not create event if event location missing', () => {
    // Select time input
    cy.get('input[type="time"]')
      .type('12:12')
      .should('have.value', '12:12')
    // Click 'Submit Event Button'
    cy.get('div').contains('Submit Event').click()
    // Check for error message
    cy.get('div').contains('Please insert a valid time for the event.').should('exist')
    // Check form has not closed
    cy.get('[data-cy="eventForm"]').should('exist')
  })

  it('should create event', () => {
    // Select location input
    cy.get('input[type="search"]')
    .type('162 Guildford Park', {delay: 100})
    .should('have.value', '162 Guildford Park')
    cy.wait(200) // Give time for google Places response
    // Select location
    cy.get('span').contains('162 Guildford Park Avenue, Guildford, UK').click()
    // Add event details
    cy.get('textarea')
      .type('Scooby-Doo themed party')
      .should('have.value', 'Scooby-Doo themed party')
    // Click submit event button
    cy.get('div').contains('Submit Event').click()
    // Check if popup appears after signal 
    cy.get('div').contains('Event Submitted').should('exist')
    // Check form has closed
    cy.get('[data-cy="eventForm"]').should('not.exist')
  })

  it('should show created event on map', () => {
    // Give time for firebase response
    cy.wait(2000) 
    // Select created event on map
    cy.get('div[title][role="button"][tabindex=-1]', {force: true}).last().click()
    // Check event content is correct
    cy.get('p').contains('Bestest Party (2021-12-12 12:12)').should('exist')
    cy.get('p').contains('Scooby-Doo themed party').should('exist')
  })
})