import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  inputEl: document.querySelector("[name = 'searchQuery']"),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

const body = document.querySelector('body');
body.style.background =
  'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)';

const BASE_URL = 'https://pixabay.com/api/';
const KEY_API = '29460446-646a6c5f479745235ebffad02';

async function axiosGet(url) {
  const response = await axios(url);
  return response.data;
}

const options = {
  baseURL: `https://pixabay.com/api/?key=${KEY_API}`,
  method: 'GET',
  params: {
    page: 1,
    per_page: 40,
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  },
};

async function getAsync() {
  try {
    const data = await axiosGet(options);
    if (data.hits <= 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    return data;
  } catch (error) {
    console.log(error);
  }
}

refs.form.addEventListener('submit', getGallery);
refs.inputEl.addEventListener('input', getInputValue);
refs.btnLoadMore.addEventListener('click', onBtnLoadMore);

function getGallery(event) {
  event.preventDefault();
  options.params.page = 1;
  getAsync().then(data => {
    if (!options.params.q) {
      refs.gallery.innerHTML = '';
      return;
    }
    refs.gallery.innerHTML = renderGallery(data);

    console.log(data.totalHits);
    Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    refs.btnLoadMore.classList.remove('visually-hidden');

    let gallery = new SimpleLightbox('.gallery a');
    gallery.on('show.simplelightbox', function () {
      captionsDelay: 250;
    });
  });
}

function getInputValue(event) {
  options.params.q = event.target.value;
}

function onBtnLoadMore() {
  refs.btnLoadMore.disabled = false;
  options.params.page += 1;
  getAsync().then(data => {
    if (!options.params.q) {
      refs.gallery.innerHTML = '';
      return;
    }
    refs.gallery.innerHTML += renderGallery(data);
    if (data.totalHits <= refs.gallery.children.length) {
      refs.btnLoadMore.disabled = true;
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
}
const renderGallery = data => {
  return data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<a class="foto-link" href=${largeImageURL}>
        <div class="gallery-card">
        
  <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy"/>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Comments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>
</a>
`;
      }
    )
    .join('');
};

// const { height: cardHeight } = document
//   .querySelector('.gallery')
//   .firstElementChild.getBoundingClientRect();

// window.scrollBy({
//   top: cardHeight * 2,
//   behavior: 'smooth',
// });
