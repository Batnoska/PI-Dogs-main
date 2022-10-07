/* eslint-disable import/no-extraneous-dependencies */
const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../../src/app.js');
const { Dog, conn } = require('../../src/db.js');

const agent = session(app);
const dog = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  name: 'Pug',
  heightMin: 1,
  heightMax: 5,
  weightMin: 1,
  weightMax: 5,
  image: "https://cdn.wallpapersafari.com/0/88/ujTDLZ.jpg",
  temperament: "Active",
};

const dogO = {
  name: "Rodhesian",
  heightMin: 2,
  heightMax: 6,
  weightMin: 2,
  weightMax: 6,
  image: "https://cdn.wallpapersafari.com/0/88/ujTDLZ.jpg",
  temperament: "Stubborn",
};

const dogIncomp = {
  heightMin: 3,
  heightMax: 4,
  weightMin: 3,
  weightMax: 4,
  temperament: ["obedient"],
};

describe('Dog routes', () => {
  before(() => conn.authenticate()
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }));
  beforeEach(() => Dog.sync({ force: true })
    .then(() => Dog.create(dog)));
  describe('GET /dogs/:id', () => {
    it('should return a dog', () =>{
      agent.get('/dogs/a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11').expect(200).timeout(10000)
    });
  });
  describe("GET /temperaments", () => {
    it("should get 200 when get all temperaments", () =>
      agent.get("/temperaments").expect(200)
    );
  });
  describe("POST /dogs", () => {
    it("should get 200 status when created", () =>
      agent.post("/dogs")
      .send(dogO).expect(200).timeout(10000)
    );
    it("should get 400 status when created", () =>
      agent.post("/dogs")
      .send(dogIncomp).expect(400).timeout(10000)
    );
  });
});
