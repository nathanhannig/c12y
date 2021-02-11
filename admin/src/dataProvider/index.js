import { stringify } from 'query-string'
import { fetchUtils } from 'ra-core'

/**
 *
 * @example
 *
 * getList          => GET http://my.api.url/posts?_sort=title&_order=ASC&_start=0&_end=24
 * getOne           => GET http://my.api.url/posts/123
 * getManyReference => GET http://my.api.url/posts?author_id=345
 * getMany          => GET http://my.api.url/posts/123, GET http://my.api.url/posts/456, GET http://my.api.url/posts/789
 * create           => POST http://my.api.url/posts/123
 * update           => PUT http://my.api.url/posts/123
 * updateMany       => PUT http://my.api.url/posts/123, PUT http://my.api.url/posts/456, PUT http://my.api.url/posts/789
 * delete           => DELETE http://my.api.url/posts/123
 */

// Since we use MongoDB, we need to convert id from _id
// https://marmelab.com/react-admin/FAQ.html#can-i-have-custom-identifiersprimary-keys-for-my-resources

// Not all methods have been tested
// Tested: GetList, GetOne, create, update, delete, deleteMany

const dataProvider = (apiUrl, httpClient = fetchUtils.fetchJson) => ({
  getList: (resource, params) => {
    const { page, perPage } = params.pagination
    const { field, order } = params.sort

    const modifiedField = field === 'id' ? '_id' : field

    const query = {
      ...fetchUtils.flattenObject(params.filter),
      _sort: modifiedField,
      _order: order,
      _start: (page - 1) * perPage,
      _end: page * perPage,
    }
    const url = `${apiUrl}/${resource}?${stringify(query)}`

    return httpClient(url).then(({ headers, json }) => {
      if (!headers.has('x-total-count')) {
        throw new Error(
          'The X-Total-Count header is missing in the HTTP Response. The Data Provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?'
        )
      }

      const modifiedData = json.data.map((record) => {
        return { ...record, ...{ id: record._id } }
      })

      return {
        data: modifiedData,
        total: parseInt(headers.get('x-total-count').split('/').pop(), 10),
      }
    })
  },

  getOne: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => {
      const modifiedData = { ...json.data, ...{ id: json.data._id } }

      return {
        data: modifiedData,
      }
    }),

  getMany: (resource, params) => {
    const query = {
      id: params.ids,
    }
    const url = `${apiUrl}/${resource}?${stringify(query)}`

    return httpClient(url).then(({ json }) => {
      const modifiedData = json.data.map((record) => {
        return { ...record, ...{ id: record._id } }
      })

      return { data: modifiedData }
    })
  },

  getManyReference: (resource, params) => {
    const { page, perPage } = params.pagination
    const { field, order } = params.sort
    const query = {
      ...fetchUtils.flattenObject(params.filter),
      [params.target]: params.id,
      _sort: field,
      _order: order,
      _start: (page - 1) * perPage,
      _end: page * perPage,
    }
    const url = `${apiUrl}/${resource}?${stringify(query)}`

    return httpClient(url).then(({ headers, json }) => {
      if (!headers.has('x-total-count')) {
        throw new Error(
          'The X-Total-Count header is missing in the HTTP Response. The jsonServer Data Provider expects responses for lists of resources to contain this header with the total number of results to build the pagination. If you are using CORS, did you declare X-Total-Count in the Access-Control-Expose-Headers header?'
        )
      }

      const modifiedData = json.data.map((record) => {
        return { ...record, ...{ id: record._id } }
      })

      return {
        data: modifiedData,
        total: parseInt(headers.get('x-total-count').split('/').pop(), 10),
      }
    })
  },

  update: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'PUT',
      body: JSON.stringify(params.data),
    }).then(({ json }) => {
      const modifiedData = { ...json.data, ...{ id: json.data._id } }

      return { data: modifiedData }
    }),

  // json-server doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
  updateMany: (resource, params) =>
    Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: 'PUT',
          body: JSON.stringify(params.data),
        })
      )
    ).then((responses) => {
      const modifiedResponse = responses.map(({ json }) => json.data._id)

      return { data: modifiedResponse }
    }),

  create: (resource, params) =>
    httpClient(`${apiUrl}/${resource}`, {
      method: 'POST',
      body: JSON.stringify(params.data),
    }).then(({ json }) => {
      const modifiedData = { ...json.data, ...{ id: json.data._id } }

      return { data: modifiedData }
    }),

  delete: (resource, params) =>
    httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: 'DELETE',
    }).then(({ json }) => {
      const modifiedData = { ...json.data, ...{ id: json.data._id } }

      return { data: modifiedData }
    }),

  // json-server doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
  deleteMany: (resource, params) =>
    Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: 'DELETE',
        })
      )
    ).then((responses) => {
      const modifiedResponse = responses.map(({ json }) => json.data._id)

      return { data: modifiedResponse }
    }),
})

export default dataProvider
