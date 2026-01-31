import { useQuery, useQueryClient } from '@tanstack/react-query';
import {useNavigate} from "react-router-dom";
import './PageNotFound.css';

export default function PageNotFound() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: noMessage, error, isLoading } = useQuery({
        queryKey: ['Page not found'],
        queryFn: async () => {
            const res = await fetch("https://naas.isalman.dev/no");
            if (!res.ok) {
                throw new Error(`Failed to fetch NO message: ${res.status}`);
            }
            const text = await res.json();
            return text.reason || 'No message available';
        },
    });

    const reloadMessage = () => {
        queryClient.invalidateQueries({ queryKey: ['Page not found'] });
    };

    return (
        <div className="page-not-found">
            <h1 className="title">404</h1>
            <br/>
            <p className="message">
                {isLoading ? 'Loading a funny NO message...' : error ? `Oops! ${error.message}` : `${noMessage}`}
            </p>
            <br/>
            <div className="buttons">
                <button
                    className="btn-primary"
                    onClick={() => navigate("/pokedex")}
                >
                    Go to Pokedex
                </button>
                <button
                    className="btn-secondary"
                    onClick={reloadMessage}
                >
                    Reload Message
                </button>
            </div>
        </div>
    )
}
