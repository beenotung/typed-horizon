declare module 'horizon' {
  import * as Rx from 'rxjs';
  namespace horizon {
    export interface Horizon {
      find<A>(): Rx.Observable<A>;

      call<A>(_this: Horizon, table: string): TableObject<A>;

      <A> (name: string): TableObject<A>;

      currentUser(): TableQuery<any>;

      hasAuthToken(): boolean;

      connect(): void;

      onReady(f: Function): void;

      onDisconnected(f: Function): void;

      onSocketError(f: (error: any)=>void): void;
    }
    export interface HorizonConstructorParam {
      host?: string;        // default to window.location
      secure?: boolean;     // default to true
      path?: string;        // default to "horizon"
      lazyWrites?: boolean; // default to false
      authType?: AuthType;  // default to "unauthenticated"
    }
    export interface HorizonConstructor {
      new(param?: HorizonConstructorParam): Horizon;
      clearAuthToken(): void;
    }
    export var Horizon: HorizonConstructor;

    export type AuthType  = 'unauthenticated' | 'anonymous' | 'token';
    export type AuthToken = {token: any, storeLocally: boolean};
    export type OrderType = 'ascending' | 'descending';
    export type RangeType = 'closed' | 'open';

    export interface TableQuery<A> extends FinalQuery<A> {
      order(field: string, direction?: OrderType): OrderQuery<A>;     // default to "ascending"
      above(idOrObject: string|any, type?: RangeType): OrderQuery<A>; // default to "open" (exclusive)
    }
    export interface FinalQuery<A> {
      limit(max: number): LimitedFinalQuery<A>;
      fetch(): Rx.Observable<A[]>;
    }
    export interface SingleFinalQuery<A> extends Rx.Observable<A> {
      defaultIfEmpty(): Rx.Observable<A>;
    }
    export interface LimitedFinalQuery<A> {
      fetch(): Rx.Observable<A[]>;
    }
    export interface OrderQuery<A> extends FinalQuery<A> {
      below(idOrObject: string|any, type?: string): FinalQuery<A[]>; // default open(exclusive)
    }
    export interface FindQuery<A> {
      fetch(): SingleFinalQuery<A>;
    }
    export interface CreatedObject {
      id: string;
    }
    /* local record, not yet stored */
    export interface NewRecord {
      id?: string;
      [key: string]: string|Array<NewRecord>|number|boolean|NewRecord;
    }
    /* get from database */
    export interface OldRecord extends NewRecord {
      id: string;
    }
    export interface TableObject<A> extends TableQuery<A> {
      find(x: string|NewRecord): FindQuery<A>;
      findAll(x: string|NewRecord, ...xs: Array<string|NewRecord>): TableQuery<A>;
      insert(oneOrList: NewRecord|NewRecord[]): TableObject<CreatedObject>;
      remove(x: string|OldRecord): TableObject<CreatedObject>;
      removeAll(xs: Array<string|OldRecord>): Rx.Observable<CreatedObject>;
      replace(oneOrList: OldRecord|OldRecord[]): Rx.Observable<CreatedObject>;
      store(oneOrList: NewRecord|OldRecord|(NewRecord|OldRecord)[]): Rx.Observable<CreatedObject>;
      update(oneOrList: OldRecord|OldRecord[]): TableQuery<CreatedObject>;
      upsert(oneOrList: NewRecord|OldRecord|(NewRecord|OldRecord)[]): TableQuery<CreatedObject>;
    }
  }
  export = horizon;
}
