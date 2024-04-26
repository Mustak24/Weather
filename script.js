
const temp = document.getElementById("temp");
const forcast = document.getElementById("forcast");
const path = document.getElementById("path");
const img = document.getElementById("img");
const main = document.getElementById("main");
const max_temp = document.getElementById('max_temp');
const min_temp = document.getElementById('min_temp');
const max_t = [document.styleSheets[0].cssRules[26], [document.styleSheets[0].cssRules[27]]]
const min_t = [document.styleSheets[0].cssRules[29], [document.styleSheets[0].cssRules[30]]]

setTimeout(() => {
  temp.style.transform = "scale(1)";
  path.style.transform = "rotateZ(-20deg) scale(1)"
  for (let div of forcast.children) {
    div.style.transform = "scale(1)";
    div.style.top = "0";
    div.style.opacity = "1"
  }
  start()
}, 1);

for (let i = 0; i < 30; i++) forcast.innerHTML += `<div class="flex">...</div>`

function start() {
  try {
    var forcast_data = JSON.parse(localStorage.getItem('forcasting_data'))['statistics'].data;
    temp.innerHTML = '<span>' + (JSON.parse(localStorage.getItem('today_temp'))).temp + "°C" + '</span><span>Udaipur</span>'
    for (let i = 0; i < 30; i++) {
      let date = forcast_data[i].day.split("-")
      forcast.children[i].innerHTML = `<b>${date[2] + "-" + date[1]}</b></b><b>${forcast_data[i]['temperature']['avg']}</b>`
    }
  }
  catch (e) {
    forcast.innerHTML += `<div class="flex"><b>..?</b></div>`
    temp.textContent = "..?°C"
  }

  try {
    var min_temp1 = (forcast_data[0]['temperature']['avg_min'] + forcast_data[0]['temperature']['record_min']) / 2 + 0.5;
    min_temp.querySelector('b').textContent = parseInt(min_temp1);
    if (min_temp1 > 20) min_t[0].style.width = `${70 - min_temp1}%`;
    else min_t[1].style.width = `${70 - min_temp1}%`;

    var max_temp1 = (forcast_data[0]['temperature']['avg_max'] + forcast_data[0]['temperature']['record_max']) / 2 + 0.5;
    max_temp.querySelector('b').textContent = parseInt(max_temp1);
    if (max_temp1 > 20) max_t[0].style.width = `${70 - max_temp1}%`;
    else max_t[1].style.width = `${70 - max_temp1}%`;
  }
  catch (error) { console.log(error); }

  let hr = new Date().getHours()
  if (hr >= 3 && hr < 10) {
    img.className = "morning";
    main.className = "flex morning"
  }
  else if (hr >= 10 && hr < 16) {
    img.className = "afternoon"
    main.className = "flex afternoon"
  }
  else if (hr >= 16 && hr < 20) {
    img.className = "morning"
    main.className = "flex morning"
  }
  else if (hr >= 20 && hr < 0) {
    img.className = "night"
    main.className = "flex night"
  }
  else if (hr >= 0 && hr < 3) {
    img.className = "dark_night"
    main.className = "flex dark_night"
  }

}


const forcasting = async () => {
  const url = 'https://ai-weather-by-meteosource.p.rapidapi.com/weather_statistics?lat=24.525049&lon=73.677116&units=auto';
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '91eb7226demsh82d0c268321505ep12a0e2jsn7fa4f2a7843c',
      'X-RapidAPI-Host': 'ai-weather-by-meteosource.p.rapidapi.com'
    }
  };

  try {
    let data = await fetch(url, options).catch((e) => console.log(e));
    let fulldata = await data.json();
    localStorage.setItem('forcasting_data', JSON.stringify(fulldata))
    return fulldata;
  }
  catch (error) { console.log(error); return; }
}

const today_temp = async (city) => {
  const url = `https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=${city}`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '91eb7226demsh82d0c268321505ep12a0e2jsn7fa4f2a7843c',
      'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com'
    }
  };

  try {
    let data = await fetch(url, options).catch((e) => console.log(e));
    let fulldata = await data.json();
    localStorage.setItem('today_temp', JSON.stringify(fulldata))
    return fulldata;
  }
  catch (error) { console.log(error); return; }
}

async function Refresh() {
  for (let i of forcast.children) i.innerHTML = "..."
  try {
    for (let i = 0; i < 2; i++) {
      min_t[i].style.width = `${50}%`
      max_t[i].style.width = `${50}%`
    }
  }
  catch (e) { console.log(e) }
  try {
    await forcasting();
    await today_temp('udaipur');
  }
  catch (e) {
    console.log(e);
    temp.textContent = "..?°C";
    for (let i in forcast.children) forcast.children[i].innerHTML = `<b>..?</b>`;
    return;
  }
  return start()
}

forcast.addEventListener("wheel", (e) => {
  forcast.scrollLeft += e.deltaY * 3
});
