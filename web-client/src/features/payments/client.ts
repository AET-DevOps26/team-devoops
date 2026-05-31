import axios from 'axios'

export const paymentsClient = axios.create({
  baseURL: '/api/v1/finance',
})
