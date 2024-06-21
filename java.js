const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("weatherSearch");
const myModal = new bootstrap.Modal(document.getElementById("myModal"));

searchInput.addEventListener("keyup", () => {
  setTimeout(() => search(searchInput.value), 400);
});

function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        search(`${latitude},${longitude}`);
      },
      (error) => console.error("Geolocation error:", error)
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}

async function search(query) {
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=2d43b4e9d0304c49973221524241906&q=${query}&days=3`);

    if (!response.ok) throw new Error("Network Response Was Not Ok");

    const data = await response.json();
    const days = data.forecast.forecastday.map((day, index) => ({
      dayName: new Date(day.date).toLocaleDateString("en-US", { weekday: "long" }),
      monthName: new Date(day.date).toLocaleDateString("en-US", { month: "long" }),
      date: day.date.slice(8, 10) + " " + new Date(day.date).toLocaleDateString("en-US", { month: "long" }),
      location: data.location.name,
      avgTemp: day.day.avgtemp_c,
      maxTemp: day.day.maxtemp_c,
      minTemp: day.day.mintemp_c,
      icon: day.day.condition.icon,
      desc: day.day.condition.text,
    }));

    displayData(days);
  } catch (error) {
    console.error("Fetch error:", error);
    if (searchInput.value) myModal.show();
  }
}

function displayData(days) {
  const [today, secondDay, thirdDay] = days;

  updateElement("today", today, true);
  updateElement("secondDay", secondDay);
  updateElement("thirdDay", thirdDay);
}

function updateElement(prefix, day, isToday = false) {
  document.getElementById(`${prefix}Day`).innerText = day.dayName;
  if (isToday) {
    document.getElementById(`${prefix}Date`).innerText = day.date;
    document.getElementById("location").innerText = day.location;
    document.getElementById(`${prefix}DegreeNum`).innerText = day.avgTemp;
    document.getElementById(`${prefix}Icon`).setAttribute("src", `https:${day.icon}`);
    document.getElementById(`${prefix}Status`).innerText = day.desc;
  } else {
    document.getElementById(`${prefix}DegreeNum`).innerText = day.maxTemp;
    document.getElementById(`${prefix}DegreeNumMin`).innerText = day.minTemp;
    document.getElementById(`${prefix}Icon`).setAttribute("src", `https:${day.icon}`);
    document.getElementById(`${prefix}Status`).innerText = day.desc;
  }
}

window.onload = getCurrentLocation;
