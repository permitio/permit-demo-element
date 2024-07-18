import React from 'react';
import {useNavigate} from "react-router-dom";
import Login from "./Login";

export const btnStyle = {
    margin: '10px',
    backgroundColor: 'white',
    color: 'black',
    border: '2px solid black',
    padding: '20px 10px',
    fontSize: '16px',
    borderRadius: '8px',
    cursor: 'pointer',
}

const Home = () => {

    const nav = useNavigate();


    return (
        <div>

            <Login/>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                    <div >

                        <button
                            style={btnStyle}
                            onClick={() => {
                                nav(`/embed`);
                            }}
                        >
                           GO TO EMBED
                        </button>
                    </div>


            </div>




        </div>
    );
}

export default Home;