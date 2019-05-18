import {
  UnauthorizedException,
  NestMiddleware, 
  Injectable, 
  Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { Model, Types, Connection } from 'mongoose';
import { IArticle } from './../interfaces/article.interface';
import { ArticleSchema } from './../schemas/article.schema';

import { MESSAGES, ARTICLE_MODEL_TOKEN, DB_CONNECTION_TOKEN } from '../../../server.constants';

import { Tenant } from '../../../common/helpers/tenant-model';
@Injectable()
/**
 *  Article By Id Middleware
 *  We validating if the Id provided is valid, and returning the found article in the variable req.article
 */
export class ArticleIdMiddleware implements NestMiddleware {
  private articleModel;
  constructor(@Inject(DB_CONNECTION_TOKEN) private readonly connection: Connection) {
  }
  async use(request, response, next: Function) {
      const params = { request, connection: this.connection, model: ARTICLE_MODEL_TOKEN, schema: ArticleSchema };
      this.articleModel = new Tenant<Model<IArticle>>(params).getModel();

      if(!Types.ObjectId.isValid(request.params.articleId)) return next(new UnauthorizedException('Invalid identifier'));
      const article = await this.articleModel.findById(request.params.articleId);
      if (article) {
        request.article = article;
        next();
      }
      else return next(new UnauthorizedException('No article with that identifier has been found'));
  }
}
