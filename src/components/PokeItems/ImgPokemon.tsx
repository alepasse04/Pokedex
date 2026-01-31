import React from 'react';
import './imgPokemon.css'

const ImgPokemon: React.FC<{ image: string }> = ({
                                                     image
                                                 }) => {
    if (!image) return <div></div>;
    return (
        <div className="pokemon-img">
            <img src={image} alt="" />
        </div>
    );
};

export default ImgPokemon;