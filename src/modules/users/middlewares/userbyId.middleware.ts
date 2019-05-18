import { 
  BadRequestException,
  UnauthorizedException,
  NestMiddleware, 
  Injectable, 
  Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { Model, Types, Connection } from 'mongoose';
import { IUser } from './../interfaces/user.interface';
import { UserSchema } from './../schemas/user.schema';


import { MESSAGES, USER_MODEL_TOKEN, DB_CONNECTION_TOKEN } from '../../../server.constants';

import { REQUEST } from '@nestjs/core';

import { Tenant } from '../../../common/helpers/tenant-model';

@Injectable()
export class UserIdMiddleware implements NestMiddleware {
  private userModel;
  constructor(@Inject(DB_CONNECTION_TOKEN) private readonly connection: Connection) {
  }
    async use(request, response, next: Function) {
      const params = { request, connection: this.connection, model: USER_MODEL_TOKEN, schema: UserSchema };
      this.userModel = new Tenant<Model<IUser>>(params).getModel();
      const allowedRoutes = ['me', 'upload'];
      const isAllowedRoute = (allowedRoutes.indexOf(request.params.id) > -1);
      if(isAllowedRoute) return next();

      else if(!Types.ObjectId.isValid(request.params.id)) return next(new UnauthorizedException('User is invalid'));
      const user = await this.userModel.findById(request.params.id).select('-local.salt  -local.hashedPassword');
      if (user) {
        request.model = user;
        next();
      }
      else return next(new UnauthorizedException('No user with that identifier has been found'));
    };
}

