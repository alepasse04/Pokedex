import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type {PokemonProps} from "../../../types/pokemons.ts";
import { getPokemonDescription } from "../../../API/pokeApi.ts";
import PokemonName from "../../../components/PokeItems/PokemonName.tsx";
import ImgPokemon from "../../../components/PokeItems/ImgPokemon.tsx";
import "./pokedexDetails.css"

const PokedexDetails: React.FC<PokemonProps & { current: number; setCurrent: (index: number) => void }> = ({
    pokemons,
    current,
}) => {

    const navigate = useNavigate();
    const curr = pokemons[current];

    const { data: details, isLoading, error } = useQuery({
        queryKey: ['pokemonDetails', curr?.id],
        queryFn: () => getPokemonDescription(curr!.id),
        enabled: !!curr && !!curr.id,
    });

    if (!curr) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <div className="info">
                <div className='info-sprite'>
                    {curr && <ImgPokemon image={curr.image} />}
                </div>

                <div className="details">
                    <div className="name" onClick={() => navigate('/pokedex/list')}>
                        <PokemonName id={curr.id} name={curr.name} />
                    </div>
                    <div className="types">
                        <strong>Type:</strong> {curr.types.join(', ')}
                    </div>
                    <br/>
                    <div className="abilities">
                        <strong>Abilities:<br/></strong> {curr.abilities.join(', ')}
                    </div>
                </div>
        </div>
        <div className="description">
            <strong>Description:</strong>
            <br/>
            {isLoading ? 'Loading description...' : error ? 'Error loading description' : details?.description}
        </div>
        </>
    )
}

export default PokedexDetails;