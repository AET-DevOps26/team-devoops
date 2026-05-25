import axios from 'axios'

export const membersClient = axios.create({
  baseURL: '/api/v1/members',
})
