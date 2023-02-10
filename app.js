const btn = document.querySelectorAll(".btn");
const ctx = document.getElementById("myChart");
const chartDIV = document.querySelector(".chart");
const bottomBTNs = document.querySelector(".bottom-btns");
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
      (country, idx) => (countriesObj[idx].population = country.population)
    );

    countryNames = countriesObj.map((country) => country.name);
    countryPopulations = countriesObj.map((country) => country.population);
    // console.log(countryNames);
    // console.log(countryPopulations);

    createChart(ctx, countryNames, countryPopulations);
    addCountryButtons(countryNames);
    console.log(chart);
  } catch (error) {
    console.log(error);
  }
}

for (let i of btn) {
  i.addEventListener("click", function () {
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

function addCountryButtons(countryArr) {
  for (let i of countryArr) {
    const newBTN = document.createElement("button");
    newBTN.innerHTML = i;
    bottomBTNs.appendChild(newBTN);
  }
}

function createChart(chartDOM, labelArr, dataArr) {
  if (chart) {
    chart.destroy();
  }
  chart = new Chart(chartDOM, {
    type: "bar",
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
