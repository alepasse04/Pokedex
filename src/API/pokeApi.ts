import type {Ability, Pokemon, PokemonType} from "../types/pokemons.ts";

export const fetchPokemons = async (setPokemons: (pokemons: Pokemon[] | ((prev: Pokemon[]) => Pokemon[])) => void) => {
    const apiUrl = 'https://pokeapi.co/api/v2';
    const batchSize = 100;
    const totalPokemons = 721;
    try {
        // First, fetch first 9 Pokemon
        const firstBatchResponse = await fetch(`${apiUrl}/pokemon?limit=9&offset=0`);
        if (!firstBatchResponse.ok) {
            throw new Error('Network response was not ok for first batch');
        }
        const firstBatchData = await firstBatchResponse.json();
        const firstPokemonList = firstBatchData.results;

        const firstUpdatedPokemonList = await Promise.all(
            firstPokemonList.map(async (pokemon: Pokemon) => {
                const res = await fetch(pokemon.url);
                if(!res.ok){
                    throw new Error(`Network response was not ok for ${pokemon.name}`);
                }
                const pokemonData = await res.json();

                const types = pokemonData.types.map(({ type }: PokemonType) => type.name);

                const abilities = pokemonData.abilities.map(({ ability }: Ability) => ability.name);
                const { sprites } = pokemonData;
                const image = sprites.front_default;

                const id = pokemonData.id;

                return {...pokemon, id, types, abilities, image};
            })
        );

        setPokemons(firstUpdatedPokemonList);

        // Then, fetch the rest in background sequentially to avoid overwhelming the server
        const restBatches = [];
        for (let i = 9; i < totalPokemons; i += batchSize) {
            const limit = Math.min(batchSize, totalPokemons - i);
            const offset = i;
            restBatches.push({ limit, offset });
        }

        const restResults = [];
        for (const { limit, offset } of restBatches) {
            const response = await fetch(`${apiUrl}/pokemon?limit=${limit}&offset=${offset}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            restResults.push(data.results);
            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        const restPokemonList = restResults.flat();

        const restUpdatedPokemonList = await Promise.all(
            restPokemonList.map(async (pokemon) => {
                const res = await fetch(pokemon.url);
                if(!res.ok){
                    throw new Error(`Network response was not ok for ${pokemon.name}`);
                }
                const pokemonData = await res.json();

                const types = pokemonData.types.map(({ type }: PokemonType) => type.name);

                const abilities = pokemonData.abilities.map(({ ability }: Ability) => ability.name);
                const { sprites } = pokemonData;
                const image = sprites.front_default;

                const id = pokemonData.id;

                return {...pokemon, id, types, abilities, image};
            })
        );

        setPokemons(prev => [...prev, ...restUpdatedPokemonList]);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }

}

export const getPokemonDescription = async (id: number): Promise<{ description: string }> => {
    const apiUrl = 'https://pokeapi.co/api/v2';
    try {
        // Fetch characteristic for characteristic description
        console.log(id);
        const Res = await fetch(`${apiUrl}/characteristic/${id}`);
        const Data = await Res.json();
        const Description = Data.descriptions.find((desc: { language: { name: string }; description: string }) => desc.language.name === 'en')?.description || 'No description available.';

        return { description: Description };
    } catch (error) {
        console.error('Error fetching Pokemon details:', error);
        throw error;
    }

}
