import { OK_STATUS } from '../consts'
import { getReposPerPage, makeFakeResponse } from './repos'

export function handlePaginated (req, res, ctx) {
  return res(
    ctx.status(OK_STATUS),
    ctx.json({
      ...makeFakeResponse({totalCount: 1000}),
      items: getReposPerPage({
        perPage: Number(req.url.searchParams.get('per_page')),
        currentPage: Number(req.url.searchParams.get('page'))
      }),
    }),
  )
}