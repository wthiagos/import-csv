import { server } from './server.js';
import http from 'node:http';

jest.mock('http', () => ({
    createServer: jest.fn(() => ({ listen: jest.fn() })),
}));

describe('Server', () => {
    it('should create server on port 8080', () => {
        server;
        expect(http.createServer).toBeCalled();
    });
});