import {Component, OnInit} from '@angular/core';
import {DateService} from '../shared/date.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ITask, TasksService} from '../shared/tasks.service';
import {switchMap} from 'rxjs';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss']
})
export class OrganizerComponent implements OnInit {
  tasks: ITask[] = []
  form = new FormGroup({
    title: new FormControl('', Validators.required),
  })

  constructor(public dateService: DateService, public tasksService: TasksService) {
  }

  ngOnInit() {
    this.dateService.date.pipe(
      switchMap(value => this.tasksService.load(value))
    ).subscribe({next: tasks => this.tasks = tasks})
  }

  submit() {
    const {title} = this.form.value;

    if (!title) return;

    const task: ITask = {
      title,
      date: this.dateService.date.value.format('DD-MM-YYYY')
    }

    this.tasksService.create(task).subscribe({
      next: task => {
        this.tasks.push(task);
        this.form.reset()
      },
      error: err => console.log(err)
    })
  }

  remove(task: ITask) {
    this.tasksService.remove(task).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== task.id)
      },
      error: err => console.log(err)
    },)
  }
}
