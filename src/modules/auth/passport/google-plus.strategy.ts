import { Injectable, Inject } from '@nestjs/common';
import { Model, Connection } from 'mongoose';
import { use } from 'passport';
import { v1 } from 'uuid';

import { GOOGLE_CONFIG_TOKEN, USER_MODEL_TOKEN, DB_CONNECTION_TOKEN } from '../../../server.constants';
import { IGoogleConfig } from '../interfaces/google-config.interface';
import { IUser } from '../../users/interfaces/user.interface';
import { UserSchema } from '../../users/schemas/user.schema';

import { Request } from 'express';
const GoogleTokenStrategy = require('passport-google-plus-token');

@Injectable()
export class GoogleStrategy {
  private userModel;
  constructor(@Inject(GOOGLE_CONFIG_TOKEN) private readonly googleConfig: IGoogleConfig) {
    this.init();
  }

  private init(): void {
    use('google', new GoogleTokenStrategy({
      passReqToCallback: true,
      clientID: this.googleConfig.client_id,
      clientSecret: this.googleConfig.client_secret
    }, async (req: Request, accessToken: string, refreshToken: string, profile: any, done: Function) => {

      try {
        // Set the provider data and include tokens
        const db = req['dbConnection'];
        this.userModel = db.model(USER_MODEL_TOKEN, UserSchema) as Model<IUser>;
        var providerData = profile._json;
        providerData.accessToken = accessToken;
        providerData.refreshToken = refreshToken;
        const existingUser = await this.userModel.findOne({ email: profile.emails[0].value });

        if (existingUser) {
          return done(null, existingUser);
        }
        // Create the user OAuth profile
        var providerUserProfile = {
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          displayName: profile.displayName,
          email: profile.emails[0].value,
          username: profile.username,
          profileImageURL: (providerData.picture) ? providerData.picture : providerData.image.url,
          provider: 'google',
          providerIdentifierField: 'id',
          providerData: providerData
        };
        if (!providerUserProfile.username) providerUserProfile.username = v1();
        const user = new this.userModel(providerUserProfile);
        done(null, await user.save());
      } catch (ex) {
        done(ex, null);
      }
    }));
  }
}
