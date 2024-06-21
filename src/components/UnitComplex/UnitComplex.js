import React from "react";
import Unit from "../Unit/Unit";


export default class UnitComplex extends React.Component {

    render () {
        return <>
            <Unit mode="d" verticalAlignment="top" horizontalAlignment="left" size="large" color="blue" />
            <Unit mode="d" verticalAlignment="middle" horizontalAlignment="left" size="large" color="blue" />
            <Unit mode="d" verticalAlignment="bottom" horizontalAlignment="left" size="large" color="blue" />

            <Unit mode="l" verticalAlignment="top" horizontalAlignment="middle" size="large" color="green" />
            <Unit mode="l" verticalAlignment="middle" horizontalAlignment="middle" size="large" color="green" />
            <Unit mode="l" verticalAlignment="bottom" horizontalAlignment="middle" size="large" color="green" />

            <Unit mode="s" verticalAlignment="top" horizontalAlignment="right" size="large" color="red" />
            <Unit mode="s" verticalAlignment="middle" horizontalAlignment="right" size="large" color="red" />
            <Unit mode="s" verticalAlignment="bottom" horizontalAlignment="right" size="large" color="red" />

            <Unit mode="n" verticalAlignment="top" horizontalAlignment="left" size="small" color="orange" />
            <Unit mode="n" verticalAlignment="middle" horizontalAlignment="left" size="small" color="orange" />
            <Unit mode="n" verticalAlignment="bottom" horizontalAlignment="left" size="small" color="orange" />

            <Unit verticalAlignment="top" horizontalAlignment="right" size="small" color="purple" />
            <Unit verticalAlignment="middle" horizontalAlignment="right" size="small" color="purple" />
            <Unit verticalAlignment="bottom" horizontalAlignment="right" size="small" color="purple" />
        </>
    }
}