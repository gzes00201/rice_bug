import { Worker } from './../enum/worker.enum';
import { RiceBugTask, RiceBugTaskImp } from './../model/RiceBugTask';
import { RiceBugProject, RiceBugProjectImp } from '../model/RiceBugProject';
import { Injectable } from '@angular/core';
import { threadId } from 'worker_threads';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  currentRound = 0;
  projectList: RiceBugProject[] = [
    new RiceBugProjectImp('第一個專案', [
      new RiceBugTaskImp('0-0', '第一個任務', Worker.RD, 2),
      new RiceBugTaskImp('0-1', '第二個任務', Worker.CM, 2),
    ]),
    new RiceBugProjectImp('第二個專案', [
      new RiceBugTaskImp('0-0', '第一個任務', Worker.RD, 2),
      new RiceBugTaskImp('0-1', '第二個任務', Worker.CM, 2),
    ]),
    new RiceBugProjectImp('第三個專案', [
      new RiceBugTaskImp('0-0', '第一個任務', Worker.RD, 2),
      new RiceBugTaskImp('0-1', '第二個任務', Worker.CM, 2),
    ]),
  ];
  constructor() { }

  checkinTask(id: string): void {
    const project: RiceBugProject = this.projectList[id.split('-')[0]];
    if (project){
      const task: RiceBugTask = project.taskList[id.split('-')[1]];
      if (task && task.final === false){
        console.log(task);
        task.final = true;
      }
    }
  }
}
