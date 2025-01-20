import axios, { type AxiosInstance } from 'axios';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { execSyncWithOutput } from '../helper';

describe('Integration test example 2-basic', () => {
  let childProcess: any;
  let client: AxiosInstance;

  beforeAll(async () => {
    const examplePath = `examples${path.sep}2-basic`;

    execSyncWithOutput(`cd ${examplePath} && npm install`);
    execSyncWithOutput(`cd ${examplePath} && npm run build`);
    execSyncWithOutput(`cd ${examplePath} && npm run lint -- --fix`);

    childProcess = spawn('node', [`dist${path.sep}src${path.sep}index.js`], {
      cwd: examplePath,
      detached: true
    });

    client = axios.create({
      baseURL: 'http://localhost:3002',
      headers: { accept: 'application/json' },
      validateStatus: () => true
    });

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }, 30000);

  afterAll(async () => {
    if (childProcess !== undefined) {
      childProcess.kill();
    }
  });

  [
    {
      path: '/v1/orders',
      postData: {
        id: 4,
        productId: 2,
        userId: 3,
        quantity: 1
      },
      existingData: [
        {
          id: 1,
          productId: 1,
          userId: 1,
          quantity: 1
        },
        {
          id: 2,
          productId: 2,
          userId: 2,
          quantity: 10
        },
        {
          id: 3,
          productId: 3,
          userId: 3,
          quantity: 2
        }
      ]
    },
    {
      path: '/v1/products',
      postData: {
        id: 4,
        name: 'Dog Food'
      },
      existingData: [
        {
          id: 1,
          name: 'Ant Farm'
        },
        {
          id: 2,
          name: 'Balloons'
        },
        {
          id: 3,
          name: 'Cat Food'
        }
      ]
    },
    {
      path: '/v1/users',
      postData: {
        id: 4,
        name: 'Dan'
      },
      existingData: [
        {
          id: 1,
          name: 'Abby'
        },
        {
          id: 2,
          name: 'Brandon'
        },
        {
          id: 3,
          name: 'Carl'
        }
      ]
    }
  ].forEach(test => {
    it(`When calling POST ${test.path}, then the response is successful`, async () => {
      // Given
      const data = test.postData;

      // When
      const response = await client.post(test.path, data);

      // Then
      expect(response.status).toBe(201);
      expect(response.headers.location).toBe(`http://localhost:3002${test.path}/${data.id}`);
      expect(response.data).toStrictEqual(data);
    });

    it(`When calling GET ${test.path}, then the response is successful`, async () => {
      // When
      const response = await client.get(test.path);

      // Then
      expect(response.status).toBe(200);
      expect(response.data).toStrictEqual([
        ...test.existingData,
        test.postData
      ].sort((l, r) => l.id - r.id));
    });

    it(`When calling GET ${test.path}/{id}, then the response is successful`, async () => {
      // Given
      const data = test.existingData[0];

      // When
      const response = await client.get(`${test.path}/${data.id}`);

      // Then
      expect(response.status).toBe(200);
      expect(response.data).toStrictEqual(data);
    });

    it(`When calling GET ${test.path}/{id} with an invalid id, then the request fails`, async () => {
      // When
      const response = await client.get(`${test.path}/0`);

      // Then
      expect(response.status).toBe(404);
      expect(response.data).toStrictEqual({
        error: 'Not Found',
        message: '',
        status: 404
      });
    });

    it(`When calling PUT ${test.path}/{id}, then the response is successful`, async () => {
      // Given
      const data = {
        id: test.postData.id,
        name: 'David'
      };

      // When
      const response = await client.put(`${test.path}/${data.id}`, data);

      // Then
      expect(response.status).toBe(200);
      expect(response.data).toStrictEqual(data);
    });

    it(`When calling PUT ${test.path}/{id} with an invalid id, then the request fails`, async () => {
      // Given
      const data = {
        id: 5,
        name: 'Ed'
      };

      // When
      const response = await client.put(`${test.path}/${data.id}`, data);

      // Then
      expect(response.status).toBe(404);
      expect(response.data).toStrictEqual({
        error: 'Not Found',
        message: '',
        status: 404
      });
    });

    it(`When calling PUT ${test.path}/{id} with a mismatched id, then the request fails`, async () => {
      // Given
      const data = test.existingData[0];

      // When
      const response = await client.put(`${test.path}/0`, data);

      // Then
      expect(response.status).toBe(400);
      expect(response.data).toStrictEqual({
        error: 'Bad Request',
        message: 'body/id must match the id path parameter',
        status: 400
      });
    });

    it(`When calling DELETE ${test.path}/{id}, then the response is successful`, async () => {
      // Given
      const data = test.postData;

      // When
      const response = await client.delete(`${test.path}/${data.id}`);

      // Then
      expect(response.status).toBe(204);
      expect(response.data).toBe('');
    });

    it(`When calling DELETE ${test.path}/{id} with an invalid id, then the request fails`, async () => {
      // When
      const response = await client.delete(`${test.path}/0`);

      // Then
      expect(response.status).toBe(404);
      expect(response.data).toStrictEqual({
        error: 'Not Found',
        message: '',
        status: 404
      });
    });
  });

  it('When calling GET /v1/users/{id}/orders, then the response is successful', async () => {
    // When
    const response = await client.get('/v1/users/1/orders');

    // Then
    expect(response.status).toBe(200);
    expect(response.data).toStrictEqual([
      {
        id: 1,
        productId: 1,
        userId: 1,
        quantity: 1
      }
    ]);
  });

  it('When calling GET /v1/users/{id}/orders with an invalid id, then the request fails', async () => {
    // When
    const response = await client.get('/v1/users/0/orders');

    // Then
    expect(response.status).toBe(404);
    expect(response.data).toStrictEqual({
      error: 'Not Found',
      message: '',
      status: 404
    });
  });
});
