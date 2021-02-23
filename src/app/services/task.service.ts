import { CookieService } from './cookie.service';
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

  projectList: RiceBugProject[] = taskConfig;
  trainingConfig: RiceBugProject = trainingConfig;

  memberEng = new Map<Worker, number>();
  memberDefaultEng = new Map<Worker, number>();
  memberLevel = 1;

  leAndtoTogether: boolean = false;
  leAndITSTogether: boolean= false;
  rdAndcmTogether: boolean= false;
  supportWorker: Worker = null;

  constructor() {
    this.currentRound = this.rounds[0];
    // this.projectList[0].checkRound = 1;
    this.setMemberDefaultEng();

    if(localStorage.getItem('rounds')){
      this.rounds = JSON.parse(localStorage.getItem('rounds'));
    }

    if(localStorage.getItem('currentRoundID')){
      const currentRoundID = Number(localStorage.getItem('currentRoundID'));
      const currentRound = this.rounds.find(item => item.roundID === currentRoundID);
      if(currentRound){
        this.currentRound = currentRound;
      }
    }
    if(localStorage.getItem('projectList')){
      this.projectList = JSON.parse(localStorage.getItem('projectList'));
    }
    if(localStorage.getItem('trainingConfig')){
      this.trainingConfig = JSON.parse(localStorage.getItem('trainingConfig'));
    }


    if(localStorage.getItem('config')){
      this.config = JSON.parse(localStorage.getItem('config'));
    }
    if(localStorage.getItem('teamName')){
      this.teamName = localStorage.getItem('teamName');
    }
    if(localStorage.getItem('memberLevel')){
      this.memberLevel = Number(JSON.parse(localStorage.getItem('memberLevel')));
      if(this.memberLevel === 2){
        this.setSuperMemberDefaultEng();
      }
    }
    if(localStorage.getItem('leAndtoTogether')){
      this.leAndtoTogether = !!(JSON.parse(localStorage.getItem('leAndtoTogether')));
    }
    if(localStorage.getItem('leAndITSTogether')){
      this.leAndITSTogether = !!(JSON.parse(localStorage.getItem('leAndITSTogether')));
    }
    if(localStorage.getItem('rdAndcmTogether')){
      this.rdAndcmTogether = !!(JSON.parse(localStorage.getItem('rdAndcmTogether')));
    }
    this.setMemberEng();
    this.defaultPoint = this.currentRound.point;
  }

  clearCookie(){
    localStorage.removeItem('rounds');
    localStorage.removeItem('currentRoundID');
    localStorage.removeItem('projectList');
    localStorage.removeItem('trainingConfig');
    localStorage.removeItem('memberEng');
    localStorage.removeItem('memberDefaultEng');
    localStorage.removeItem('config');
    localStorage.removeItem('memberLevel');
    localStorage.removeItem('leAndtoTogether');
    localStorage.removeItem('leAndITSTogether');
    localStorage.removeItem('rdAndcmTogether');
  }



  nextRound(): void {
    const hotfixCase = this.projectList.filter(project=> !project.final && !project.isMainProject && project.price.current <=0 && project.point.current <=0 && project.startRound <= this.currentRound.roundID);
    console.log(hotfixCase, this.currentRound.point);
    hotfixCase.forEach(cas=>{
      this.currentRound.point += cas.point.current;
      this.currentRound.amount += cas.price.current;
    });

    const nextRound = this.rounds[this.currentRound.roundID];

    if(nextRound){
      nextRound.point = this.currentRound.point;
      nextRound.amount = this.currentRound.amount;
      this.currentRound = nextRound;

      this.setMemberEng();
    }
    localStorage.setItem('rounds', JSON.stringify( this.rounds));
    localStorage.setItem('currentRoundID', String(this.currentRound.roundID));
    localStorage.setItem('projectList', JSON.stringify( this.projectList));
    localStorage.setItem('trainingConfig', JSON.stringify( this.trainingConfig));

    localStorage.setItem('memberLevel', JSON.stringify(this.memberLevel));
    localStorage.setItem('config', JSON.stringify( this.config));
    localStorage.setItem('teamName', ( this.teamName));

    localStorage.setItem('leAndtoTogether', JSON.stringify(this.leAndtoTogether));
    localStorage.setItem('leAndITSTogether', JSON.stringify( this.leAndITSTogether));
    localStorage.setItem('rdAndcmTogether', JSON.stringify( this.rdAndcmTogether));

    this.defaultPoint = this.currentRound.point;
  }

  close(project: RiceBugProject, currentRound: Round): void{
    if (project.isMainProject || project.price.current > 0){
      console.log(currentRound.amount, project)
      this.defaultPoint += project.checkRound === currentRound.roundID ?
         project.point.current :  project.point.last ;
      currentRound.amount += project.checkRound === currentRound.roundID ?
      project.price.current :  project.price.last ;
      currentRound.point = this.defaultPoint;
      console.log(currentRound.amount)
    }
    project.final = true;
  }

  checkinTask(id: string): void {
    this.checkConfigUpdate(id);
    console.log(id)
    let projectID = +id.split('-')[0]-1;
    if(projectID === 18){
      // 進入員工訓練
      console.log(id)
      this.updateTraining(id);
      this.checkTrainingIsDone()
      return ;
    }

    const allTaskList: RiceBugTask[] = [].concat.apply([], [...this.projectList.map(project=> project.taskList)]); ;
    console.log(allTaskList);
    const currentTask = allTaskList.find(item=> item.id === id);
    console.log(currentTask)

    if(!currentTask){
      return;
    }



    if(projectID > 18){
      projectID = projectID-1;
    }
    console.log(projectID)
    this.checkConfigUpdate(id);
    const project: RiceBugProject = this.projectList[projectID];
    console.log(project);
    if (project) {
      console.log('inin')
      this.updateMemberEngWhenFinalProject(project, id);
      this.checkProjectIsDone(project);
    }

    new Audio('assets/sc.mp3').play();
  }

  removeTask(id: string): void {
    const allTaskList: RiceBugTask[] = [].concat.apply([], [...this.projectList.map(project=> project.taskList)]); ;
    console.log(allTaskList);
    const currentTask = allTaskList.find(item=> item.id === id);
    console.log(currentTask)

    if(!currentTask){
      return;
    }

    if(currentTask.final){
      if(currentTask.worker === Worker.RO || currentTask.worker === Worker.CFO){
        this.memberEng.set(Worker.RO, this.memberEng.get(Worker.RO) + currentTask.point);
        this.memberEng.set(Worker.CFO, this.memberEng.get(Worker.CFO) + currentTask.point);
      } else {
        this.memberEng.set(currentTask.worker, this.memberEng.get(currentTask.worker) + currentTask.point);
      }

      currentTask.final = false;
    }

  }

  superTraining(member1: Worker, member2: Worker){
    if(member1 === Worker.LE && member2 === Worker.TO && this.leAndtoTogether === false) {
      this.superTrainingMember(member1, member2);
      this.leAndtoTogether = true;
    }

    if(member1 === Worker.LE && member2 === Worker.ITSUPORT && this.leAndITSTogether === false) {
      this.superTrainingMember(member1, member2);
      this.leAndITSTogether = true;
    }

    if(member1 === Worker.RD && member2 === Worker.CM && this.rdAndcmTogether === false) {
      this.superTrainingMember(member1, member2);
      this.rdAndcmTogether = true;
    }
  }

  setSuperWorker(member1: Worker){
    if(this.supportWorker === member1){
      this.supportWorker = null;
    } else {
      this.supportWorker = member1;
    }
  }

  private superTrainingMember(member1: Worker, member2: Worker) {
    if (this.memberEng.get(member1) - 2 > 0 && this.memberEng.get(member2) - 2 > 0) {
      this.memberEng.set(member1, this.memberEng.get(member1) - 2);
      this.memberEng.set(member2, this.memberEng.get(member2) - 2);
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
    let taskID = +id.split('-')[1] - 1;
    console.log(id)
    let task: RiceBugTask = project.taskList.find(item=> item.id === id);
    console.log(project.name)
    // if(project.name === '蝦米購物 無法登入'){
    //   console.log(task)
    //   if(taskID > 3){
    //     task = project.taskList[taskID -1];
    //     console.log(task)
    //   }
    // }
    console.log(task)
    if (task && task.final === false) {
      let currentWorker: Worker = task.worker;
      console.log(currentWorker)
      if(this.supportWorker!== null) {
        currentWorker = this.supportWorker;
      }
      console.log(currentWorker)
      if(this.memberEng.get(currentWorker) - task.point < 0){
        alert(currentWorker+'沒有體力摟');
        return;
      } else{
        task.final = true;
        if(currentWorker === Worker.RO || currentWorker === Worker.CFO){
          this.memberEng.set(Worker.RO, this.memberEng.get(Worker.RO)-task.point);
          this.memberEng.set(Worker.CFO, this.memberEng.get(Worker.CFO)-task.point);
        }else {
          this.memberEng.set(currentWorker, this.memberEng.get(currentWorker)-task.point);
        }
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
    console.log('updateConfig')
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
    } else if(this.config[config] === level){
      return;
    } else{
      alert(`請先升級${config}:level${level}`);
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
    this.memberDefaultEng.set(Worker.ITSUPORT, 30);
    this.memberDefaultEng.set(Worker.TO, 40);
    this.memberLevel = 2;
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
