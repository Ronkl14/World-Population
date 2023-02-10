const btn = document.querySelectorAll(".btn");
const ctx = document.getElementById("myChart");

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
    console.log(countryNames);
    console.log(countryPopulations);

    createChart(ctx, countryNames, countryPopulations);
  } catch (error) {
    console.log(error);
  }
}

displayCountriesByContinent("asia");

// add class with continent name to each btn
// every btn gets an eventlistener triggering the continet func with the corresponding continent
//getCountriesByContinent returns an object of countries
// change it to create arrays, or just use map on object?
// function that will create chart
//function that will insert buttons of each country
//create async function to get cities
//add eventlistener to trigger each button to get corresponding cities
// use chart functino created

function createChart(chartDOM, labelArr, dataArr) {
  new Chart(chartDOM, {
    type: "bar",
    data: {
      labels: labelArr,
      datasets: [
        {
          label: "# of Votes",
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
