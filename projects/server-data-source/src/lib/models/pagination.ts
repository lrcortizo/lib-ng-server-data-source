export class Pagination {
  page: number
  collectionSize: number
  sortOrder: string
  sortField: string

  constructor(page: number, size: number, order: string, field: string) {
    this.page = page
    this.collectionSize = size
    this.sortOrder = order
    this.sortField = field
  }
}
