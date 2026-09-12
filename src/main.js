import debounce from "lodash/debounce";
import fetchCountries from "./countries";
import { notice, success, error } from "@pnotify/core";
import "@pnotify/core/dist/PNotify.css";
import "@pnotify/core/dist/BrightTheme.css";
import "./style.css";

const searchBox = document.querySelector(".search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");

searchBox.addEventListener("input", onSearch);

function onSearch(event) {
  const searchQuery = event.target.value.trim();

  countryList.innerHTML = "";
  countryInfo.innerHTML = "";

  if (!searchQuery && searchQuery <= 2) {
    return;
  }
 
  fetching(searchQuery)
}
 function fetching(searchQuery) {
   fetchCountries(searchQuery)
     .then((response) => {
       if (!response.ok) {
         throw new Error(response.status);
       }
       return response.json();
     })
     .then((data) => {
       let countries = data.data.objects;

       if (countries.length > 10) {
         notice({
           text: "Make your question more specific",
           delay: 3000,
           addClass: "country-notice",
         });
       } else if (countries.length >= 2 && countries.length <= 10) {
         renderCountryList(countries);
         return;
       } else if (countries.length === 1) {
         renderCountryInfo(countries[0]);
       }
     })
     .catch(() => {
       error({
         text: "This country wasn't found. Try another.",
         delay: 3000,
         addClass: "country-error",
       });
     });
 }
function renderCountryList(countries) {
  console.log(countries);
  const markup = countries
    .map((country) => {
      return `
        <li class="country-list__item">
          <img
            src="${country.flag.url_png}"
            alt="Flag ${country.names.official}"
            width="40"
          />
            <span>${country.names.official}</span>
        </li>
      `;
    })
    .join("");

  countryList.innerHTML = markup;
}
countryList.addEventListener("click", (e) => {
  const countryElement = e.target.closest(".country-list__item");
  if (!countryElement) return;
  const countryName = countryElement.querySelector("span").textContent.trim();
  searchBox.value = countryName;
  fetching(countryName);
});
function renderCountryInfo(country) {
  const languages = country.languages
    .map((language) => language.name)
    .join(", ");

  const markup = `
    <div class="country-info__content">
      <div>
        <h2 class="country-info__title">${country.names.official}</h2>

        <p>
          <strong>Capital:</strong>
          ${country.capitals[0].name}
        </p>

        <p>
          <strong>Population:</strong>
          ${country.population.toLocaleString("uk-UA")}
        </p>

        <p>
          <strong>Languages of origin:</strong>
          ${languages}
        </p>
      </div>

      <img
        class="country-info__flag"
        src="${country.flag.url_png}"
        alt="Flag ${country.names.official}"
      />
    </div>
  `;

  countryInfo.innerHTML = markup;
}
