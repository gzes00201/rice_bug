import { RiceBugTask } from './RiceBugTask';

export interface ServerConfig {
  server: number;
  config: number;
  proxy: number;
}

export interface RiceBugProject {
  isMainProject: boolean;
  checkRound: number;
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
  config: ServerConfig;
  done: boolean;
  final: boolean;
}

export interface PointLevel {
  current: number;
  last: number;
}
export class RiceBugProjectImp implements RiceBugProject {
  checkRound: number;
  name: string;

  taskList: RiceBugTask[];
  config: { server: number; config: number; proxy: number; };
  done: boolean;
  final: boolean;
  constructor(
    name: string,
    public isMainProject: boolean,
    public point: PointLevel,
    public price: PointLevel,
    taskList?: RiceBugTask[]) {
    this.checkRound = 0;
    this.name = name;

    this.taskList = taskList ? taskList : [];
    this.config = { server: 0, config: 1, proxy: 0, };
    this.done = false;
    this.final = false;
  }
}
