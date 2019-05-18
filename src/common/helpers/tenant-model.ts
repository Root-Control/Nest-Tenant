import { Request, Response } from 'express';

import * as chalk from 'chalk';
import { Model, Connection } from 'mongoose';
import { verify } from 'jsonwebtoken';

export class Tenant<T> {
	public model;
	constructor(params) {
		// logica con req.headers domain
		const db = params.connection.useDb('AMS');
        this.model = db.model(params.model, params.schema) as T;		
	}

	getModel() {
		return this.model;
	}
}