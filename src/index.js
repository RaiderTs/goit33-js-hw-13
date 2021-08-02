import './sass/main.scss';
import upButtonHandler from './js/buttonUp';
import LoadMoreBtn from './js/load-more.js';
import PixabayApiService from './js/apiService';
import pictureCard from './templates/picture-card.hbs';
import Notiflix from 'notiflix';
import './js/lightbox';

const pixabayApiService = new PixabayApiService();

const refs = {
  searchForm: document.querySelector('#search-form'),
  imageContainer: document.querySelector('.gallery'),
  btnUp: document.querySelector('.btnUp'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});
let scrollPoint = 0;

refs.btnUp.addEventListener('click', upButtonHandler);
refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();
  pixabayApiService.resetPage();
  clearImgContainer();

  pixabayApiService.query = e.currentTarget.elements.query.value;

  if (pixabayApiService.searchQuery === '') {
    Notiflix.Notify.failure('Please enter your search query');
    return;
  }

  try {
    const res = await pixabayApiService.fetchPictures();

    if (res.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.',
      );
      return;
    } else {
      appendImageMarkup(res.hits);
      Notiflix.Notify.success(`Hooray! We found ${res.totalHits} images.`);
    }
    loadMoreBtn.show();
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  loadMoreBtn.disable();
  scrollPoint = document.body.clientHeight;

  try {
    const res = await pixabayApiService.fetchPictures();
    if (refs.imageContainer.querySelectorAll('.photo-card').length === res.totalHits) {
      getTotalImgCount();
    } else {
      appendImageMarkup(res.hits);
      loadMoreBtn.enable();
      window.scrollTo({
        top: scrollPoint,
        left: 0,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    console.log(error);
  }
}

function appendImageMarkup(data) {
  refs.imageContainer.insertAdjacentHTML('beforeend', pictureCard(data));
}

function clearImgContainer() {
  refs.imageContainer.innerHTML = '';
}

function getTotalImgCount() {
  Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
}
