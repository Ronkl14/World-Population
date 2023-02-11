const btn = document.querySelectorAll(".btn");
const ctx = document.getElementById("myChart");
const chartDIV = document.querySelector(".chart");
const bottomBTNs = document.querySelector(".bottom-btns");
const noData = document.querySelector(".no-data");
const noDataCountry = document.querySelector(".no-data-span");
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
    // console.log(countryNames);
    // console.log(countryPopulations);

    createChart(ctx, countryNames, countryPopulations);
    addCountryButtons(countryNames, countryOfficialNames);
    const bottomBTNs = document.querySelectorAll(".btn-bottom");
    // console.log(bottomBTNs);
    addCountryListeners(bottomBTNs);
    // console.log(chart);
  } catch (error) {
    console.log(error);
  }
}

function addCountryListeners(buttons) {
  for (let btn of buttons) {
    btn.addEventListener("click", function (e) {
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
      console.log(cities.data);
      const citiesData = cities.data;
      const cityNames = citiesData.map((city) => city.city);
      const cityPopulations = citiesData.map(
        (city) => city.populationCounts[0].value
      );
      createChart(ctx, cityNames, cityPopulations);

      console.log(cityNames);
      console.log(cityPopulations);
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
      noData.classList.remove("hide");
      noDataCountry.innerHTML = `${countryName}`;
      throw new Error("NO DATA");
    } else {
      const cities = await citiesRes.json();
      console.log(cities.data);
      const citiesData = cities.data;
      const cityNames = citiesData.map((city) => city.city);
      const cityPopulations = citiesData.map(
        (city) => city.populationCounts[0].value
      );
      createChart(ctx, cityNames, cityPopulations);

      console.log(cityNames);
      console.log(cityPopulations);
    }
  } catch (error) {
    console.log(error);
  }
}

for (let i of btn) {
  i.addEventListener("click", function () {
    noData.classList.add("hide");
    bottomBTNs.innerHTML = "";
    const continentClass = i.classList[1];
    displayCountriesByContinent(`${continentClass}`);
  });
}

// displayCountriesByContinent("asia");

// add class with continent name to each btn
// every btn gets an eventlistener triggering the continet func with the corresponding continent
//getCountriesByContinent returns an object of countries
// change it to create arrays, or just use map on object?
// function that will create chart
//function that will insert buttons of each country
//create async function to get cities
//add eventlistener to trigger each button to get corresponding cities
// use chart functino created

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

function createChart(chartDOM, labelArr, dataArr) {
  if (chart) {
    chart.destroy();
  }
  chart = new Chart(chartDOM, {
    type: "line",
    data: {
      labels: labelArr,
      datasets: [
        {
          label: "Country population",
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
