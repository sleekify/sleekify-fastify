import axios, { type AxiosInstance } from 'axios';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { execSyncWithOutput } from '../helper';

describe('Integration test example 1-hello-world', () => {
  let childProcess: any;
  let client: AxiosInstance;

  beforeAll(async () => {
    const examplePath = `examples${path.sep}1-hello-world`;

    execSyncWithOutput(`cd ${examplePath} && npm install`);
    execSyncWithOutput(`cd ${examplePath} && npm run build`);
    execSyncWithOutput(`cd ${examplePath} && npm run lint -- --fix`);

    childProcess = spawn('node', [`dist${path.sep}src${path.sep}index.js`], {
      cwd: examplePath,
      detached: true
    });

    client = axios.create({
      baseURL: 'http://localhost:3001',
      headers: { 'content-type': 'application/json' },
      validateStatus: () => true
    });

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }, 120000);

  afterAll(async () => {
    if (childProcess !== undefined) {
      childProcess.kill();
    }
  });

  it('When calling GET /v1/hello/Bob, then the response is successful', async () => {
    // When
    const response = await client.get('/v1/hello/Bob');

    // Then
    expect(response.status).toBe(200);
    expect(response.data).toStrictEqual({
      message: 'hello Bob!'
    });
  });
});
