const pokeCard = document.getElementById('pokemon-card');
const input = document.getElementById('search-input');
const button = document.getElementById('search-button');
const fundo = document.getElementById('fundo-carrinho');
const fechar = document.getElementById('botao-fechar');
const carrinhoLogo = document.getElementById('logo-carrinho');
const listaCarrinho = document.getElementById('lista-carrinho');
const bolinhaCarrinho = document.getElementById('bolinha-carrinho');
const totalCarrinho = document.getElementById('total-carrinho');

console.log(pokeCard)
let pokemonsArray = [];
let carrinho = [];

const fetchPokemon = () =>{
    const promises = [];
    for (let i = 1; i <= 150; i++) {
        const url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        promises.push(fetch(url).then((res) => res.json()));
    }

    Promise.all(promises).then(results =>{
        pokemonsArray = results.map(data => ({
            name: data.name,
            id: data.id,
            image: data.sprites['front_default'],
            type: data.types
                .map( type => type.type.name)
                .join(', '), 
            valor: geraValor()
        }));
        displayPokemon(pokemonsArray);
    });

    
};

const displayPokemon = (pokemon) =>{
    const pokemonHTMLString = pokemon.map (pokeman => `
    <div class="cards">
        <img src="${pokeman.image}" alt="pokémon">
        <h4>${pokeman.name}</h4>
        <p>Tipo: ${pokeman.type}</p>
        <h5>R$${pokeman.valor.toFixed(2).replace('.', ',')}</h5>
        <a href="#" onclick="armazenaCarrinho('${pokeman.name}')"><img class="add-cart" src="img/add-to-cart.svg" alt="adicionar ao carrinho"></a>
    </div>
    `).join('');
    pokeCard.innerHTML = pokemonHTMLString;
}

function searchPokemon(){
    fetch('https://pokeapi.co/api/v2/pokemon/' + input.value)
    .then((res => res.json()))
    .then(resultado => {
        pokemonsArray = [{
            name: resultado.name,
            id: resultado.id,
            image: resultado.sprites['front_default'],
            type: resultado.types
                .map( type => type.type.name)
                .join(', '),
            valor: geraValor()
        }];
        displayPokemon(pokemonsArray);
    })
    .catch(err => alert('Pokémon não encontrado :('))
}

button.addEventListener('click', () =>{
    searchPokemon();
})

function armazenaCarrinho(pokemonNome){
    let buscaPokemon = pokemonsArray.filter( (pokeman) =>{
        return pokeman.name === pokemonNome
    })[0];
    carrinho.push(buscaPokemon);
    console.log(carrinho);
    renderizaCarrinho(carrinho);
    bolinhaCarrinho.textContent = carrinho.length;
    totalCarrinho.textContent = calculaTotal();
}

function fecharAbrirCarrinho(aberto){
    if(aberto){
        fundo.style.display = 'block'
    } else{
        fundo.style.display = 'none'
    }
}

fechar.addEventListener('click', () =>{
    fecharAbrirCarrinho(false);
})

carrinhoLogo.addEventListener('click', () =>{
    fecharAbrirCarrinho(true);
})

function renderizaCarrinho(carrinho){
    let carrinhoString = carrinho.map(item =>`
    <div class="lista-cards">
        <img src=${item.image} alt="pokémon adicionado">
        <h4>${item.name}</h4>
        <p>R$${item.valor.toFixed(2).replace('.', ',')}</p>
    </div>
    `).join('');
    listaCarrinho.innerHTML = carrinhoString; 
}

function geraValor(){
    return (Math.random() * (0 - 999.9) + 999.9);
}

function calculaTotal(){
    let total = 0;
    for(let i = 0; i < carrinho.length; i++){
        total+=carrinho[i].valor;
    }
    return total.toFixed(2).replace('.', ',');
}

fetchPokemon();

