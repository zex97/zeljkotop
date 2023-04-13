// @flow
import React from 'react';
import './Header.css';
import coin from '../../assets/backgrounds/coin.gif';

type Props = {

}

export default class Header extends React.PureComponent<Props> {
    render() {
        const { position } = this.props
        return (
            <div className="scorebar row">
                {/*<div className="col-3">*/}
                {/*    <span>MARIO</span>*/}
                {/*    <span>OOOOOO</span>*/}
                {/*</div>*/}
                {/*<div className="col-3">*/}
                {/*  <span>*/}
                {/*      <img src={coin} height="20px"/> x OO*/}
                {/*  </span>*/}
                {/*</div>*/}
                {/*<div className="col-3">*/}
                {/*    <span>WORLD</span>*/}
                {/*    <span>1 - 1</span>*/}
                {/*</div>*/}
                {/*<div className="col-3">*/}
                {/*    <span>TIME</span>*/}
                {/*    <span>111</span>*/}
                {/*</div>*/}

            </div>
        )
    }
}
