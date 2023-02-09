const btn = document.querySelectorAll(".btn");

async function getCountriesByContinent(continent) {
  const continentRes = await fetch(
    `https://restcountries.com/v3.1/region/${continent}`
  );

  if (!continentRes.ok) {
    throw new Error("Something went wrong :(");
  }

  try {
    const countries = await continentRes.json();
    const countryNames = countries.map((country) => country.name.common);
    const countryPopulation = countries.map((country) => country.population);

    console.log(countryNames);
    console.log(countryPopulation);
  } catch (error) {
    console.log(error);
  }
}
