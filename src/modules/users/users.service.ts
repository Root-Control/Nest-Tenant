import { Injectable, Inject } from '@nestjs/common';
import { Model, Connection } from 'mongoose';

import { USER_MODEL_TOKEN, SERVER_CONFIG, DB_CONNECTION_TOKEN } from '../../server.constants';
import { IUser } from './interfaces/user.interface';
import { UserSchema } from './schemas/user.schema';

import { isEmptyObject } from '../../common/helpers/utils';

import { parseImageURL } from '../../common/helpers/converters';

import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

import { Tenant } from '../../common/helpers/tenant-model';

@Injectable()
export class UserService {
  private params;
  constructor(@Inject(DB_CONNECTION_TOKEN) private readonly connection: Connection,
              @Inject(REQUEST) private readonly request: Request) {
    this.params = { request, connection, model: USER_MODEL_TOKEN, schema: UserSchema };
}

  async me(userModel: IUser) {
  	return userModel;
  }
  
  async getUsers(query?): Promise<IUser[]> {
    const userModel = new Tenant<Model<IUser>>(this.params).getModel();
    return await userModel.find(query).select('-local.salt  -local.hashedPassword');
  }

  async updateProfileImage(user, file): Promise<IUser> {
    user.profileImageURL = file.location || `/${parseImageURL(file.path)}`;
    return await user.save();
  }

  async getUserById(userId): Promise<IUser> {
    const userModel = new Tenant<Model<IUser>>(this.params).getModel();
    return await userModel.findById(userId).select('-salt -password');
  }

  async deleteUser(user) {
    return await user.remove();
  }

  async updateUser(user, body) {
    const google = user.google.id;
    const local = user.local.email;
    const twitter = user.twitter.id;
    const facebook = user.facebook.id;

    if(google) {
      //  Do stuff updating google
    } else if (twitter) {
      //  Do stuff updating twitter
    } else if (facebook) {
      //  Do stuff updating facebook
    } else {
      //  Do stuff updating local
    }
    return user;
  }
}