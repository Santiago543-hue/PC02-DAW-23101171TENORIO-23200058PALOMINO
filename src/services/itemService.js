import httpClient from './httpClient'

const resource = '/item'

export default {
  async getAll() {
    const response = await httpClient.get(resource)
    return response.data
  },

  async getById(id) {
    const response = await httpClient.get(`${resource}/${encodeURIComponent(id)}`)
    return response.data
  },

  async create(data) {
    const response = await httpClient.post(resource, data)
    return response.data
  },

  async update(id, data) {
    const response = await httpClient.put(`${resource}/${encodeURIComponent(id)}`, data)
    return response.data
  },

  async remove(id) {
    const response = await httpClient.delete(`${resource}/${encodeURIComponent(id)}`)
    return response.data
  },
}
