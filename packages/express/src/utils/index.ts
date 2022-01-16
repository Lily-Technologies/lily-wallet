import { Response } from 'express';

export const sendError = (res: Response, message: string, code: number = 500) => {
  res.status(code).json({
    message
  });
};

export * from 'src/utils/setInitialConfig';
