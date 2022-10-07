const { Dog, conn } = require('../../src/db.js');
const { expect } = require('chai');

describe('Dog model', () => {
  before(() => conn.authenticate()
    .catch((err) => {
      console.error('Unable to connect to the database:', err);
    }));
  describe('Validators', () => {
    beforeEach(() => Dog.sync({ force: true }));
    describe('name', () => {
      it('should throw an error if name is null', async () => {
        try {
          await Dog.create({heightMin: 4, heightMax: 5, weightMin: 1, weightMax: 5, image: "https://cdn.wallpapersafari.com/0/88/ujTDLZ.jpg"})
          done()
        } catch (error) {
          expect(error.message).to.equal("notNull Violation: dog.name cannot be null");
        }
      });
      it('should work when its a valid name', async () => {
        const dogCreated = await Dog.create({ name: "Pug", weightMin: 1, weightMax: 4, heightMin: 1, heightMax: 4, image: "https://cdn.wallpapersafari.com/0/88/ujTDLZ.jpg"})

        const found = await Dog.findOne({
          where: {
            name: "Pug"
          },
        });

        expect(await dogCreated.name).to.equal(await found.dataValues.name);
      });
    });
  });
});
