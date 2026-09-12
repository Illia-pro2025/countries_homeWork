const BASE_URL = "https://api.restcountries.com/countries/v5";
const API_KEY = "rc_live_9e56c420cdd44be58a99a74298871f73";
export default function fetchCountries(searchQuery) {
  return fetch(`${BASE_URL}?q=${searchQuery}`, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  })
 

}
