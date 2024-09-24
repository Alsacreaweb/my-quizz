import React from 'react'
import ReactDOM from 'react-dom/client'
import Game from './pages/Game.tsx'
import CreateQuizz from './pages/CreateQuizz.tsx'
import './index.css'
import 'toastr/build/toastr.css'
import toastr from 'toastr';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


toastr.options.progressBar = true;
toastr.options.timeOut = 5000;

const router = createBrowserRouter([
  {
    path: "/",
    element: <Game />,
  },
  {
    path: "/create",
    element: <CreateQuizz />,
  }
]);


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
