import { RiceBugTask } from './RiceBugTask';

export interface RiceBugProject {
  name: string;
  point: {
    current: number;
    last: number;
  };
  price: {
    current: number;
    last: number;
  };
  taskList: RiceBugTask[];
  config: {
    server: number;
    config: number;
    proxy: number;
  };
  done: boolean;
}
export class RiceBugProjectImp implements RiceBugProject {
  name: string;
  point: { current: number; last: number; };
  price: { current: number; last: number; };
  taskList: RiceBugTask[];
  config: { server: number; config: number; proxy: number; };
  done: boolean;
  constructor(name: string, taskList?: RiceBugTask[]) {
    this.name = name;
    this.point = { current: 0, last: 0 };
    this.price = { current: 0, last: 0 };
    this.taskList = taskList ? taskList : [];
    this.config = { server: 0, config: 1, proxy: 0, };
    this.done = false;
  }
}
