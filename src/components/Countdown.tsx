import moment from 'moment';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import CSS from 'csstype'

interface Props {
    endTimeSeconds: number;
    onExpire: () => void;
    style?: CSS.Properties
}

export const Countdown = ({ endTimeSeconds, onExpire, style }: Props) => {
    const [expiration, setExpiration] = useState("Calculating...");

    useEffect(() => {
        const intervalId = setInterval(() => {
            if (expiration !== 'Expired') {
                const now = Math.floor(Date.now() / 1000);
                const duration = moment.duration(endTimeSeconds - now, 'seconds');

                if (duration.asSeconds() < 1) {
                    setExpiration('Expired');
                    onExpire()
                } else if (duration.minutes() > 1) {
                    setExpiration(`${duration.minutes()} minute${duration.minutes() > 1 ? 's' : ''}`)
                } else {
                    setExpiration(`${duration.seconds()} second${duration.seconds() > 1 ? 's' : ''}`)
                }
            }
        })
        return () => clearInterval(intervalId)

    }, [])

    return (
        <span style={style}>{expiration}</span>
    )
}