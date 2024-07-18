import React from 'react';

interface Props {
    src: string
    name?: string

}

const EmbedElement = ({src, name}: Props) => {

    return (
        <div style={{height: "60vh", width: '80%', margin: '0 auto'}}>
            <iframe
                title="Permit Element"
                src={src}
                width="100%"
                height="100%"
                data-cy={`${name}-frame`}
                style={{border: "none"}}
            />
        </div>
    );
}

export default EmbedElement;