import React from 'react';



const EmbedElement = () => {


    // TODO paste your iframe code here
    return (
        <div style={{height: "60vh", width: '80%', margin: '0 auto'}}>
            <iframe
                title="Permit Element um"
            src="https://embed.permit.io/request-access-tut?envId=210166d8be96497b88618d01f7c773eb&darkMode=false&tenantKey=default"
                width="100%"
                height="100%"
               />
        </div>
    );
}

export default EmbedElement;