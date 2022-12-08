import { mockData } from "../../src/ts/services/__mocks__/movieservice";

beforeEach(() => {
  cy.visit("/");
});

describe("testing title, input and submit", () => {
  it("should show title", () => {
    cy.get("title").contains("Async testing");
  });

  it("should be able to type", () => {
    cy.get("input").type("Harry Potter").should("have.value", "Harry Potter");
  });

  it("should show placeholder", () => {
    cy.get("input").should("have.attr", "placeholder", "Skriv titel här");
  });

  it("should be able to click", () => {
    cy.get("input").type("Harry Potter");
    cy.intercept("GET", "http://omdbapi.com/*", mockData);
    cy.get("button").click();
  });

  it("should display error with input text less than 3 letters", () => {
    cy.get("input").type("Oj");
    cy.intercept("GET", "http://omdbapi.com/*", {});
    cy.get("button").click();
    cy.get("p").contains("Inga sökresultat att visa");
  });

  it("should display error if user types only numbers", () => {
    cy.get("input").type("1234");
    cy.intercept("GET", "http://omdbapi.com/*", {});
    cy.get("button").click();
    cy.get("p").contains("Inga sökresultat att visa");
  });
});

describe("testing web request", () => {
  it("should be able to get real data", () => {
    cy.get("input").type("Harry Potter");
    cy.get("button").click();
    cy.get("div#movie-container > div").should("have.class", "movie");
    cy.get("div.movie").contains("<h3>", "<img>");
    cy.get("h3").contains("Harry Potter");
  });

  it("should get Mockdata", () => {
    cy.intercept("GET", "http://omdbapi.com/*", mockData);
    cy.get("button").click();
    cy.get("div.movie").should("have.length", 3);
    cy.get("h3:first").contains("Harry Potter");
    cy.get("h3:last").contains("Alphaville");
  });

  it("should not get data if there is no match", () => {
    cy.intercept("GET", "http://omdbapi.com/*", {});
    cy.get("button").click();
    cy.get("div.movie").should("have.length", 0);
    cy.get("p").contains("Inga sökresultat att visa");
  });

  it("should get 0 movies if input is empty", () => {
    cy.intercept("GET", "http://omdbapi.com/*", {});
    cy.get("button").click();
    cy.get("div#movie-container > div.movie").should("have.length", 0);
    cy.get("p").contains("Inga sökresultat att visa");
  });

  it("should have correct request url", () => {
    cy.get("input").type("Harry").should("have.value", "Harry");
    cy.intercept("GET", "http://omdbapi.com/*", mockData).as("movierequest");
    cy.get("button").click();
    cy.wait("@movierequest").its("request.url").should("contain", "Harry");
  });
});
