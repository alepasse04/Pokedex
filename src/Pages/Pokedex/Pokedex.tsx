// Pokedex.tsx
import {useEffect, useState, useRef} from "react";
import {useNavigate} from 'react-router-dom'
import type {Pokemon} from "../../types/pokemons.ts";
import { fetchPokemons } from "../../API/pokeApi.ts";
import PokedexScreen from "../SubWiews/PokedexScreen/PokedexScreen.tsx";
import PokedexDetails from "../SubWiews/PokedexDetails/PokedexDetails.tsx";
import PokemonSong from "../../assets/souds/PokemonSong.mp3";

import "./pokedex.css";
import '../../styles/tabler-icons.min.css'

type View = 'screen' | 'details';

function Pokedex() {
    const navigate = useNavigate();
    const [showAnimation, setShowAnimation] = useState(true);
    const [availablePokemons, setAvailablePokemons] = useState<Pokemon[]>([]);
    const [current, setCurrent] = useState(4); // Index of the current Pokemon
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentView, setCurrentView] = useState<View>('screen');
    const audioRef = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
        //fetch available pokemons
        const fetchData = async () => {
            fetchPokemons(setAvailablePokemons);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setShowAnimation(false), 6000); // Adjust duration
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        audioRef.current = new Audio(PokemonSong);
        audioRef.current.loop = true;
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setCurrent(prev => prev - 1 < 0 ? availablePokemons.length - 1 : prev - 1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setCurrent(prev => prev + 1 >= availablePokemons.length ? 0 : prev + 1);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [availablePokemons.length]);

    return(
        <>
            <div className="cover top"></div>
            <div className="cover bottom">
                <div className="middle"></div>
            </div>
            <header></header>

            <section className="blobs">
                <a onClick={() => setCurrentView('screen')} target="_blank"><img src="/src/assets/icons/Pika3.png" alt=""/></a>
                <a href="https://github.com/hotheadhacker/no-as-a-service" target="_blank"></a>
                <a href="https://pokeapi.co/docs/v2" target="_blank"></a>
                <a href="https://pokecord.org/" target="_blank"></a>
            </section>

            <section className="lights">
                <div></div>
                <div></div>
            </section>

            <div className="container">
                <section className="main">
                    <div className="maintext">
                        {
                            showAnimation ? <div className="animation"></div> :
                            currentView === 'screen'
                                ? <PokedexScreen pokemons={availablePokemons} current={current} setCurrent={setCurrent} />
                                : <PokedexDetails pokemons={availablePokemons} current={current} setCurrent={setCurrent} />
                        }
                    </div>
                    <section className="decoration">
                        <div className="buttons">
                            <a onClick={() => navigate('/')}><i className="ti ti-error-404-off"></i></a>
                            <a onClick={() => setCurrentView('screen')}><i
                                className="ti ti-home-2"></i></a>
                            <a onClick={() => setCurrentView('details')} className="search"><i
                                className="ti ti-search"></i></a>
                        </div>
                        <div className="vents">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </section>
                </section>
                <div className="right-screen">
                    <div className="screen">
                        <p><strong className="time">{new Date().toDateString()}</strong><br/><span className="goto"></span></p>
                    </div>
                    <div className="screen-buttons">
                        <button className={`ti ${isPlaying ? 'ti-player-pause' : 'ti-music'}`} onClick={toggleMusic}></button>
                        <button className="use" onClick={() => setCurrentView('details')}>use</button>
                    </div>
                    <div className="infoBox">
                        <p><strong>Info:</strong>
                            <br/>
                            Utilizzare il D-pad per navigare il pokedex (o le freccie direzionali)</p>
                    </div>
                </div>

            </div>

            <footer>
                <nav>
                    <div>
                        <a target="_blank"><i className="ti ti-minus"></i></a>
                        <a ><i className="ti ti-minus"></i></a>
                    </div>
                    <div>
                        <a onClick={(e) => { e.preventDefault(); setCurrent(current - 1 < 0 ? availablePokemons.length - 1 : current - 1); }}><i className="ti ti-minus-vertical"></i></a>
                        <a onClick={(e) => { e.preventDefault(); setCurrent(current + 1 >= availablePokemons.length ? 0 : current + 1); }}><i className="ti ti-minus-vertical"></i></a>
                    </div>
                </nav>
                <div className="footer-buttons">
                    <button onClick={() => setCurrentView('details')}>A</button>
                    <button onClick={() => setCurrentView('screen')}>B</button>
                </div>
            </footer>
            <noscript>Please Enable Javascript To Use The Pokedex!</noscript>
        </>
    )
        ;
}

export default Pokedex;