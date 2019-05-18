import { Injectable, Inject } from '@nestjs/common';
import { Model, Connection } from 'mongoose';
import { use } from 'passport';

import { USER_MODEL_TOKEN, TWITTER_CONFIG_TOKEN, DB_CONNECTION_TOKEN } from '../../../server.constants';
import { IUser } from '../../users/interfaces/user.interface';
import { UserSchema } from '../../users/schemas/user.schema';

import { Request } from 'express';

import { ITwitterConfig } from '../interfaces/twitter-config.interface';

import { Tenant } from '../../../common/helpers/tenant-model';

const TwitterTokenStrategy = require('passport-twitter-token');

@Injectable()
export class TwitterStrategy {
  private userModel;
  constructor(
    @Inject(TWITTER_CONFIG_TOKEN) private readonly twitterConfig: ITwitterConfig,
    @Inject(DB_CONNECTION_TOKEN) private readonly connection: Connection
  ) {
    this.init();
  }

  private init(): void {
    use('twitter', new TwitterTokenStrategy({
      passReqToCallback: true,
      consumerKey: this.twitterConfig.consumer_key,
      consumerSecret: this.twitterConfig.consumer_secret
    }, async (req: Request, accessToken: string, refreshToken: string, profile: any, done: Function) => {
      try {
        const params = { request: req, connection: this.connection, model: USER_MODEL_TOKEN, schema: UserSchema };
        this.userModel = new Tenant<Model<IUser>>(params).getModel();
        const existingUser: IUser = await this.userModel.findOne({ 'twitter.id': profile.id });

        if (existingUser) {
          return done(null, existingUser);
        }

        const { id, username, displayName } = profile;
        const user: IUser = new this.userModel({
          method: 'twitter',
          roles: ['user'],
          displayName,
          twitter: {
            id,
            username
          }
        });

        done(null, await user.save());
      } catch (err) {
        done(err, null);
      }
    }));
  }
}
