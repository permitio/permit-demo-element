import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import EmbedElement from "./components/EmbedElement";
import Home from "./components/Home";


function App() {

    return (
        <div className="App">
            <BrowserRouter>
                <Home/>
                <Routes>
                    <Route path="/" element={<div/>}/>
                        <Route
                            path={`/embed`}
                            element={
                                <EmbedElement
                                />
                            }
                        />

                </Routes>
            </BrowserRouter>

        </div>
    );
}

export default App;
