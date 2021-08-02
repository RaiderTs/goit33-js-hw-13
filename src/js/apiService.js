const axios = require('axios');
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '11349157-fc9c2ea73d90d296f310c891d';

export default class PixabayApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.perPage = 12;
  }

  async fetchPictures() {
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`;

    const response = await axios.get(url);

    this.page += 1;
    return response.data;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
