let chunckSize = 20; // Number of Pokémon to load at once
let i =1
let myArrayOfPok = []; // Array to store Pokémon data
async function init() {
    await include();
    await loadFunction();
    await loadPokemon();
}

// Loads templates from external files and inserts them into HTML elements
async function include() {
    let includeElement = document.querySelectorAll('[template]');
    for (let i = 0; i < includeElement.length; i++) {
        const element = includeElement[i];
        const file = element.getAttribute('template');
        const response = await fetch(file);
        if (response.ok) {
            element.innerHTML = await response.text();
        } else {
            element.innerHTML = 'Not found';
        }
    }
}

// Fetches and loads Pokémon data from the PokeAPI
async function loadPokemon() {
    for ( i ; i <= chunckSize; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        let responseAsJson = await response.json();
        myArrayOfPok.push(responseAsJson);
    }
    render(); // Renders the loaded Pokémon
}


// Load more Pokemons

async  function loadMore(){
    chunckSize += 20;
    await loadPokemon();
}

// Renders the loaded Pokémon data on the page
async function render() {
    let main = document.getElementById('main');
    main.innerHTML = "";
    for (let i = 0; i < myArrayOfPok.length; i++) {
        let json = myArrayOfPok[i];
        main.innerHTML += loadPokemonTemplate(json, i);
    }
}

// Extracts specific details about a Pokémon from its JSON data
function infosAboutPkemon(json) {
    // Extract relevant details from the JSON data
    let name = json.name;
    let id = json.id;
    let img = json.sprites.other['dream_world'].front_default;
    let bg = json.types[0].type['name'];
    if (json.types.length >= 2) {
        bg = json.types[1].type['name'];
    }

    return { name, id, img, bg }; // Returns the extracted details as an object
}

// Returns the Pokémon types as a list of HTML list items
function returnPokemontypes(json) {
    let types = [];

    for (let i = 0; i < json['types'].length; i++) {
        types.push(`<li>${json.types[i].type['name']}</li>`);
    }
    return types.join('');
}

// Filters and displays Pokémon based on the search input
function searchPokemon() {
    let searchInput = document.getElementById('search-input').value.toLowerCase();
    myArrayOfPok.forEach((item, index) => {
        const pokemon = document.getElementById((index + 1).toString());
        const pokemonName = item.name.toLowerCase();
        const pokemonId = item.id.toString();
        if (pokemonName.includes(searchInput) || pokemonId === searchInput) {
            pokemon.style.display = 'flex';
        } else {
            pokemon.style.display = 'none';
        }
    });
}


let currentPokemon;
// Displays detailed information about a Pokémon in a pop-up window
function showDetails(i) {
    currentPokemon = i;
    console.log(currentPokemon)
    let window = document.getElementById('window');
    window.innerHTML = '';

    document.getElementById('window').style.display = 'flex';
    window.innerHTML += windowTemplates(i);
}

// Closes the pop-up window
function closeWindow() {
    document.getElementById('window').style.display = 'none';
}

// Prevents the pop-up window from closing when clicking inside it
function dontCloseWindow(event) {
    event.stopPropagation();
}

// Extracts abilities from a Pokémon's JSON data
function abilities(json){
    let abilities = [];
    for (let i = 0; i < json['abilities'].length; i++) {
        let abilitie = json.abilities[i].ability['name']
        abilities.push(`<td>${abilitie}</td>`)
    }
    return abilities.join('');
}

// Extracts details about a Pokémon for display
async function shwoAbout(i) {
    const json = myArrayOfPok[i];
    let name = json.name;
    let height = (json.height/10).toFixed(2).replace('.', ',');
    let weight = (json.weight / 10).toFixed(0);
    let baseExperiences  = json.base_experience;
    return { name, height, weight, baseExperiences };
}

// Displays a chart showing the stats of a Pokémon
async function showStats(i) {
    const json = await myArrayOfPok[i];
    let baseStats = [];
    let names = [];
    for (let i in json.stats) {
        let stats = json.stats[i]
        baseStats.push(stats.base_stat)
        names.push(stats.stat['name']);
    }
    let infoBox = document.getElementById('show-about');
    infoBox.innerHTML = '';
  
    infoBox.innerHTML = `
    <canvas id="myChart"></canvas>
    `;
   await chartJs(baseStats, names); // Calls a chart rendering function (not provided in the code)
}


// Fetches evolution chain data and displays images of the evolution chain for a given Pokémon
async function showEvolution(i) {
    let infoBox = document.getElementById('show-about');
    infoBox.innerHTML = '';

    let allEvel = [];
    const json = await myArrayOfPok[i];
    const name = json.name;
    let url_1 = `https://pokeapi.co/api/v2/pokemon-species/${name}`;
    let response_1 = await fetch(url_1);
    let responseAsJson_1 = await response_1.json();
    let responseUrl = responseAsJson_1.evolution_chain.url;
  
    // Check if evolution chain URL is available
    if (!responseUrl) {
      console.error("Evolution chain URL not found");
      return;
    }
  
    // Fetch evolution chain data
    let respons = await fetch(responseUrl);
    let evelutionChainAsJson = await respons.json();
    let chain = evelutionChainAsJson.chain;
  
    // Collect Pokémon names in the evolution chain
    chain.species ? allEvel.push(chain.species.name) : '';
    chain.evolves_to[0] && chain.evolves_to[0].species ? allEvel.push(chain.evolves_to[0].species.name) : '';
    chain.evolves_to[0] && chain.evolves_to[0].evolves_to[0] && chain.evolves_to[0].evolves_to[0].species ? allEvel.push(chain.evolves_to[0].evolves_to[0].species.name) : '';
    
    // Fetch and display images
    let divElement = document.createElement('div');
    divElement.classList.add("info-img-div");
    divElement.innerHTML = '';
  
    // Loop through the evolution chain and fetch Pokémon IDs and display images
    for (let pokemonName of allEvel) {
        const pokemonId = await getPokemonId(pokemonName); // Wait for the ID
        const imgUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
        
        let imgElement = document.createElement("img");
        imgElement.src = imgUrl;
        imgElement.alt = pokemonName;
        divElement.appendChild(imgElement);   
    };
  
    infoBox.appendChild(divElement); // Append the div with images to infoBox
}

// Fetches the ID of a Pokémon based on its name
async function getPokemonId(pokemonName) {
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.id;
}


async function getPokemonMoves(i) {
    let infoBox = document.getElementById('show-about');
    infoBox.innerHTML = '';
    const json = await myArrayOfPok[i];
    const ulElement = document.createElement("ul");
    ulElement.classList.add("moves-div");
    for(let moves in json.moves) {
        const move = json.moves[moves].move['name'];
        const liElement = document.createElement("li");
        liElement.append(move);
        ulElement.appendChild(liElement);
    }

    infoBox.appendChild(ulElement);
}

    //  Learing the ES5 concepts (Arrow)
    const loadFunction = async () => {
        setTimeout(()=>{
        const loader = document.getElementById('loader');
        loader.style.display = 'none'; // Versteckt die Ladeanimation
        },await loadPokemon())
      };


      const previousItem = async () =>{
        currentPokemon--;
        if(currentPokemon > 0){
            await showDetails(currentPokemon)
        } else{
            currentPokemon = myArrayOfPok.length -1;
            await showDetails(currentPokemon)
        }
      }

      const nextItem = async () =>{
        currentPokemon++;
        if(currentPokemon >  myArrayOfPok.length-1){
            await showDetails(0)
        } else{
            await showDetails(currentPokemon)
        }
      }
      
  