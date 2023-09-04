import './css/styles.css';
import axios from 'axios';
import Notiflix from 'notiflix';
const searchForm = document.querySelector('.search-form');
const searchBtn = document.querySelector("[type='submit']");
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load-more');
const footer = document.querySelector('.footer');
const debounce = require('lodash.debounce');
const PIXIBAY_URL = 'https://pixabay.com/api/';
const KEY_PIXI = '39074542-79d6f6cab525b018e6eb706a0';
const DEBOUNCE_DELAY = 100;
const PER_PAGE = 50;
let currentPage = 1;
searchForm.addEventListener(
  'input',
  debounce(event => {
    const searchValue = event.target.value;
    localStorage.setItem('search item', searchValue);
  }, DEBOUNCE_DELAY)
);
searchBtn.addEventListener('click', async event => {
  event.preventDefault();
  const savedValue = localStorage.getItem('search item');
  if (savedValue === null || savedValue === '') {
    Notiflix.Notify.info('Sorry, you must write something');
    return;
  }
  currentPage = 1;
  await fetchImages(savedValue, currentPage);
});
const fetchImages = async (savedValue, currentPage) => {
  let markupGallery = '';
  let params = new URLSearchParams({
    key: KEY_PIXI,
    q: savedValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: PER_PAGE,
  });
  try {
    const response = await axios.get(
      `${PIXIBAY_URL}?${params}&page=${currentPage}`
    );
    const imagesArray = response.data.hits;
    if (imagesArray.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    loadBtn.style.display = 'block';
    footer.style.display = 'flex';
    markupGallery = imagesArray
      .map(image => {
        return `
        <div class="photo-card">
          <div class ="thumb">
            <img class="img" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          </div>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              ${image.likes}
            </p>
            <p class="info-item">
              <b>Views</b>
              ${image.views}
            </p>
            <p class="info-item">
              <b>Comments</b>
              ${image.comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>
              ${image.downloads}
            </p>
          </div>
        </div>
      `;
      })
      .join('');
    gallery.innerHTML = markupGallery;
  } catch (error) {
    console.error(error);
  }
};
const fetchNewImages = async (searchValue, currentPage) => {
  let markupGallery = '';
  let params = new URLSearchParams({
    key: KEY_PIXI,
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: PER_PAGE,
  });
  try {
    const response = await axios.get(
      `${PIXIBAY_URL}?${params}&page=${currentPage}`
    );
    const imagesArray = response.data.hits;
    if (imagesArray.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    markupGallery = imagesArray
      .map(image => {
        return `
        <div class="photo-card">
          <div class ="thumb">
            <img class="img" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
          </div>
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              ${image.likes}
            </p>
            <p class="info-item">
              <b>Views</b>
              ${image.views}
            </p>
            <p class="info-item">
              <b>Comments</b>
              ${image.comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>
              ${image.downloads}
            </p>
          </div>
        </div>
      `;
      })
      .join('');
    gallery.insertAdjacentHTML('beforeend', markupGallery);
  } catch (error) {
    console.error(error);
  }
};
loadBtn.addEventListener('click', async () => {
  const searchValue = localStorage.getItem('search item');
  currentPage++;
  let params = new URLSearchParams({
    key: KEY_PIXI,
    q: searchValue,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: PER_PAGE,
  });
  try {
    const response = await axios.get(
      `${PIXIBAY_URL}?${params}&page=${currentPage}`
    );
    const imagesArray = response.data.hits;
    const imagesPerPage = PER_PAGE;
    const totalImages = response.data.totalHits;
    const maxPageNumber = totalImages / imagesPerPage;
    const maxPageNumberRoundUp = Math.ceil(maxPageNumber);
    if (currentPage === maxPageNumberRoundUp) {
      footer.style.display = 'none';
      loadBtn.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
    await fetchNewImages(searchValue, currentPage);
  } catch (error) {
    console.error(error);
  }
});
footer.style.display = 'none';
loadBtn.style.display = 'none';












