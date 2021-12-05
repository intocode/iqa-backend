const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');

require('dotenv').config();

beforeAll(() => mongoose.connect(process.env.MONGO_SERVER));
afterAll(() => mongoose.disconnect());

describe('routes', () => {
  it('must response with `hi`', async () => {
    // prettier-ignore
    await request(app)
      .get('/')
      .expect('Content-type', /json/)
      .expect(200, /hi/);
  });

  it('must recieve array of questions', async () => {
    await request(app)
      .get('/questions')
      .expect('Content-type', /json/)
      .expect(200)
      .expect((res) => {
        const { body } = res;

        expect(body).toBeInstanceOf(Array);
        expect(Object.keys(body[0])).toEqual(
          expect.arrayContaining([
            '_id',
            'question',
            'comment',
            'tags',
            'user',
            'createdAt',
            'updatedAt',
            'rates',
          ])
        );
      });
  });
});
