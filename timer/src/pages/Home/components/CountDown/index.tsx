import {CountContainer, Separator} from './styled'
import {useContext, useEffect} from 'react'
import {differenceInSeconds} from 'date-fns'
import {CyclesContext} from '../../../../context/CyclesContext'

export function CountDown() {
    const {
        activeCycle,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
    } = useContext(CyclesContext)

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

    const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0

    const minutesAmount = Math.floor(currentSeconds / 60)
    const secondsAmount = currentSeconds % 60

    const minutes = String(minutesAmount).padStart(2, '0')
    const seconds = String(secondsAmount).padStart(2, '0')

    useEffect(() => {
        if (activeCycle) {
            document.title = `${minutes}:${seconds}`
        }
    }, [minutes, seconds])

    useEffect(() => {
        let interval: number
        if (activeCycle) {
            interval = setInterval(() => {
                const secondsDiffrence = differenceInSeconds(
                    new Date(),
                    new Date(activeCycle.startDate),
                )

                if (secondsDiffrence >= totalSeconds) {
                    markCurrentCycleAsFinished()
                    setSecondsPassed(totalSeconds)
                    clearInterval(interval)
                } else {
                    setSecondsPassed(secondsDiffrence)
                }
            }, 1000)
        }

        return () => {
            clearInterval(interval)
        }
    }, [activeCycle, totalSeconds])

    return (
        <CountContainer>
            <span>{minutes[0]}</span>
            <span>{minutes[1]}</span>
            <Separator>:</Separator>
            <span>{seconds[0]}</span>
            <span>{seconds[1]}</span>
        </CountContainer>
    )
}
