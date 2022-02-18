export interface PagedData<Z> {
  content: Z[]
  empty: boolean
  first: boolean
  last: boolean
  numberOfElements: number
  size: number
  totalElements: number
  totalPages: number
}
