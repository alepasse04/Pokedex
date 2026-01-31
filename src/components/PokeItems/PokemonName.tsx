import React from "react";
import './pokemonName.css'

const PokemonName: React.FC<{ id: number; name: string }> = ({
id, name
}) => {
    if (id === 0) return <div></div>;
    return (
        <div className="pokemon-card">
                <div className="image"></div>
                <h3 className="id">{id.toString().padStart(3, '0')}</h3>
                <h3 className="name"> {name}</h3>
        </div>
    )
}

export default PokemonName;