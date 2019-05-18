import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

import { DatabaseModule } from '../../database';
import { UsersController } from './users.controller';
import { userProviders } from './users.providers';
import { UserService } from './users.service';

import { UserIdMiddleware } from './middlewares/userbyId.middleware';
//  Middlewares

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [
    ...userProviders,
    UserService
  ],
  exports: [
    ...userProviders
  ]
})
export class UsersModule implements NestModule {
    constructor() {
      // code...
      console.log('users module loaded');
    }
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserIdMiddleware)
      .forRoutes({ path: 'users/:id', method: RequestMethod.ALL });
      //  users id calling middleware for findById users before run another methods like "delete/update/read"
  }
}
