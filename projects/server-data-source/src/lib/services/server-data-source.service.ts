import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerDataSourceService<T> {
  private deletedItem: ReplaySubject<T> = new ReplaySubject<T>()

  private updatedItem: ReplaySubject<T> = new ReplaySubject<T>()

  public getDeletedItem(): Observable<T> {
    return this.deletedItem.asObservable()
  }

  public nextDeletedItem(item: T): void {
    this.deletedItem.next(item)
  }

  public getUpdatedItem(): Observable<T> {
    return this.updatedItem.asObservable()
  }

  public nextUpdatedItem(item: T): void {
    this.updatedItem.next(item)
  }
}
