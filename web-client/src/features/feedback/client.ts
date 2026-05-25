import axios from 'axios'

export const feedbackClient = axios.create({
  baseURL: '/api/v1/feedback',
})
