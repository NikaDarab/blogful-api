const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeArticlesArray } = require("./articles.fixtures");

describe.only("Articles Endpoints", function () {
  let db;
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("blogful_articles").truncate());

  afterEach("cleanup", () => db("blogful_articles").truncate());
  context("Given there are articles in the database", () => {
    const testArticles = makeArticlesArray();
    beforeEach("insert articles", () => {
      return db.into("blogful_articles").insert(testArticles);
    });
    it("GET /articles responds with 200 and all of the articles", () => {
      return supertest(app).get("/articles").expect(200, testArticles);
      // TODO: add more assertions about the body
    });
    it("Get /articles/:article_id responds with 200 and the specific article", () => {
      const articleId = 2;
      const expectedArticle = testArticles[articleId - 1];
      return supertest(app)
        .get(`/articles/${articleId}`)
        .expect(200, expectedArticle);
    });
  });
});
