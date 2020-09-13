const baseURL = "https://developer.nps.gov/api/v1/parks?"
const apiKey = "FOZhn5l3h8SRUnxdbh3uL2kZwm3HgZdNFD3qHd47"
const stateInput = document.getElementById("state");
const statesToSearch = document.getElementById("statesToSearch")
const stateSelector = document.getElementById("stateSelector");

// search variables
let statesArray = [];
let results = [];
let maxResults = 10


function handleRemoveState (e) {
    if (e.target.matches('.remove')){
        const index = e.target.parentElement.dataset.index
        statesArray.splice(index, 1);
        render();
    }
}

function handleAddState (e) {
    e.preventDefault();
    const state = stateInput.value;
    const stateCode = document.querySelector(`option[value="${state}"]`).dataset.stateCode;
    console.log(state+": "+stateCode)
    this.value="default"
    addToStateList(state,stateCode)
    render();
}

function addToStateList (stateString,code) {
    let stateObj = {name: stateString, stateCode: code}
    statesArray.push(stateObj);
}

function render(){
    let statesHTML = statesArray.map((state,index)=>{
        return `<li data-index="${index}"><span>${state.name}</span><button class="remove">X</button></li>`
    }).join("");
    statesToSearch.innerHTML = statesHTML;
}


function populateDatalist (datalist, states){
    let options = '<option selected="true" disabled="disabled" value="default">Select State:</option>'
    for (const [key, value] of Object.entries(states)) {
        options += `<option value="${value}" data-state-code="${key}">${value}</option>`
    }
    datalist.innerHTML = options
}

function generateParamsObject () {
    return {
        stateCode: statesArray.map(stateObj=>stateObj.stateCode).join(","), 
        limit: document.getElementById("maxResults").value, 
        api_key: apiKey}
    }
    
    function formatQueryParams(params) {
        const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        return queryItems.join('&');
    }
    
    
    function generateParkArticle (parkName, description, url, address) {
        return `<article class="parkInfo">
        <h3 class>${parkName}</h3>
        <p class="description">
        ${description}
        </p>
        <a href="${url}" class="html" target="_blank">Homepage</a>
        </article>`
        
    }
    
    function displayData(data){
        console.log(data);
       document.getElementById("parks").innerHTML = data.map(park=>{
            return generateParkArticle(park.name, park.description, park.url)
        }).join("");
    }

    async function search (e){
        e.preventDefault();
        const queryString = formatQueryParams(generateParamsObject());
        console.log(baseURL+queryString);
        const dataArray = await getData(baseURL, queryString);
        displayData(dataArray.data);
    }

    async function getData(url, queryString){
        try{
            const response = await fetch(url+queryString);
            if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`)
            const data = await response.json();
            console.log(data);
            return data;
        }
        catch(e){
            console.log(e);
        }
    }
    window.onload = ()=>{
        populateDatalist(document.querySelector("select"),states)
        statesToSearch.addEventListener("click",handleRemoveState)
        document.querySelector("form").addEventListener("submit",search)
        document.getElementById("state").addEventListener("change", handleAddState)
        
}
    