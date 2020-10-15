import { Worker } from '../enum/worker.enum';


export interface RiceBugTask {
  id: string;
  name: string;
  worker: Worker;
  point: number;
  final: boolean;
}
export class RiceBugTaskImp implements RiceBugTask {
  id: string;
  name: string;
  worker: Worker;
  point: number;
  final: boolean;
  constructor(id: string, name: string, worker: Worker, point: number) {
    this.id = id;
    this.name = name;
    this.worker = worker;
    this.point = point;
    this.final = false;
  }
}
