import { BadRequestException, NestMiddleware, UnauthorizedException, Injectable, Inject } from '@nestjs/common';
import { Request, Response } from 'express';
import { Model } from 'mongoose';
import { IUser } from '../../users/interfaces/user.interface';
import { MESSAGES, USER_MODEL_TOKEN } from '../../../server.constants';

@Injectable()
export class Verifier implements NestMiddleware {
  constructor(@Inject(`${USER_MODEL_TOKEN}-TEL`) private readonly userModel: Model<IUser>) {}
    async use(req: Request, res: Response, next: Function) {
      const user = await this.userModel.findOne({ email: req.body.email });
      if (!user) next();
      else return next(new UnauthorizedException(MESSAGES.UNAUTHORIZED_EMAIL_OR_USERNAME_IN_USE));
    };
}
