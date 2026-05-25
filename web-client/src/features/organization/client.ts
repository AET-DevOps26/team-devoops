import axios from 'axios'

export const organizationClient = axios.create({
  baseURL: '/api/v1/organization',
})
