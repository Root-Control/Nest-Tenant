import { Injectable, Inject, HttpException, HttpStatus, Scope } from '@nestjs/common';
import { Model } from 'mongoose';

import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

export class DoStuff {
    constructor() {
    	console.log('do stuff called');
    }
}