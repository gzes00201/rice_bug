import { Round } from './../classes/round';
import { Worker } from './../enum/worker.enum';
import { RiceBugTask } from './../model/RiceBugTask';
import { RiceBugProject, ServerConfig } from '../model/RiceBugProject';
import { Injectable } from '@angular/core';
import { taskConfig, trainingConfig } from './task-config';

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

  projectList: RiceBugProject[] = taskConfig.filter(task => task.startRound === 1) ;
  trainingConfig: RiceBugProject = trainingConfig;

  memberEng = new Map<Worker, number>();
  memberDefaultEng = new Map<Worker, number>();

  constructor() {
    this.currentRound = this.rounds[0];
    this.projectList[0].checkRound = 1;
    this.setMemberDefaultEng();
    this.setMemberEng();
  }



  nextRound(): void {
    const hotfixCase = this.projectList.filter(project=> !project.final && !project.isMainProject);
    hotfixCase.forEach(cas=>{
      this.currentRound.point += cas.point.current;
      this.currentRound.amount += cas.price.current;
    });

    const nextRound = this.rounds[this.currentRound.roundID];

    if(nextRound){
      nextRound.point = this.currentRound.point;
      nextRound.amount = this.currentRound.amount;
      this.currentRound = nextRound;

      const projectList: RiceBugProject[] = taskConfig.filter(task => task.startRound === nextRound.roundID) ;
      projectList.forEach(task=>{
        this.projectList.push(task);
      });

      this.setMemberEng();
    }

  }

  close(project: RiceBugProject, currentRound: Round): void{
    if (project.isMainProject){
      this.defaultPoint += project.checkRound === currentRound.roundID ?
         project.point.current :  project.point.last ;
      currentRound.amount += project.checkRound === currentRound.roundID ?
      project.price.current :  project.price.last ;
      currentRound.point = this.defaultPoint;
    }
    project.final = true;
  }

  checkinTask(id: string): void {
    console.log(id)
    const projectID = +id.split('-')[0]-1;
    if(projectID === 18){
      // 進入員工訓練
      console.log(id)
      this.updateTraining(id);
      this.checkTrainingIsDone()
      return ;
    }

    this.checkConfigUpdate(id);
    const project: RiceBugProject = this.projectList[projectID];
    if (project) {
      this.updateMemberEngWhenFinalProject(project, id);
      this.checkProjectIsDone(project);
    }
  }

  private updateTraining(id: string){
    const traing = this.trainingConfig.taskList.find(item=> item.id === id);
    if(traing){
      console.log(traing)
      traing.final = true;
      this.memberEng.set(traing.worker, this.memberEng.get(traing.worker)-traing.point);
    }
  }

  private checkTrainingIsDone() {
    if(this.trainingConfig.taskList.filter(item=> item.final).length === this.trainingConfig.taskList.length){
      // 完成教育訓練
      this.trainingConfig.done = true;
      this.setSuperMemberDefaultEng();
    }
  }

  private updateMemberEngWhenFinalProject(project: RiceBugProject, id: string) {
    const task: RiceBugTask = project.taskList[+id.split('-')[1] - 1];
    if (task && task.final === false) {
      if(this.memberEng.get(task.worker) - task.point < 0){
        alert(task.worker+'沒有體力摟');
        return;
      } else{
        task.final = true;
        this.memberEng.set(task.worker, this.memberEng.get(task.worker)-task.point);
      }

    }
  }

  private checkProjectIsDone(project: RiceBugProject): void{
    const isPojectDone = project.taskList.filter(tak => tak.final).length === project.taskList.length;
    if(project.config){
      const isConfigDone = this.config.config >= project.config.config &&  this.config.proxy >= project.config.proxy  && this.config.server >= project.config.server
      project.done = isPojectDone && isConfigDone ;
    } else {
      project.done = isPojectDone ;
    }
  }


  private checkConfigUpdate(id: string) {
    const configList = ['server', 'config', 'proxy'];
    configList.forEach(config => {
      if (id.includes(config)) {
        this.updateConfig(config, +id.replace(config, ''));
      }
    });
  }

  private updateConfig(config: string, level: number){
    if(config === 'config' && this.memberEng.get(Worker.ITSUPORT) <= 0){
        alert('IT Suport 沒有體力摟');
        return;
    }
    if(config === 'proxy' && this.memberEng.get(Worker.TO) <= 0){
      alert('To 沒有體力摟');
      return;
    }
    if(config === 'server' && this.memberEng.get(Worker.TO) <= 0){
      alert('To 沒有體力摟');
      return;
    }
    console.log(this.config[config], level)
    if( this.config[config] - level <= -1){
      this.config[config] = level;
      this.projectList.forEach(project=> this.checkProjectIsDone(project));
    } else {
      alert(`請先升級${config}:level${level-1}`);
    }

    this.updateMemberEngWhenUpdateConfig(config);
  }

  updateMemberEngWhenUpdateConfig(config: string) {
    console.log(config);
    if(config === 'config' && this.memberEng.get(Worker.ITSUPORT) >= 0){
      console.log(this.memberEng.get(Worker.ITSUPORT));
      this.memberEng.set(Worker.ITSUPORT, this.memberEng.get(Worker.ITSUPORT)-1);
      return;
    }
    if(config === 'proxy' && this.memberEng.get(Worker.TO) >= 0){
      this.memberEng.set(Worker.TO, this.memberEng.get(Worker.TO)-1);
      return;
    }
    if(config === 'server' && this.memberEng.get(Worker.TO) >= 0){
      this.memberEng.set(Worker.TO, this.memberEng.get(Worker.TO)-1);
      return;
    }
  }

  private setMemberDefaultEng() {
    this.memberDefaultEng.set(Worker.RO, 10);
    this.memberDefaultEng.set(Worker.CFO, 10);
    this.memberDefaultEng.set(Worker.RD, 25);
    this.memberDefaultEng.set(Worker.CM, 25);
    this.memberDefaultEng.set(Worker.LE, 10);
    this.memberDefaultEng.set(Worker.ITSUPORT, 30);
    this.memberDefaultEng.set(Worker.TO, 40);
  }
  private setSuperMemberDefaultEng() {
    this.memberDefaultEng.set(Worker.RO, 10);
    this.memberDefaultEng.set(Worker.CFO, 10);
    this.memberDefaultEng.set(Worker.RD, 40);
    this.memberDefaultEng.set(Worker.CM, 40);
    this.memberDefaultEng.set(Worker.LE, 10);
    this.memberDefaultEng.set(Worker.ITSUPORT, 15);
    this.memberDefaultEng.set(Worker.TO, 20);
  }
  private setMemberEng() {
    this.memberEng.set(Worker.RO, this.memberDefaultEng.get(Worker.RO));
    this.memberEng.set(Worker.CFO, this.memberDefaultEng.get(Worker.CFO));
    this.memberEng.set(Worker.RD, this.memberDefaultEng.get(Worker.RD));
    this.memberEng.set(Worker.CM, this.memberDefaultEng.get(Worker.CM));
    this.memberEng.set(Worker.LE, this.memberDefaultEng.get(Worker.LE));
    this.memberEng.set(Worker.ITSUPORT, this.memberDefaultEng.get(Worker.ITSUPORT));
    this.memberEng.set(Worker.TO, this.memberDefaultEng.get(Worker.TO));
  }
}
