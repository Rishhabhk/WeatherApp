let API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

// dark_light_mode
let css = document.getElementById("css_light");
let css_mode = document.getElementById("light_dark");
let search_img = document.getElementById("search_img");
let loading_img = document.getElementById("loading_img");
let error_img = document.getElementById("error_img");
let wind_img = document.getElementById("wind_img");
let humidity_img = document.getElementById("humidity_img");
let cloud_img = document.getElementById("cloud_img");

let your_weather = document.getElementsByClassName("your_weather");
let search_weather = document.getElementsByClassName("search_weather");
let weather_page = document.getElementsByClassName("weather_info_con");
let search_page = document.getElementsByClassName("form_con");
let loading_page = document.getElementsByClassName("loading_con");
let grant_page = document.getElementsByClassName("grant_loc_con");
let error_con = document.getElementsByClassName("error_con");

css_mode.addEventListener('click',()=>{
    if(css_mode.innerHTML == "Dark Mode"){ 
        search_img.src = "/images/search_dark.png";
        loading_img.src = "/images/loading_dark.png";
        location_img.src = "/images/location_dark.png";
        error_img.src = "/images/error_dark.png";
        wind_img .src = "/images/wind_dark.png";
        humidity_img.src = "/images/humidity_dark.png";
        cloud_img.src = "/images/cloud_dark.png";
        css.href = "index_dark.css";
        css_mode.innerHTML = "Light Mode";


    }
    else if(css_mode.innerHTML == "Light Mode"){
        search_img.src = "/images/search.png";
        loading_img.src = "/images/loading.gif";;
        location_img.src = "/images/location.gif";
        error_img.src = "/images/error.gif";
        wind_img .src = "/images/wind.gif";
        humidity_img.src = "/images/humidity.gif";
        cloud_img.src = "/images/cloud.gif";
        css_mode.innerHTML = "Dark Mode";
        css.href = "index.css";
    }

})


search_page[0].style.display = "none";
weather_page[0].style.display = "none";
loading_page[0].style.display = "none";
grant_page[0].style.display = "none";
your_weather[0].style.backgroundColor = "#4bcacc5a";
search_weather[0].style.backgroundColor = "#33CCCC";

get_from_session_storage();

search_weather[0].addEventListener('click',()=>{
    error_con[0].style.display = "none";
    loading_page[0].style.display = "none"
    grant_page[0].style.display = "none";
    search_page[0].style.display = "block";
    weather_page[0].style.display = "none";
    search_weather[0].style.backgroundColor = "#33CCCC";
    your_weather[0].style.backgroundColor = "#4bcacc5a";
});

your_weather[0].addEventListener('click',()=>{
    loading_page[0].style.display="none";
    weather_page[0].style.display = "none";
    search_page[0].style.display = "none";
    your_weather[0].style.backgroundColor = "#33CCCC";
    search_weather[0].style.backgroundColor = "#4bcacc5a";
    get_from_session_storage();
});

// check kro user ki loc hai ki nhi
function get_from_session_storage(){
    const local_coordinates = sessionStorage.getItem("user_coords");
    // agr nhi hai to mangne vala page show kro
    if(!local_coordinates){
        grant_page[0].style.display = "block";
    }
    // agr hai to data nikal ke do
    else{
        const coordinates = JSON.parse(local_coordinates);
        fetch_user_weather(coordinates);
    }
}

// user ka weather data API se fetch kro
async function fetch_user_weather(coordinates){
    const {lat, lon} = coordinates;
    grant_page[0].style.display = "none";
    // fetch krte time loading page dikhao
    loading_page[0].style.display = "block";

    // API call
    try{
        let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
        let data = await response.json();
        loading_page[0].style.display = "none";
        // loading page band krke weahter page show kiya 
        weather_page[0].style.display = "block";
        render_weather_info(data);
    }
    catch(e){
        loading_page[0].style.display = "none";
        console.log("error");
    }
}

function render_weather_info(data){
    // sare element fetch kro 
    let city_name = document.getElementById("city_name");
    let country_icon = document.getElementById("country_icon");
    let weather_desc = document.getElementById("weather_desc");
    let weather_desc_icon = document.getElementById("weather_desc_icon");
    let temp = document.getElementById("temp");
    let windspeed_val = document.getElementById("wind_speed_val");
    let humidity_val = document.getElementById("humidity_val");
    let cloud_val = document.getElementById("cloud_val");

    city_name.innerHTML = data?.name;
    country_icon.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weather_desc.innerHTML = data?.weather?.[0]?.description;
    weather_desc_icon.src = `https://openweathermap.org/img/wn/${data?.weather?.[0]?.icon}@2x.png`;
    temp.innerHTML = `${(data?.main?.temp - 273).toFixed(2)} &degC`;
    windspeed_val.innerHTML = `${data?.wind?.speed} m/s`;
    humidity_val.innerHTML = `${data?.main?.humidity}%`;
    cloud_val.innerHTML = `${data?.clouds?.all}%`;
}

let grant_btn = document.getElementById("grant_access_btn");

grant_btn.addEventListener('click', get_location);

function get_location(){
    if(navigator.onLine){
        error_con[0].style.display = "none";
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(show_position);
        }
        else{
            alert("not supported");
        }
    }
    else{
        let weahter_con = document.getElementsByClassName("weather_con");
        // weahter_con[0].style.display = "none";
        error_con[0].style.display = "block";
        // alert("No Internet Connection");
    }

    
}
function show_position(position){
    user_coordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude
    }
        sessionStorage.setItem("user_coords", JSON.stringify(user_coordinates));
        fetch_user_weather(user_coordinates);
}
get_location();
let inp_city = document.getElementById("inp_city");

search_page[0].addEventListener('submit', (e) =>{
    e.preventDefault();
    let city_name = inp_city.value;
    if(city_name === ""){
        return;
    }
    else{
        fetch_weather_of_city(city_name);
    }
})

async function fetch_weather_of_city(city_name){
    error_con[0].style.display = "none";
    loading_page[0].style.display = "block";
    weather_page[0].style.display = "none";
    try{
        let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city_name}&appid=${API_KEY}`) 
        let data = await result.json();
        loading_page[0].style.display = "none";
        weather_page[0].style.display = "block";
        render_weather_info(data);

    }
    catch(e){
        // alert("error");
        error_con[0].style.display = "block";
        loading_page[0].style.display = "none";
    }
}

