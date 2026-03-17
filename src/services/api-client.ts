import axios, { CanceledError } from 'axios';

export default axios.create({
  //baseURL: 'https://jsonplaceholder.typicode.com',
  baseURL: 'http://127.0.0.1:1337',
})

export { CanceledError };