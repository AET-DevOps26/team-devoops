import axios from 'axios'

export const lettersClient = axios.create({
  baseURL: '/api/v1/letters',
})
