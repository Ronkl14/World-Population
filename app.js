const btn = document.querySelectorAll(".btn");

async function getCountriesByContinent(continent) {
  try {
    const continentRes = await fetch(
      `https://restcountries.com/v3.1/region/${continent}`
    );

    if (!continentRes.ok) {
      throw new Error("Something went wrong :(");
    }

    const countries = await continentRes.json();
    let countriesObj = [];
    countries.forEach((country, idx) => {
      countriesObj[idx] = {};
      countriesObj[idx].name = country.name.common;
    });
    countries.forEach(
      (country, idx) => (countriesObj[idx].population = country.population)
    );
    console.log(countriesObj);
    return countriesObj;
  } catch (error) {
    console.log(error);
  }
}

// async function getResultFromPromise(callbackFn) {
//   const result = await callbackFn;
//   console.log(result);
// }

getCountriesByContinent("africa").then((a) => console.log(a));
// getResultFromPromise(getCountriesByContinent("americas"));
