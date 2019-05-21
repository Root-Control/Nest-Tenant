import { Injectable } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';

@Injectable()
/**
 *  Function for local Observable Variables
 */
export class SharedVariables {
	constructor() {}
  private simpleCounter = new BehaviorSubject<number>(0);

  currentCounterValue = this.simpleCounter.asObservable();

  changeCounterValue(number: number) {
    this.simpleCounter.next(number);
  }
}