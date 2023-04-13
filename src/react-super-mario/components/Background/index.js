// @flow
import React, { useState } from 'react';
import variables from '../../util/variables';
import './Background.css';
import coin from '../../assets/backgrounds/coin.gif';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp, faVolumeXmark } from '@fortawesome/free-solid-svg-icons';

type Props = {
    position: number,
    callback: any
}

export default function Background(props: Props) {
    const { position, callback} = props;
    const [active, setActive] = useState(true);

    const handleMuteUnmute = () => {
        // execute callback for pausing/playing music
        callback();
        setActive(!active);
        document.activeElement.blur();
    };

    return (
        <div
            className="Background"
            style={{
                backgroundPosition: `
          left ${-((position * (variables.groundWidth / 80)))}px bottom 0px,
          left ${-((position * (variables.bushesWidth / 700)))}px bottom ${variables.groundHeight}px,
          left ${-((position * (variables.backWidth / 1000)))}px bottom 0px
        `
            }}
        >
            <div className="container scorebar">
                <div className="row">
                    <div className="col-3">
                        <div>MARIO</div>
                        <div>OOOOOO</div>
                    </div>
                    <div className="col-3">
                        <span>
                            <img src={coin} height="20px"/> x OO
                        </span>
                    </div>
                    <div className="col-3">
                        <div>WORLD</div>
                        <div>1 - 1</div>
                    </div>
                    <div className="col-3">
                        <div>TIME</div>
                        <div>&nbsp;111</div>
                    </div>
                </div>
            </div>

            <Button
                variant={active ? 'primary' : 'dark'}
                className={`float-end mx-3 ${active ? '' : 'active'}`}
                onClick={handleMuteUnmute}
            >
                <FontAwesomeIcon icon={active ? faVolumeUp : faVolumeXmark} />
            </Button>
        </div>
    );
}
