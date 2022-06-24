const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');

require('dotenv').config();

beforeAll(() => mongoose.connect(process.env.MONGO_SERVER));
afterAll(() => mongoose.disconnect());

describe('routes', () => {
  it('must response with `hi`', async () => {
    await request(app).get('/').expect('Content-type', /json/).expect(200, /hi/);
  });

  it('must recieve array of questions', async () => {
    await request(app)
      .get('/questions')
      .expect('Content-type', /json/)
      .expect(200)
      .expect((res) => {
        const { body } = res;

        expect(body).toBeInstanceOf(Object);

        expect(Object.keys(body.items[0])).toEqual(
          expect.arrayContaining([
            '_id',
            'question',
            'commentsCount',
            'author',
            'createdAt',
            'updatedAt',
          ])
        );
      });
  });

  it('must response json with "error" key', async () => {
    await request(app)
      .post('/questions')
      .expect('Content-type', /json/)
      .expect(401)
      .expect((res) => {
        const { body } = res;

        expect(body).toHaveProperty('error');
      });
  });

  it('must return only one item', async () => {
    await request(app)
      .get('/questions/?limit=1')
      .expect('Content-type', /json/)
      .expect(200)
      .expect((res) => {
        const { body } = res;

        expect(body).toBeInstanceOf(Object);

        expect(body.items.length).toBe(1);
      });
  });
});
