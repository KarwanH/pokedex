
async function init(){
    await inculde();
    await loadPokemon();
 }

let chunckSize = 35;
 
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


 async function loadPokemon(){
        let main = document.getElementById('main');
        main.innerHTML = '';
        for(let i = 1; i < chunckSize+1; i++){
            let url = `https://pokeapi.co/api/v2/pokemon/${i}`
            let res = await fetch(url)
            let responsAsJson = await res.json();
            main.innerHTML += loadPokemonTemplate(responsAsJson, i);
        }

 }

   function loadPokemonTemplate(responsAsJson, i){
   let name = responsAsJson.name;
   let img = responsAsJson.sprites.other['dream_world'].front_default;
   let bg = responsAsJson.types[0].type['name'];
    if(responsAsJson.types.length >= 2){
        bg = responsAsJson.types[1].type['name']
    }
    return`
    <div id="${responsAsJson.id}" class="pokemon-box ${bg}">
    <img class="bg-img" id="pokemon-img${i}" src="/logo/bg1.png">
            <div class="infos">
                <h1 id="pokemon-name" class="pokemon-name">${name}</h1>
                <ul class="characteristic" id="characteristic${i}">
                ${returnPokemontypes(responsAsJson, i)}
                </ul>
            </div>

            <div class="img-box">
                <img class="pokemon-img" id="pokemon-img${i}" src="${img}" alt="pokemon-img">
            </div>
        </div>
        `



 }


  function returnPokemontypes(responsAsJson){
    let types =  [];

    for (let i = 0; i <  responsAsJson['types'].length; i++) {
        types.push(`<li>${responsAsJson.types[i].type['name']}</li>`)
    }
    return  types.reverse((a,b)=>{
        return b, a
    }).join('');

 }

 
 