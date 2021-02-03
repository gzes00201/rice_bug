import { TaskService } from './../services/task.service';
import { Component, OnInit } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Worker } from './../enum/worker.enum';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  countDown: number;
  Worker = Worker;
  constructor(public taskService: TaskService) {
    this.countDown = 0;
  }

  ngOnInit(): void {
    // this.taskService.currentRound.isPlanDone = true;
    // this.taskService.currentRound.isWorkDone = true;
    // this.taskService.projectList[0].done= true;
    // this.taskService.projectList[0].taskList[0].final = true;
    // this.taskService.projectList[0].taskList[1].final = true;
    // this.taskService.currentRound.isWorkDone = true;
    const teamName = localStorage.getItem('teamName');
    this.taskService.teamName = teamName;
  }

  changeName(name: string): void {
    this.taskService.teamName = name;
    localStorage.setItem('teamName', this.taskService.teamName);
  }
  nextRund(): void{
    this.taskService.nextRound();

  }
  doPlan(): void {
    if (this.countDown > 0) {
      return;
    }
    this.startCountDown().subscribe(
      () => this.countDown--,
      err => console.log(err),
      () => {
        this.taskService.currentRound.isPlanDone = true;
        this.countDown = 0;
      }
    );
  }


  doWork(): void {
    if (this.countDown > 0) {
      return;
    }
    this.startCountDown().subscribe(
      () => this.countDown--,
      err => console.log(err),
      () => {
        this.taskService.currentRound.isWorkDone = true;
        this.countDown = 0;
      }
    );
  }
  done(id) {
    this.taskService.checkinTask(id);
  }

  remove(id){
    this.taskService.removeTask(id);
  }

  private startCountDown(): Observable<number> {
    // 20分鐘
    this.countDown = 1200;
    return interval(1000).pipe(
      take(10),
      tap(() => {
        if (this.countDown === 600) {
          new Audio('assets/rain.mp3').play();
        }
      })
    );
  }
}
