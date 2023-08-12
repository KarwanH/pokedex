// Generates the HTML template for displaying each Pokémon in the main list
function loadPokemonTemplate(json, i) {
  let {name, id, img, bg} = infosAboutPkemon(json);

  return `
  <div id="${id}" data-index="${i}" class="pokemon-box ${bg}" onclick="showDetails(${i})">
      <img class="bg-img" src="/logo/bg1.png">
      <div class="infos">
          <h1 id="pokemon-name" class="pokemon-name">${name}</h1>
          <ul class="characteristic" id="characteristic${i}">
              ${returnPokemontypes(json)}
          </ul>
      </div>
      <div class="img-box">
          <img class="pokemon-img" id="pokemon-img${i}" src="${img}" alt="pokemon-img">
      </div>
      <span class="id-number">#${id}</span>
  </div>
  `;
}

// Generates the pop-up window template
function windowTemplates(i) {
  return `
  <div class="big-size-pokemon" id="big-size-pokemon" onclick="dontCloseWindow(event)">
      ${firstDivTemp(i)}
      ${secondDivTemp(i)}
  </div>
  `;
}

// Generates the template for the first part of the pop-up window
function firstDivTemp(i) {
  const json = myArrayOfPok[i];
  let {name, id, bg} = infosAboutPkemon(json);
  return `
  <div class="first-div ${bg}" id="first-div">
      <div class="bootstrap-icon">
          <i class="bi bi-arrow-left" onclick="closeWindow()"></i>
      </div>
      <div class="information">
          <div class="name-id">
              <h3 id="window-name" id="window-name">
                  ${name}
              </h3>
              <ul class="characteristic" id="window-characteristic">
                  ${returnPokemontypes(json)}
              </ul>
          </div>
          <span class="count-number" id="count-number">#${id}</span>
      </div>
  </div>
  `;
}

// Generates the template for the second part of the pop-up window
function secondDivTemp(i) {
  aboutTemplates(i);
  const json = myArrayOfPok[i];
  let {img} = infosAboutPkemon(json);
  return `
  <div id="second-div" class="second-div">
      <img class="main-img" id="main-img" src="${img}" alt="">
      <ul class="menu" id="menu">
          <li onclick="aboutTemplates(${i})">About</li>
          <li onclick="showStats(${i})">Stats</li>
          <li onclick="showEvolution(${i})">Evolution</li>
          <li onclick="getPokemonMoves(${i})">Moves</li>
      </ul>
      <div class="show-infos" id="show-infos">
          <div id="show-about" class="show-about"></div>
      </div>
  </div>
  </div>`;
}

// Generates the template for displaying details about a Pokémon
async function aboutTemplates(i) {
  let {name, height, weight, baseExperiences} = await shwoAbout(i);
  const json = myArrayOfPok[i];
  let infoBox = document.getElementById('show-about');
  infoBox.innerHTML = '';
  infoBox.innerHTML = `
  <table class="table  w-100">
      <thead class="border-bottom">
          <tr >
              <th scope="col th>
              <th scope="col">About</th>
          </tr>
      </thead>
      <tbody>
          <tr>
              <th scope="row">Name</th>
              <td>${name}</td>
          </tr>
          <tr>
              <th scope="row">Height</th>
              <td>${height} m</td>
          </tr>
          <tr>
              <th scope="row">Weight</th>
              <td colspan="2">${weight} kg</td>
          </tr>
          <tr>
              <th scope="row">Abilities</th>
              ${abilities(json)}
          </tr>
          <tr>
              <th scope="row">Base Experience</th>
              <td>${baseExperiences}</td>
          </tr>
      </tbody>
  </table>`;
}
