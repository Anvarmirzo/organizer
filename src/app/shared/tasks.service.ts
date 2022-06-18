import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs';
import * as moment from 'moment';

export interface ITask {
  id?: string;
  title: string;
  date?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  static url = 'https://calendar-dea16-default-rtdb.firebaseio.com/tasks'

  constructor(public http: HttpClient) {
  }

  create(task: ITask) {
    return this.http
      .post<{ name: string }>(`${TasksService.url}/${task.date}.json`, task)
      .pipe(map(res => ({...task, id: res.name})))
  }

  load(date: moment.Moment) {
    return this.http
      .get<ITask[]>(`${TasksService.url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(map((tasks) => {
        if (!tasks) return []

        return Object.keys(tasks).map((key: any) => ({...tasks[key], id: key}))
      }))
  }

  remove(task: ITask) {
    return this.http
      .delete(`${TasksService.url}/${task.date}/${task.id}.json`)
  }
}
