import { Round } from './../classes/round';
import { Worker } from './../enum/worker.enum';
import { RiceBugTask, RiceBugTaskImp } from './../model/RiceBugTask';
import { RiceBugProject, RiceBugProjectImp, ServerConfig } from '../model/RiceBugProject';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  teamName = '';
  currentRound: Round;
  defaultPoint = 20;

  config: ServerConfig = {
    server: 0,
    config: 0,
    proxy: 0
  };

  rounds: Round[] = [
    new Round(1, 5000),
    new Round(2, 10000),
    new Round(3, 10000),
    new Round(4, 10000),
  ];

  projectList: RiceBugProject[] = [
    new RiceBugProjectImp('第一個專案', true,
    { current: 3, last: 1 },
    { current: 5000, last: 5000 },[
      new RiceBugTaskImp('0-0', '第一個任務', Worker.RD, 2),
      new RiceBugTaskImp('0-1', '第二個任務', Worker.CM, 2),
    ]),
    new RiceBugProjectImp('第二個專案', false,
    { current: 0, last: 0 },
    { current: 2000, last: 1000 }, [
      new RiceBugTaskImp('0-0', '第一個任務', Worker.RD, 2),
      new RiceBugTaskImp('0-1', '第二個任務', Worker.CM, 2),
    ]),
    new RiceBugProjectImp('第三個專案', false,
    { current: 0, last: 0 },
    { current: 0, last: 0 }, [
      new RiceBugTaskImp('0-0', '第一個任務', Worker.RD, 2),
      new RiceBugTaskImp('0-1', '第二個任務', Worker.CM, 2),
    ]),
  ];

  constructor() {
    this.currentRound = this.rounds[0];
    this.projectList[0].checkRound = 1;
  }

  nextRound(): void {
    this.currentRound = this.rounds[this.currentRound.roundID];
  }

  close(project: RiceBugProject, currentRound: Round): void{
    if (project.checkRound !== 0 && project.isMainProject){
      this.defaultPoint += project.checkRound === currentRound.roundID ?
         project.point.current :  project.point.last ;
      currentRound.amount += project.checkRound === currentRound.roundID ?
      project.price.current :  project.price.last ;
      currentRound.point = this.defaultPoint;
    }
    project.final = true;
    console.log(currentRound);
  }

  checkinTask(id: string): void {
    const project: RiceBugProject = this.projectList[id.split('-')[0]];
    if (project) {
      const task: RiceBugTask = project.taskList[id.split('-')[1]];
      if (task && task.final === false) {
        console.log(task);
        task.final = true;
      }
      this.checkProjectIsDone(project);
    }
  }

  private checkProjectIsDone(project: RiceBugProject): void{
    project.done = project.taskList.map(tak => tak.final).length === project.taskList.length;
  }
}
