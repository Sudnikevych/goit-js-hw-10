import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { prewiewMarkup, countryMarkup } from './markUp';

const refs = {
  seachBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};
const DEBOUNCE_DELAY = 300;
refs.seachBox.addEventListener(
  'input',
  debounce(countrySearch, DEBOUNCE_DELAY)
);

function renderPrewiewMarkup(data) {
  const markup = data.map(prewiewMarkup).join('');
  refs.countryList.innerHTML = markup;
}

function renderCountryMarkup(data) {
  const markup = data.map(countryMarkup).join('');
  refs.countryInfo.innerHTML = markup;
}

function countrySearch(evt) {
  clearCountryList();
  clearCountryInfo();
  let inputValue = evt.target.value.trim().toLowerCase();

  if (!inputValue) {
    return;
  }
  fetchCountries(inputValue)
    .then(data => {
      if (data.length === 1) {
        renderCountryMarkup(data);
      } else if (data.length >= 2 && data.length <= 10) {
        renderPrewiewMarkup(data);
      } else {
        manyMatchesFound();
      }
    })
    .catch(error => {
      oops();
    });
}

function clearCountryList() {
  refs.countryList.innerHTML = '';
}

function clearCountryInfo() {
  refs.countryInfo.innerHTML = '';
}

function manyMatchesFound() {
  return Notify.info(
    'Too many matches found. Please enter a more specific name.'
  );
}

function oops() {
  return Notify.failure('Oops, there is no country with that name');
}
