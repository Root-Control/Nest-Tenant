import {
  BadRequestException,
  NestMiddleware, 
  Injectable, 
  Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { validate } from 'joi';
import { articleSchema } from '../../articles/joi/article.joi';

import { Model, Types } from 'mongoose';
import { IArticle } from '../../articles/interfaces/article.interface';
import { MESSAGES, ARTICLE_MODEL_TOKEN } from '../../../server.constants';

@Injectable()
/**
 *  Article By Id Middleware
 *  We validating if the Id provided is valid, and returning the found article in the variable req.article
 */
export class articleValidatorMiddleware implements NestMiddleware {
  constructor() {
  }
  async use(req, res, next: Function) {
    const result = validate(req.body, articleSchema);

    if (result.error) {
      const errorMessage = result.error.details.shift().message;
      const message: string = errorMessage.replace(/["]/g, '');

      return next(new BadRequestException(`Validation failed: ${message}`));
    }
    next();
  }
}
