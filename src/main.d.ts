declare namespace horizon {
  import * as Rx from 'rxjs';
  export interface Horizon {
    find<A>(): Rx.Observable<A>;

    call<A>(_this: Horizon, table: string): TableObject<A>;

    <A> (): TableObject<A>;

    currentUser(): TableQuery<any>;

    hasAuthToken(): boolean;

    connect(): void;

    onReady(f: Function): void;

    onDisconnected(f: Function): void;

    onSocketError(f: (error: any)=>void): void;
  }
  export interface HorizonConstructorParam {
    host?: string         // default to window.location
    , secure?: boolean    // default to true
    , path?: string       // default to "horizon"
    , lazyWrites?: boolean // default to false
    , authType?: AuthType // default to "unauthenticated"
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
  export interface Filter {
    [key: string]: any;
  }
  export interface Record {
    id?: string;
    [key: string]: string|Array<Record>|number|Record;
  }
  export interface OldRecord {
    id: string;
    [key: string]: string|Array<Record>|number|Record;
  }
  export interface TableObject<A> extends TableQuery<A> {
    find(o: string|Filter): FindQuery<A>;
    findAll(...o: [string|Filter][]): TableQuery<A>;
    insert(o: Record): TableObject<CreatedObject>;
    remove(o: string|Filter): TableObject<CreatedObject>;
    removeAll(o: string|Filter): Rx.Observable<CreatedObject>;
    replace(...o: [string|Filter][]): Rx.Observable<CreatedObject>;
    store(o: Record): Rx.Observable<CreatedObject>;
    update(o: OldRecord): TableQuery<CreatedObject>;
    upsert(o: Record|OldRecord): TableQuery<CreatedObject>;
  }
  /** @deprecated typings style discourage having real values */
  namespace param {
    export const ASCENDING: string = 'ascending';
    export const DESCENDING: string = 'descending';
    export const INCLUSIVE: string = 'closed';
    export const EXCLUSIVE: string = 'open';
  }
}

declare module 'horizon' {
  export = horizon;
}
