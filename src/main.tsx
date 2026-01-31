import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './index.css'
import Pokedex from './Pages/Pokedex/Pokedex.tsx'
import PageNotFound from "./Pages/PageNotFound/PageNotFound.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
          <Routes>
              <Route path="/pokedex/*" element={<Pokedex />} />
              <Route path="/*" element={<PageNotFound />} />
          </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
