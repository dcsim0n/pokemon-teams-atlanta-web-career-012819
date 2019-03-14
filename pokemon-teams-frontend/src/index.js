const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

document.addEventListener("DOMContentLoaded", ()=>{
    renderAllTrainers()
    //Do the things
})

function renderAllTrainers() {
    fetch(TRAINERS_URL)
    .then(result => result.json())
    .then(data => data.map(trainer => renderTrainer(trainer)))
    
}


//<div class="card" data-id="1"><p>Prince</p>
// <button data-trainer-id="1">Add Pokemon</button>
//  <ul>
//    <li>Jacey (Kakuna) <button class="release" data-pokemon-id="140">Release</button></li>
//     <li>Zachariah (Ditto) <button class="release" data-pokemon-id="141">Release</button></li>
//     <li>Mittie (Farfetch'd) <button class="release" data-pokemon-id="149">Release</button></li>
//     <li>Rosetta (Eevee) <button class="release" data-pokemon-id="150">Release</button></li>
//     <li>Rod (Beedrill) <button class="release" data-pokemon-id="151">Release</button></li>
//   </ul>
// </div>
function renderTrainer(trainer) {
    console.log("rendering",trainer);

    const main = document.querySelector("main")
    const div = document.createElement("div")
    div.className = "card"
    div.dataset.id = trainer.id
    main.appendChild(div)
    //div now in main
    const trainerName = document.createElement("p")
    trainerName.textContent = trainer.name
    div.appendChild(trainerName)
    //div now has a trainer name
    const addButton = document.createElement("button")
    addButton.dataset.trainer_id = trainer.id
    addButton.textContent = "Add Pokemon"

    addButton.addEventListener("click", handleAddButton)

    div.appendChild(addButton)
    //div now has a button

    const ul = document.createElement("ul")
    div.appendChild(ul)
    //ul now in div
    renderPokemons(ul, trainer)
    console.log(trainer)
}

function renderPokemons(ul, trainer) {
    trainer.pokemons.forEach(pokemon => {
        renderPokemon(ul,pokemon)
    })
    
}
function renderPokemon(ul,pokemon) {
    const li = document.createElement("li")
    ul.appendChild(li)
    li.textContent = `${pokemon.nickname} (${pokemon.species})`
    const deleteButton = document.createElement("button")
    li.appendChild(deleteButton)
    deleteButton.textContent = "Release"
    deleteButton.className = "release"
    deleteButton.dataset.pokemon_id = pokemon.id
    deleteButton.addEventListener("click", handleRelease)
}
// #=> Example Request
// POST /pokemons

// Required Headers:
// {
//   'Content-Type': 'application/json'
// }

// Required Body:
// {
//   trainer_id: 1
// }
// #=> Example Response
// {
//   "id":147,
//   "nickname":"Gunnar",
//   "species":"Weepinbell",
//   "trainer_id":1
// }

function handleAddButton(event) {
    const button = event.target
    const ul = button.nextSibling
    fetch(POKEMONS_URL, {
        headers: {
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(button.dataset)
    })
    .then(resp => resp.json())
    .then(data => {
        console.log(data)
        if(!data.error){
            renderPokemon(ul,data)
        }
    })
}
// #=> Example Request
// DELETE /pokemons/:pokemon_id

// #=> Example Response
// {
//   "id":147,
//   "nickname":"Gunnar",
//   "species":"Weepinbell",
//   "trainer_id":1
// }
function handleRelease(event) {
    const button = event.target
    const url = `${POKEMONS_URL}/${button.dataset.pokemon_id}`
    fetch(url,{
        method: "DELETE"
    }).then(resp => resp.json())
    .then(data => {
        console.log(data)
        button.parentNode.remove()
        
    })
}