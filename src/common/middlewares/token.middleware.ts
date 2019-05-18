import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response } from 'express';

import * as chalk from 'chalk';
import { Model, Connection } from 'mongoose';
import { verify } from 'jsonwebtoken';

import { USER_MODEL_TOKEN, SERVER_CONFIG, DB_CONNECTION_TOKEN } from '../../server.constants';
import { IUser } from '../../modules/users/interfaces/user.interface';
import { UserSchema } from '../../modules/users/schemas/user.schema';

import { Tenant } from '../helpers/tenant-model';
@Injectable()
export class TokenMiddleware implements NestMiddleware {
	private userModel;
	constructor(@Inject(DB_CONNECTION_TOKEN) private readonly connection: Connection) {
	}	
  	async use(req: Request, res: Response, next: Function) {
  		req['database'] = this.connection.useDb('HIR');
  		const params = { request: req, connection: this.connection, model: USER_MODEL_TOKEN, schema: UserSchema };
  		this.userModel = new Tenant<Model<IUser>>(params).getModel();
		req.user = {};
		let parsedToken = {};
		const token: any = req.headers.authorization || req.headers.Authorization;
		if (token) {
			try {
				parsedToken = verify(token, SERVER_CONFIG.jwtSecret);
				req.user =  await this.userModel.findById(parsedToken['_id']).select('-salt -password');
				console.log(req.user);
			} catch (ex) {
				return res.status(500).send(ex);
			}
		}
		next();
	}
}