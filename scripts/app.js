let types = [];
let abils = [];
let moveList = [];
let evos = [];

let pkmnName = document.getElementById('pkmnName');
let pkmnNum = document.getElementById('pkmnNum');
let injectTypes = document.getElementById('injectTypes');
let pkmnDisplay = document.getElementById('pkmnDisplay');
let shinyDisplay = document.getElementById('shinyDisplay');

let injectDesc = document.getElementById('injectDesc');
let injectAbilities = document.getElementById('injectAbilities');
let injectMoves = document.getElementById('injectMoves');
let injectEvos = document.getElementById('injectEvos');

let inputField = document.getElementById('inputField');
let randomBtn = document.getElementById('randomBtn');

pokeInfo(1);

inputField.addEventListener('keydown', function(e){
if(e.key === 'Enter'){
    pokeInfo(inputField.value);
    inputField.value = "";
}
})

randomBtn.addEventListener('click', function(){
    randomNum();
})

async function pokeInfo(input) {
    const api = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
    let apiData = await api.json();
    console.log(apiData);

    reset();

    // name and #
    pkmnName.textContent = apiData.name;
    pkmnNum.textContent = apiData.id;

    // types
    let typeOne = apiData.types[0].type.name;
    types = [typeOne];
    if ((apiData.types).length > 1) {
        let typeTwo = apiData.types[1].type.name;
        types = [typeOne, typeTwo];
    }
    types.map(item => {
        let span = document.createElement('span');
        span.classList = `badge ${item}`;
        span.textContent = item;
        injectTypes.appendChild(span);
    })

    // evolutions
    GetEvolutions(apiData);

    // official artwork
    pkmnDisplay.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${apiData.id}.png`
    shinyDisplay.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${apiData.id}.png`

    // abilties
    LoadAbilities(apiData);

    // moves
    LoadMoves(apiData);

    //description
    GetDescription(apiData.name);

}

function LoadAbilities(data) {
    for (let i = 0; i < (data.abilities).length; i++) {
        abils.push(data.abilities[i].ability.name);
    }
    abils.map(ability => {
        let abilTxt = document.createElement('p');
        abilTxt.textContent = ability;

        let abilCol = document.createElement('div');
        abilCol.classList = "col text-center";
        abilCol.appendChild(abilTxt);
        injectAbilities.appendChild(abilCol);
    })
}

function LoadMoves(data) {
    for (let i = 0; i < (data.moves).length; i++) {
        moveList.push(data.moves[i].move.name);
    }
    moveList.map(oneMove => {
        let moveTxt = document.createElement('p');
        moveTxt.textContent = oneMove;

        let moveCol = document.createElement('div');
        moveCol.classList = "col-4 text-center";
        moveCol.appendChild(moveTxt);
        injectMoves.appendChild(moveCol);
    })
}

async function GetDescription(input) {
    const descApi = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${input}`);
    let data = await descApi.json();
    console.log(data);

    let p = document.createElement('p');

    for(let i = 0; i < data.flavor_text_entries.length; i++){
        if(data.flavor_text_entries[i].language.name === "en"){
            p.textContent = data.flavor_text_entries[i].flavor_text;
        }
    }
    injectDesc.appendChild(p);

}

async function GetEvolutions(data) {
    let evoApi = await fetch(data.species.url);
    let evoData = await evoApi.json();
    let evoChain = await fetch(evoData.evolution_chain.url);
    let chainData = await evoChain.json();
    console.log(chainData);

    let evos = [];
    evos.push(chainData.chain.species.name);

    let chainOneLength = chainData.chain.evolves_to.length;

    for (let i = 0; i < chainOneLength; i++) {
        evos.push(chainData.chain.evolves_to[i].species.name);
        let chainTwoLength = chainData.chain.evolves_to[i].evolves_to.length;

        for (let j = 0; j < chainTwoLength; j++) {
            evos.push(chainData.chain.evolves_to[i].evolves_to[j].species.name)
        }
    }
    console.log(evos);

    for(let x = 0; x < evos.length; x++){
        const api = await fetch(`https://pokeapi.co/api/v2/pokemon/${evos[x]}`);
        let apiData = await api.json();

        let col = document.createElement('div');
        col.classList = "col d-flex justify-content-center";
    
        let img = document.createElement('img');
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${apiData.id}.png`;
        img.className = 'evo';
    
        col.appendChild(img);
        injectEvos.appendChild(col);
    }
}

function reset(){
types = [];
abils = [];
moveList = [];
evos = [];

injectTypes.textContent = "";
injectDesc.textContent = "";
injectAbilities.textContent = "";
injectMoves.textContent = "";
injectEvos.textContent = "";
}

function randomNum() {
    let rnd = parseInt(Math.random() * 1008);
    if (rnd === 0) {
        rnd = parseInt(Math.random() * 1008)
    }

    pokeInfo(rnd);
}