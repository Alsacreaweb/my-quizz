import React from 'react';
import ReactDOM from 'react-dom/client';
import Game from './pages/Game.tsx';
import CreateQuizz from './pages/CreateQuizz.tsx';
import './index.css';
import 'toastr/build/toastr.css';
import toastr from 'toastr';
import { HashRouter, Routes, Route } from "react-router-dom";

toastr.options.progressBar = true;
toastr.options.timeOut = 5000;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/create" element={<CreateQuizz />} />
      </Routes>
    </HashRouter>
  </React.StrictMode>,
);
