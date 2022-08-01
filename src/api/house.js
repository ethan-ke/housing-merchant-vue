import request from '@/utils/request'
import qs from 'qs'

export function getList(query) {
  return request({
    url: '/houses',
    method: 'get',
    params: {
      filter: {
        complex: query.complex
      },
      page: query.page,
      limit: query.limit
    },
    paramsSerializer: params => {
      return qs.stringify(params, { indices: true })
    }
  })
}

export function getItem(id) {
  return request({
    url: '/houses/' + id,
    method: 'get'
  })
}

export function updateItem(id, data) {
  return request({
    url: '/houses/' + id,
    method: 'patch',
    data
  })
}

export function createItem(data) {
  return request({
    url: '/houses',
    method: 'post',
    data
  })
}
