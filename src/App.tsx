import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import EmbedElement from "./components/EmbedElement";
import Home from "./components/Home";

export const elements = [
    {
        name: 'User Management',
        key: "um",
        url: 'https://embed.permit.io/um?envId=9411d7fec2fb4f1fa647bd63b5e20917&darkMode=false'
    },
    {
        name: 'Audit log',
        key: 'al',
        url: 'https://embed.permit.io/al?envId=9411d7fec2fb4f1fa647bd63b5e20917&darkMode=false'
    },
    {
        name: 'Access Request',
        key: 'ar',
        url: 'https://embed.permit.io/ar?envId=9411d7fec2fb4f1fa647bd63b5e20917&darkMode=false&tenantKey=default'
    },
    {
        name: 'Operation Approval',
        key: 'oa',
        url: 'https://embed.permit.io/oa?envId=9411d7fec2fb4f1fa647bd63b5e20917&darkMode=false&resourceInstanceKey=NewResourceInstanceKey&tenantKey=default'
    },
    {
        name: 'Approval Management',
        key: 'am',
        url: 'https://embed.permit.io/am?envId=9411d7fec2fb4f1fa647bd63b5e20917&darkMode=false'
    },
]

function App() {

    return (
        <div className="App">
            <BrowserRouter>
                <Home/>
                <Routes>
                    <Route path="/" element={<div/>}/>
                    {elements?.map(({name, url, key}) => (
                        <Route
                            key={name}
                            path={`/${key}`}
                            element={
                                <EmbedElement
                                    src={url}
                                    name={key}
                                />
                            }
                        />
                    ))}

                </Routes>
            </BrowserRouter>

        </div>
    );
}

export default App;
