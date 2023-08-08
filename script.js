
async function init(){
    await inculde();
    await loadPokemon();
 }

let chunckSize = 10;
 
 async function inculde(){
     let inculdeElement = document.querySelectorAll('[template]');
     for (let i = 0; i < inculdeElement.length; i++) {
         const element = inculdeElement[i];
         const file = element.getAttribute('template');
         const respond = await fetch(file);
         if(respond.ok){
             element.innerHTML = await respond.text();
         }else{
             element.innerHTML = 'Nicht gefunden'
         }
     }
 }

     let  myArrayOfPok =  []; 

    async function loadPokemon(){
        for(let i = 1; i < chunckSize+1; i++){
            let url = `https://pokeapi.co/api/v2/pokemon/${i}`
            let res = await fetch(url)
            let responsAsJson = await res.json();
            myArrayOfPok.push(responsAsJson);
        }
        render();
 }


    function render(){
        let main = document.getElementById('main');
        main.innerHTML = '';
        for(let i = 0; i < myArrayOfPok.length; i++){
            let json = myArrayOfPok[i]
            main.innerHTML += loadPokemonTemplate(json, i);
        }
 }


    function infosAboutPkemon(json){
        
        let name = json.name;
        let id = json.id;
        let img = json.sprites.other['dream_world'].front_default;
        let bg = json.types[0].type['name'];
        if(json.types.length >= 2){
            bg = json.types[1].type['name']
        }

        return {name, id, img, bg}
    }


   function loadPokemonTemplate(json, i){

    let {name, id, img, bg} = infosAboutPkemon(json);

    return`
    <div id="${id}" data-index="${id}" class="pokemon-box ${bg}"onclick="showDetails(${i})">
        <img class="bg-img" src="/logo/bg1.png">
            <div class="infos">
                <h1 id="pokemon-name" class="pokemon-name">${name}</h1>
                <ul class="characteristic" id="characteristic${i}">
                ${returnPokemontypes(json, i)}
                </ul>
            </div>

            <div class="img-box">
                <img class="pokemon-img" id="pokemon-img${i}" src="${img}" alt="pokemon-img">
            </div>

            <span class="id-number">#${id}</span>
        </div>
        `
 }


  function returnPokemontypes(json){
    let types =  [];

    for (let i = 0; i <  json['types'].length; i++) {
        types.push(`<li>${json.types[i].type['name']}</li>`)
    }
    return  types.join('');

 }

 function searchPokemon() {
    let searchInput = document.getElementById('search-input').value.toLowerCase();
    myArrayOfPok.forEach((item, index) => {
        const pokemon = document.getElementById((index+1).toString());
        const pokemonName = item.name.toLowerCase();
        const pokemonId = item.id.toString();
        if (pokemonName.includes(searchInput) || pokemonId === searchInput) {
            pokemon.style.display = 'flex'; 
        } else{
            pokemon.style.display = 'none'; 
        }
    });
}


function showDetails(i, json){
    document.getElementById('window').style.display = 'flex'
}

// function closeWindow(){
//     document.getElementById('window').style.display = 'none';
// }

// function dontCloseWindow(event){
//     event.stopPropagation();
// }






 
 