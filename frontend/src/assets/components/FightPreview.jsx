import React, { useEffect, useState } from 'react';

const FightPreview = () => {
    const [pokemons, setPokemons] = useState([]);
    const [selectedPokemons, setSelectedPokemons] = useState({ left: null, right: null });

    useEffect(() => {
        // Fetch all pokemons from PokeAPI
        fetch('https://pokeapi.co/api/v2/pokemon?limit=151') // Limiting to the first 151 pokemons for simplicity
            .then(response => response.json())
            .then(data => {
                Promise.all(data.results.map(pokemon => fetch(pokemon.url).then(res => res.json())))
                    .then(pokemonDetails => {
                        const formattedPokemons = pokemonDetails.map((pokemon, index) => ({
                            id: index + 1, // Since PokeAPI starts from index 1
                            name: { english: pokemon.name },
                            abilities: pokemon.abilities,
                            stats: pokemon.stats,
                            types: pokemon.types
                        }));
                        setPokemons(formattedPokemons);
                    });
            })
            .catch(error => console.error("There was an error fetching the pokemons:", error));
    }, []);

    const handleFight = () => {
        alert('Fight!');
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const renderPokemonCard = (pokemon) => {
        if (!pokemon) return null; // Handle case where pokemon is not defined

        return (
            <div className="bg-white rounded-lg shadow-lg p-4 flex">
                <img src={`https://img.pokemondb.net/artwork/${pokemon.name.english.toLowerCase()}.jpg`} alt={pokemon.name.english} className="w-32 h-32" />
                <div className="ml-4">
                    <h3 className="text-xl font-bold">{capitalizeFirstLetter(pokemon.name.english)}</h3>
                    <p>Abilities: {pokemon.abilities ? pokemon.abilities.map(ability => capitalizeFirstLetter(ability.ability.name)).join(', ') : 'Unknown'}</p>
                    <p>Stats:</p>
                    <ul>
                        {pokemon.stats.map(stat => (
                            <li key={stat.stat.name}>{capitalizeFirstLetter(stat.stat.name)}: {stat.base_stat}</li>
                        ))}
                    </ul>
                    <p>Types: {pokemon.types.map(type => capitalizeFirstLetter(type.type.name)).join(', ')}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center space-y-8">
            <div className="flex items-center space-x-4">
                <select
                    onChange={(e) => setSelectedPokemons({ ...selectedPokemons, left: e.target.value })}
                    value={selectedPokemons.left || ''}
                    className="px-4 py-2 border rounded"
                >
                    <option value="" disabled>Select Pokemon</option>
                    {pokemons.map(pokemon => (
                        <option key={pokemon.id} value={pokemon.id}>{pokemon.name.english.charAt(0).toUpperCase() + pokemon.name.english.slice(1)}</option>
                    ))}
                </select>
                <span className="text-2xl">VS</span>
                <select
                    onChange={(e) => setSelectedPokemons({ ...selectedPokemons, right: e.target.value })}
                    value={selectedPokemons.right || ''}
                    className="px-4 py-2 border rounded"
                >
                    <option value="" disabled>Select Pokemon</option>
                    {pokemons.map(pokemon => (
                        <option key={pokemon.id} value={pokemon.id}>{pokemon.name.english.charAt(0).toUpperCase() + pokemon.name.english.slice(1)}</option>
                    ))}
                </select>
            </div>
            <div className="flex space-x-8">
                {selectedPokemons.left && renderPokemonCard(pokemons.find(p => p.id === parseInt(selectedPokemons.left)))}
                {selectedPokemons.right && renderPokemonCard(pokemons.find(p => p.id === parseInt(selectedPokemons.right)))}
            </div>
            <button onClick={handleFight} className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Fight
            </button>
        </div>
    );
};

export default FightPreview;