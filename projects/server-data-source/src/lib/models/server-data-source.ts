import { CollectionViewer, DataSource, ListRange } from '@angular/cdk/collections'
import { BehaviorSubject, Observable, Subscription, ReplaySubject } from 'rxjs'
import { Pagination } from '../models/pagination'
import { PagedData } from '../models/paged-data'
import { ServerDataSourceService } from '../services/server-data-source.service'

export class ServerDataSource<Z> implements DataSource<Z> {
  private isDataLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

  private readonly FIRST: number = 0

  protected cachedData: Z[] = []

  protected collectionViewer!: CollectionViewer

  protected isAllCached = false

  protected subscription!: Subscription

  protected dataStream: BehaviorSubject<Z[]> = new BehaviorSubject(this.cachedData)

  protected pagination: Pagination

  private resetDatasource: ReplaySubject<void> = new ReplaySubject()

  constructor(
    private findMethod: Observable<PagedData<Z>>,
    private request: any,
    private key: string,
    private serverDataSourceService: ServerDataSourceService<Z>) {
    this.pagination = this.request.pagination
    this.subscribeDeleteEvent()
    this.subscribeUpdateEvent()
    this.findData()
  }

  public connect(collectionViewer: CollectionViewer): Observable<Z[]> {
    this.subscription = new Subscription()
    this.collectionViewer = collectionViewer
    this.subscription.add(collectionViewer.viewChange.subscribe(range => this.loadNextData(range)))
    return this.dataStream.asObservable()
  }

  public getDatasource(): Z[] {
    return this.cachedData
  }

  public getTotalContentSize(): number {
    return this.cachedData.length
  }

  public isLoading(): Observable<boolean> {
    return this.isDataLoading.asObservable()
  }

  protected loadNextData(range: ListRange = { start: this.FIRST, end: this.FIRST }): void {
    if (this.hasToLoadData(range)) {
      this.pagination.page += 1
      this.findData()
    }
  }

  protected findData(): void {
    this.isDataLoading.next(true)
    this.findMethod.subscribe((response: PagedData<Z>) => {
      this.isDataLoading.next(false)
      this.emitData(response)
    })
  }

  /**
   * Check if they are the latest data, concatenation with the current ones and data emit.
   * @param pagedData Data that want to add in cachedData.
   */
  protected emitData(pagedData: PagedData<Z>): void {
    this.isAllCached = pagedData.last
    this.cachedData = this.cachedData.concat(pagedData.content)
    this.dataStream.next(this.cachedData)
  }

  public disconnect(cv: CollectionViewer): void {
    this.subscription.unsubscribe()
    this.dataStream.complete()
  }

  /**
   * Get page according to element index
   * @param index Index of the rendered element.
   * @returns currentPage Calculated current page number.
   */
  protected getPageByIndex(index: number): number {
    return Math.floor(index / this.pagination.collectionSize)
  }

  protected getIndexPerPage(page: number): number {
    return page * this.pagination.collectionSize
  }

  protected reloadFromCurrentPage(): void {
    this.cachedData = this.cachedData.slice(0, this.getIndexPerPage(this.pagination.page))
    this.findData()
  }

  public getResetDatasource(): Observable<void> {
    return this.resetDatasource.asObservable()
  }

  public nextResetDatasource(): void {
    this.resetDatasource.next()
  }

  private hasToLoadData(range: ListRange): boolean {
    return !this.isAllCached
      && this.getPageByIndex(range.end) > this.pagination.page
  }

  private subscribeDeleteEvent(): void {
    this.serverDataSourceService.getDeletedItem()
      .subscribe((item: Z) => this.deleteItemsFromPage(item, this.key))
  }

  private deleteItemsFromPage(item: Z, key: string): void {
    const index = this.cachedData.findIndex(data => data[key] === item[key])
    if (index >= this.FIRST) {
      this.isAllCached = false
      this.pagination.page = this.getPageByIndex(index)
      this.loadPage()
    }
  }

  private loadPage() {
    if (this.pagination.page === this.FIRST) {
      this.nextResetDatasource()
    } else {
      this.reloadFromCurrentPage()
    }
  }

  private subscribeUpdateEvent(): void {
    this.serverDataSourceService.getUpdatedItem()
      .subscribe((editedCurrency: Z) => this.updateItem(editedCurrency, this.key))
  }

  private updateItem(item: Z, key: string): void {
    const index = this.cachedData.findIndex(data => data[key] === item[key])
    if (index >= 0) {
      this.cachedData.splice(index, 1, item)
      this.dataStream.next(this.cachedData)
    }
  }
}
