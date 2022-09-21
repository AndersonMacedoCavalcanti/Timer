import {createContext, ReactNode, useEffect, useReducer, useState} from 'react'
import {ActionTypes, Cycle, cyclesReducer} from "../reducers/cycles";


interface NewCycleFormData {
    task: string
    minutesAmount: number
}

interface CyclesContextType {
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    markCurrentCycleAsFinished: () => void
    amountSecondsPassed: number
    setSecondsPassed: (seconds: number) => void
    InterruptCycle: () => void
    CreateNewCycle: (data: NewCycleFormData) => void
    cycles: Cycle[]
}

interface CyclesContextProviderProps {
    children: ReactNode
}


export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({children}: CyclesContextProviderProps) {


    const [cyclesState, dispatch] = useReducer(cyclesReducer,
        {
            cycles: [],
            activeCycleId: null
        }, () => {
            const storageStateAsJSON = localStorage.getItem('@timer:cyclesState-1.0.0');

            if (storageStateAsJSON) {
                return JSON.parse(storageStateAsJSON)
            }
        }
    )


    useEffect(() => {
        const stateJSON = JSON.stringify(cyclesState)

        localStorage.setItem('@timer:cyclesState-1.0.0', stateJSON)
    }, [cyclesState])


    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

    const {cycles, activeCycleId} = cyclesState

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    function setSecondsPassed(seconds: number) {
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {

        dispatch({
            type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
            payload: {
                activeCycleId
            }
        })


    }

    function InterruptCycle() {

        dispatch({
            type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
            payload: {
                activeCycleId
            }
        })

    }

    function CreateNewCycle(data: NewCycleFormData) {
        const newCycle: Cycle = {
            id: String(new Date().getTime()),
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date(),
        }
        dispatch({
            type: ActionTypes.ADD_NEW_CYCLE,
            payload: {
                newCycle
            }
        })
        setAmountSecondsPassed(0)
    }

    return (
        <CyclesContext.Provider
            value={{
                activeCycle,
                activeCycleId,
                markCurrentCycleAsFinished,
                amountSecondsPassed,
                setSecondsPassed,
                CreateNewCycle,
                InterruptCycle,
                cycles,
            }}
        >
            {children}
        </CyclesContext.Provider>
    )
}
