import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ComService {
  subject: Subject<string> = new Subject<string>();
  ob: Observable<string> = this.subject.asObservable();

  public send(data) {
    this.subject.next(data);
  }

  public getOb(): Observable<string> {
    return this.ob;
  }

  constructor() {}
}
