import refs from './refs';
import debounce from 'lodash.debounce';
import fetchCounties from './fetchCountries.js';
import oneCountryTemplate from '../templates/one-country.hbs';
import listCountriesTemplate from '../templates/list-countries.hbs';
import notificationError, { notificationAlert } from './notification';
// import { data } from 'autoprefixer';

refs.inputRef.addEventListener('input', debounce(inputHandler, 500));

function inputHandler(event) {
  const searchQuery = event.target.value;
  //   console.log(searchQuery);

  if (!searchQuery) {
    return;
  }

  fetchCounties(searchQuery)
    .then(data => {
      clearInput();
      if (data.length > 10) {
        return notificationAlert(
          'Too many matches found. Please enter a more specific query!',
        );
      } else if (data.length > 1 && data.length <= 10) {
        renederListCountry(data);
      } else {
        renederOneCountry(data);
      }
    })
    .catch(error => {
      if (error === 404) {
        return notificationError('Something went wrong. Try again.');
      }
    });
}

function renederOneCountry(data) {
  const markupOneCountry = oneCountryTemplate(data);
  refs.resultRef.insertAdjacentHTML('afterbegin', markupOneCountry);
}

function renederListCountry(data) {
  const markupListCountries = listCountriesTemplate(data);
  refs.resultRef.insertAdjacentHTML('afterbegin', markupListCountries);
}

function clearInput() {
  refs.resultRef.innerHTML = '';
}
