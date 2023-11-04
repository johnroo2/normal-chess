import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/index.css'
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'
import ErrorPage from './pages/errorPage.tsx'

import Home from './pages/index.tsx'
import Play from './pages/play.tsx'

const route = (path:string, element:JSX.Element, loader:Function, children:any[]) => {
  return {path:path, 
    element:element, 
    loader:loader, 
    children:children,
    errorElement: <ErrorPage />,
  } as RouteObject
}

const router = createBrowserRouter([
  route("/", <Home />, () => null, []),
  route("/play", <Play />, () => null, []),
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
