
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Post } from './posts/post';

@Injectable()
export class PostDataService {

  public globalPostData$: Observable<Post> | undefined;
  private globalPostDataSubject = new Subject<any>();

  public valueIfPost$ = new Subject<boolean>();

  constructor() {
    this.globalPostData$ = this.globalPostDataSubject.asObservable();
   }
   obersevePostData(data: any) {
    this.globalPostDataSubject.next(data);
    this.valueIfPost$.next(data);
   }
   obersevevalueIfPost(data: boolean) {
    this.valueIfPost$.next(data);
   }

}