import Notiflix from 'notiflix';

// constants API
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 40;

// elements DOM
const searchForm = document.getElementById('search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';

// search form submission handler
searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  const searchQuery = e.target.elements.searchQuery.value.trim();

  // checks if a search value has been entered
  if (searchQuery === '') {
    Notiflix.Notify.warning('Please enter a search query.');
    return;
  }

  // clear the gallery and reset the current page
  clearGallery();
  currentPage = 1;
  currentQuery = searchQuery;

  try {
    // Execution of a request to Pixabay API
    const data = await searchImages(searchQuery, currentPage);

    if (data.hits.length === 0) {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      renderImages(data.hits);
      checkPagination(data.totalHits);
    }
  } catch (error) {
    console.error('Error:', error);
    Notiflix.Notify.failure('An error occurred. Please try again later.');
  }
});

// handler for clicking the "Download More" button
loadMoreBtn.addEventListener('click', async () => {
  currentPage++;

  try {
    // Execution of a request to Pixabay API
    const data = await searchImages(currentQuery, currentPage);

    if (data.hits.length > 0) {
      renderImages(data.hits);
    }

    checkPagination(data.totalHits);
  } catch (error) {
    console.error('Error:', error);
    Notiflix.Notify.failure('An error occurred. Please try again later.');
  }
});

// a function to make a request to the Pixabay API
async function searchImages(query, page) {
  const API_KEY = '36713183-ab33de53433f0fab0c63f220d';
  const url = `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}`;

  // Execution of an HTTP request
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data;
}

// function for rendering image cards
function renderImages(images) {
  const galleryHTML = images
    .map(
      image => `
      <div class="photo-card">
        <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item"><b>Likes:</b> ${image.likes}</p>
          <p class="info-item"><b>Views:</b> ${image.views}</p>
          <p class="info-item"><b>Comments:</b> ${image.comments}</p>
          <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
        </div>
      </div>
    `
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', galleryHTML);
}

// a function to clear the gallery
function clearGallery() {
  gallery.innerHTML = '';
}

// function to check pagination
function checkPagination(totalHits) {
  const totalPages = Math.ceil(totalHits / PER_PAGE);

  if (currentPage < totalPages) {
    loadMoreBtn.style.display = 'block';
  } else {
    loadMoreBtn.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  }
}
