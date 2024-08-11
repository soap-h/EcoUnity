import React from 'react'
import { TailSpin, Circles, Grid, Hearts, Oval, Puff, Rings, ThreeDots } from 'react-loader-spinner';

function Loading() {
    return (
        <div style={{ width: "100px", margin: "auto" }}>
            <TailSpin height="80" widht="80" color="#4fa94d" radius="1" wrapperStyle={{}} wrapperClass='' visible={true}></TailSpin>
            <Circles visible={true}/>
            <Grid visible={true}/>
            <Hearts visible={true}/>
            <Oval visible={true}/>
            <Puff visible={true}/>
            <Rings visible={true}/>
            <ThreeDots visible={true}/>
        </div>
    )
}

export default Loading