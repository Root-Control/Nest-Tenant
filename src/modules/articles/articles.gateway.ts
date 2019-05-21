import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayInit
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@WebSocketGateway()

export class ArticlesGateway implements OnGatewayInit {
  @WebSocketServer() server;

  constructor() {
    console.log('initializing');
  }

  afterInit() {
  }

  sendArticlesListFromSocket(articles) {
    return this.server.emit('articles', { message: 'from controller' });
  }

  sendCreatedArticle(article) {
    return this.server.emit('articleChannel', { article });
  }

  /*
   *  Explicación de proceso
   *  1.- Creamos un socket llamado articles, el cual al ser llamado ejecutará una respuesta
   */
  @SubscribeMessage('articles')
  findAll(client, data) {
    return this.server.emit('articles', { message: 'works' });
  }
}