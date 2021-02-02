import { RiceBugTask } from './RiceBugTask';

export interface ServerConfig {
  server: number;
  config: number;
  proxy: number;
}

export interface RiceBugProject {
  startRound: number;
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
  config?: ServerConfig;
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
  done: boolean;
  final: boolean;
  constructor(
    public startRound: number,
    name: string,
    public isMainProject: boolean,
    public point: PointLevel,
    public price: PointLevel,
    taskList?: RiceBugTask[],
    public config?: ServerConfig) {
    this.checkRound = this.startRound;
    this.name = name;

    this.taskList = taskList ? taskList : [];
    this.done = false;
    this.final = false;
  }
}
