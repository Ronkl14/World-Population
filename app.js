const btn = document.querySelectorAll(".btn");
const topBTNs = document.querySelector(".top-btns");
const ctx = document.getElementById("myChart");
const chartDIV = document.querySelector(".chart");
const bottomBTNs = document.querySelector(".bottom-btns");
const noData = document.querySelector(".no-data");
const noDataCountry = document.querySelector(".no-data-span");
const spinner = document.querySelector(".loading-spinner");
let chart;

async function displayCountriesByContinent(continent) {
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
      (country, idx) => (countriesObj[idx].nameOfficial = country.name.official)
    );
    countries.forEach(
      (country, idx) => (countriesObj[idx].population = country.population)
    );

    countryNames = countriesObj.map((country) => country.name);
    countryPopulations = countriesObj.map((country) => country.population);
    countryOfficialNames = countriesObj.map((country) => country.nameOfficial);

    spinner.classList.add("hide");
    createChart(
      ctx,
      countryNames,
      countryPopulations,
      "Country Population",
      "line"
    );
    addCountryButtons(countryNames, countryOfficialNames);
    const bottomBTNs = document.querySelectorAll(".btn-bottom");
    addCountryListeners(bottomBTNs);
  } catch (error) {
    console.log(error);
  }
}

function addCountryListeners(buttons) {
  for (let btn of buttons) {
    btn.addEventListener("click", function (e) {
      chart.destroy();
      spinner.classList.remove("hide");
      noData.classList.add("hide");
      getCities(
        e.target.attributes.country.value,
        e.target.attributes.official.value
      );
    });
  }
}

async function getCities(countryName, countryOfficialName) {
  try {
    const citiesRes = await fetch(
      "https://countriesnow.space/api/v0.1/countries/population/cities/filter",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: 1000,
          order: "asc",
          orderBy: "name",
          country: `${countryName}`,
        }),
      }
    );
    if (!citiesRes.ok) {
      getCitiesByOfficialName(countryName, countryOfficialName);
    } else {
      const cities = await citiesRes.json();
      const citiesData = cities.data;
      const cityNames = citiesData.map((city) => city.city);
      const cityPopulations = citiesData.map(
        (city) => city.populationCounts[0].value
      );
      spinner.classList.add("hide");
      createChart(ctx, cityNames, cityPopulations, "City Population", "bar");
    }
  } catch {}
}

async function getCitiesByOfficialName(countryName, countryOfficialName) {
  try {
    const citiesRes = await fetch(
      "https://countriesnow.space/api/v0.1/countries/population/cities/filter",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          limit: 1000,
          order: "asc",
          orderBy: "name",
          country: `${countryOfficialName}`,
        }),
      }
    );
    if (!citiesRes.ok) {
      chart.destroy();
      spinner.classList.add("hide");
      noData.classList.remove("hide");
      noDataCountry.innerHTML = `${countryName}`;
      throw new Error("NO DATA");
    } else {
      const cities = await citiesRes.json();
      const citiesData = cities.data;
      const cityNames = citiesData.map((city) => city.city);
      const cityPopulations = citiesData.map(
        (city) => city.populationCounts[0].value
      );
      spinner.classList.add("hide");
      createChart(ctx, cityNames, cityPopulations, "City Population", "bar");
    }
  } catch (error) {
    console.log(error);
  }
}

function addCountryButtons(countryArr, countryOfficialArr) {
  for (let i = 0; i < countryArr.length; i++) {
    const newBTN = document.createElement("button");
    newBTN.classList.add("btn");
    newBTN.classList.add("btn-bottom");
    newBTN.setAttribute("country", countryArr[i]);
    newBTN.setAttribute("official", countryOfficialArr[i]);
    newBTN.innerHTML = countryArr[i];
    bottomBTNs.appendChild(newBTN);
  }
}

function createChart(chartDOM, labelArr, dataArr, labelText, style) {
  if (chart) {
    chart.destroy();
  }
  chart = new Chart(chartDOM, {
    type: style,
    data: {
      labels: labelArr,
      datasets: [
        {
          label: labelText,
          data: dataArr,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

topBTNs.addEventListener("click", function (event) {
  spinner.classList.remove("hide");
  noData.classList.add("hide");
  bottomBTNs.innerHTML = "";
  const continentClass = event.target.classList[1];
  displayCountriesByContinent(`${continentClass}`);
});
