import { Injectable } from '@angular/core';
import {State} from './model/State';

@Injectable()
export class CoreService {
  state: State = new State;

  constructor() { }

}
