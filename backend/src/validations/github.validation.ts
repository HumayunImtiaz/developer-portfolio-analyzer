import { z } from 'zod';

export const analyzeSchema = z.object({
  body: z.object({
    username: z.string({
      required_error: 'Username is required',
    })
    .min(1, 'Username must be at least 1 character')
    .max(39, 'Username cannot exceed 39 characters')
    .regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i, 'Invalid GitHub username'),
  }),
});

export const compareSchema = z.object({
  body: z.object({
    username1: z.string({
      required_error: 'username1 is required',
    }).regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i, 'Invalid GitHub username1'),
    username2: z.string({
      required_error: 'username2 is required',
    }).regex(/^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i, 'Invalid GitHub username2'),
  }),
});
