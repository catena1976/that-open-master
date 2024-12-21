import * as React from 'react';

interface Props {
    handleOnToDotSearch: (value: string) => void
}

export function SearchBoxToDo( props: Props ) {

    return (
        <div style={ {display: "flex", alignItems: "center", columnGap: 10, width: "40%"}}>
            <input
                onChange={(e) => { props.handleOnToDotSearch(e.target.value)}}
                type="text"
                placeholder='Search ToDos by name...'
                style={{ width: "100%", height: "40px", backgroundColor: "var(--background-100"}}
            />
        </div>
    )
}