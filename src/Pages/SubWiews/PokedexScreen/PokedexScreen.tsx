import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type {PokemonProps} from "../../../types/pokemons.ts";
import PokemonName from "../../../components/PokeItems/PokemonName.tsx";
import ImgPokemon from "../../../components/PokeItems/ImgPokemon.tsx";
import "./pokedexScreen.css"

const PokedexScreen: React.FC<PokemonProps & { current: number; setCurrent: (index: number) => void }> = ({
    pokemons,
    current,
    setCurrent,
}) => {

    const navigate = useNavigate();
    const [inputId, setInputId] = useState('');
    const timeoutRef = useRef<number | null>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key >= '0' && e.key <= '9') {
                const newInput = inputId + e.key;
                setInputId(newInput);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    const id = parseInt(newInput, 10);
                    const index = pokemons.findIndex(p => p.id === id);
                    if (index !== -1) {
                        setCurrent(index);
                    }
                    setInputId('');
                }, 1000);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [inputId, pokemons, setCurrent]);

    const prev = pokemons[current - 1];
    const curr = pokemons[current];
    const next = pokemons[current + 1];

    const start = Math.max(0, current - 4);
    const end = Math.min(pokemons.length, current + 5);
    const names = pokemons.slice(start, end);

    return (
        <div className="pokedex">
            <div className="BG_pokeball"></div>
            <div className="BG_list">
                <div className='pkmImg'>
                    {prev && <ImgPokemon image={prev.image} />}
                    {curr && <ImgPokemon image={curr.image} />}
                    {next && <ImgPokemon image={next.image} />}
                </div>

            </div>
            <div className="list">
                <div className="selector"></div>
                <div className="identificatore">
                    {
                        names.map((pokemon, index) => {
                            const isCurrent = start + index === current;
                            return (
                                <div className={`pokemonItem ${isCurrent ? 'current' : ''}`} key={pokemon.id} onClick={isCurrent ? () => navigate('/details') : undefined}>
                                    <PokemonName id={pokemon.id} name={pokemon.name} />
                                </div>

                            )
                        })
                    }
                </div>

            </div>

        </div>
    )
}

export default PokedexScreen;