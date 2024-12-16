import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
        email: string;
        iat: number;
        exp: number;
      };
    }
  }
}
