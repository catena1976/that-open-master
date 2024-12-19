import * as React from 'react';

interface Props {
    handleOnProjectSearch: (value: string) => void
}

export function SearchBox( props: Props ) {

    return (
        <div style={ {display: "flex", alignItems: "center", columnGap: 10, width: "40%"}}>
            <input
                onChange={(e) => { props.handleOnProjectSearch(e.target.value)}}
                type="text"
                placeholder='Search projects by name...'
                style={{ width: "100%", height: "40px", backgroundColor: "var(--background-100"}}
            />
        </div>
    )
}