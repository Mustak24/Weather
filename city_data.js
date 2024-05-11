import data from './in_city.json' assert{type:'json'};
const list = document.getElementById('city_box');

var city = []
Object.values(data).splice(1).map( (e)=>{ e.map( (e)=>{city.push(e)} ) } );
Object.keys(data).splice(1).map( (e)=>{city.push(e)} );

for(let i of city) list.querySelector('ul').innerHTML +=`<li>${i}</li>`

function help(){
    let input = list.querySelector('input').value;
    let city_list =  city.filter((e)=>{
    return e.toLowerCase().includes((input).toLowerCase())
    })
    if(city_list == '') list.querySelector('ul').innerHTML = '<li>Not-Found</li>'
    else{
        list.querySelector('ul').innerHTML = ``
        for(let i of city_list){
            list.querySelector('ul').innerHTML +=`<li>${i}</li>`
        }
    }
}

list.querySelector('input').addEventListener('keyup', ()=>{    
    setTimeout(help,1500);
});


document.getElementById('Refresh').addEventListener('click', (async()=>{
    fech_wea_data(await city_xy(localStorage.getItem('city name')))
}))
