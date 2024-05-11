
const temp = document.getElementById("temp");
const forcast = document.getElementById("forcast");
const path = document.getElementById("path");
const img = document.getElementById("img");
const main = document.getElementById("main");
const max_temp = document.getElementById('max_temp');
const min_temp = document.getElementById('min_temp');
const city_box = document.getElementById('city_box');
const max_t = [document.styleSheets[0].cssRules[26], [document.styleSheets[0].cssRules[27]]]
const min_t = [document.styleSheets[0].cssRules[29], [document.styleSheets[0].cssRules[30]]]


async function city_xy(city) {
  let url = `https://nominatim.openstreetmap.org/search?q=${city}&format=json`;
  try {
    let data = await fetch(url);
    data = await data.json();
    let xy = await [data[0]['boundingbox'][1], data[0]['boundingbox'][2]]
    localStorage.setItem('city name', city)
    localStorage.setItem('xy',xy);
    return xy;
  } catch (e) { console.log(e) }
}

const fech_wea_data = async (xy) => {

  let url =  await `https://ai-weather-by-meteosource.p.rapidapi.com/weather_statistics?lat=${await xy[0]}&lon=${await xy[1]}&units=auto`;
  let options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '5433fa9e9cmsh5bb8c9bcec984fdp189595jsnb07e5d636a22',
      'X-RapidAPI-Host': 'ai-weather-by-meteosource.p.rapidapi.com'
    }
  };

  try {
    let data = await fetch(url, options);
    localStorage.setItem('forcasting_data', await data.text())
  } catch (error) { console.log(error); }
  return Refill_data()
}

function background_theme() {
  let theme_list = {
    '3-10': ['morning', 'flex morning'],
    '10-16': ['afternoon', 'flex afternoon'],
    '16-20': ['morning', 'flex morning'],
    '20-0': ['night', 'flex noght'],
    '0-3': ['dark_night', 'flex dark_night']
  }

  let hr = new Date().getHours()
  for (let i of Object.keys(theme_list)) {
    let time = i.split('-');
    if (parseInt(time[0]) < hr && parseInt(time[1]) < hr) {
      img.className = theme_list[time.join('-')][0]
      main.className = theme_list[time.join('-')][1]
    }
  }
}

function maxmin_temp_level() {
  try {
    let maxmin_temp = JSON.parse(localStorage.getItem('forcasting_data'))['statistics'].data[0]['temperature'];
    var min_temp1 = (maxmin_temp['avg_min'] + maxmin_temp['record_min']) / 2 + 0.5;
    min_temp.querySelector('b').textContent = parseInt(min_temp1);
    if (min_temp1 > 20) min_t[0].style.width = `${70 - min_temp1}%`;
    else min_t[1].style.width = `${70 - min_temp1}%`;

    var max_temp1 = (maxmin_temp['avg_max'] + maxmin_temp['record_max']) / 2 + 0.5;
    max_temp.querySelector('b').textContent = parseInt(max_temp1);
    if (max_temp1 > 20) max_t[0].style.width = `${70 - max_temp1}%`;
    else max_t[1].style.width = `${70 - max_temp1}%`;
  }
  catch (error) { console.log(error); }
}

function forcast_data_fill() {
  try {
    let forcast_data = JSON.parse(localStorage.getItem('forcasting_data'))['statistics'].data;
    temp.innerHTML = '<span>' + forcast_data[0]['temperature']['avg'] + "°C" + '</span><span onclick="city_select()">' + localStorage.getItem('city name') + '</span>'
    for (let i = 0; i < 30; i++) {
      let date = forcast_data[i].day.split("-")
      forcast.children[i].innerHTML = `<b>${date[2] + "-" + date[1]}</b></b><b>${forcast_data[i]['temperature']['avg']}</b>`
    }
  }
  catch (e) {
    console.log(e)
    forcast.innerHTML += `<div class="flex"><b>..?</b></div>`
    temp.textContent = "..?°C"
  }
}


function Restart_anime() {
  try {
    for (let i = 0; i < 2; i++) {
      min_t[i].style.width = `50%`
      max_t[i].style.width = `50%`
    }
  }
  catch (e) { console.log(e) }
}

function Refill_data() {
  Restart_anime();
  background_theme();
  forcast_data_fill();
  maxmin_temp_level();
}


forcast.addEventListener("wheel", (e) => {
  forcast.scrollLeft += e.deltaY * 3
});


async function city_select() {
  let input = city_box.querySelector('input');
  input.focus();
  input.value = '';
  city_box.style.transform = "scale(1)";
  city_box.style.opacity = "1";
  main.style.filter = "blur(5px)";
  document.body.querySelector('button').style.filter = "blur(5px)";

  city_box.querySelector('button').addEventListener('click', (async() => {
    anime();
    Refill_animation();
    fech_wea_data(await city_xy(input.value));
  }))

  input.addEventListener('keypress', (async(e) => {
    if (e.key == 'Enter') {
      anime();
      Refill_animation();
      fech_wea_data(await city_xy(input.value));
    }
  }))
}

let anime = () => {
  city_box.style.transform = "scale(0)";
  city_box.style.opacity = "0";
  main.style.filter = 'blur(0)';
  document.body.querySelector('button').style.filter = "blur(0px)";
}


function Refill_animation() {
  temp.style.transform = "scale(1)";
  path.style.transform = "rotateZ(-20deg) scale(1)";
  for (let div of forcast.children) {
    div.style.transform = "scale(1)";
    div.style.top = "0";
    div.style.opacity = "1";
  }
}

(() => {
  for (let i = 0; i < 30; i++) forcast.innerHTML += `<div class="flex">...</div>`;
  city_select();
})()


city_box.querySelector('ul').addEventListener('click', (e)=>{
  let input = city_box.querySelector('input');
  if(e.target.localName == 'li'){
    input.value = e.target.textContent;
    input.focus()
  }
},true);

async function live_loca(){
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition((ans)=>{
      let xy = [ans.coords.latitude, ans.coords.longitude]
      anime();
      Refill_animation();
      localStorage.setItem('city name', 'Live loca..')
      localStorage.setItem('xy',xy);
      return fech_wea_data(...xy);
    },(e)=>{console.log(e)})
  }
  else console.log('not')
}


document.getElementById('Refresh').addEventListener('click', ()=>{
  console.log(localStorage.getItem('xy').split(','))
  fech_wea_data(...localStorage.getItem('xy').split(','))
})


