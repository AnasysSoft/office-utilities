import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

export type MethodName = string;   // e.g. 'refresh' | 'openModal' | 'resetForm'

export interface ChildAction {    
  componentUniqueId:any;
  method: MethodName;             // name of the method
  args?: any[];              // optional arguments
}

@Injectable({ providedIn: 'root' })
export class ChildActionService {
  private _action$ = new Subject<ChildAction>();
  action$: Observable<ChildAction> = this._action$.asObservable();

  trigger(componentUniqueId: any, method: MethodName, ...args: any[]) {
    this._action$.next({componentUniqueId, method, args });
  }
}