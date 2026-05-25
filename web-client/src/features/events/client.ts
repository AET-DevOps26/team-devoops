import axios from 'axios'

export const eventsClient = axios.create({
  baseURL: '/api/v1/events',
})
