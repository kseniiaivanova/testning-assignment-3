import { IOmdbResponse } from "./../../src/ts/models/IOmdbResponse";

const mockData: IOmdbResponse = {
  Search: [
    {
      Title: "Harry Potter",
      imdbID: "22344",
      Type: "Movie",
      Poster: "Harry",
      Year: "2001",
    },
    {
      Title: "Natural born killers",
      imdbID: "2",
      Type: "Movie",
      Poster: "Natural born killers",
      Year: "1994",
    },

    {
      Title: "Alphaville",
      imdbID: "3",
      Type: "Movie",
      Poster: "Alphaville",
      Year: "1965",
    },
  ],
};

describe("testing movieApp", () => {
  it("should show title", () => {
    cy.visit("http://localhost:1234/");
    cy.get("title").contains("Async testing");
  });

  it("should be able to get real data", () => {
    cy.visit("http://localhost:1234/");

    cy.get("input").type("Harry Potter").should("have.value", "Harry Potter");
    cy.get("button").click();
    cy.get("div#movie-container > div").should("have.class", "movie");
    cy.get("div.movie").contains("<h3>", "<img>");
  });

  it("should be able to type", () => {
    cy.visit("http://localhost:1234/");
    cy.intercept("GET", "http://omdbapi.com/*", mockData);
    cy.get("input").type("Harry Potter").should("have.value", "Harry Potter");
    cy.get("form").submit();
  });

  it("should get Mockdata", () => {
    cy.intercept("GET", "http://omdbapi.com/*", mockData);
    cy.get("button").click();
    cy.get("div.movie").should("have.length", 3);
    cy.get("h3:first").contains("Harry Potter");
    cy.get("h3:last").contains("Alphaville");
  });

  it("should not get data", () => {
    cy.get("div.movie").should("have.length", 3);
    cy.intercept("GET", "http://omdbapi.com/*", {});
    cy.get("button").click();
    cy.get("p").contains("Inga sökresultat att visa");
  });
});
