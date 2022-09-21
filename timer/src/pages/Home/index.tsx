import { HandPalm, Play } from 'phosphor-react'
import { ButtonContainer, HomeContainer, StopButtonContainer } from './styles'
import { NewCycleForm } from './components/NewCycleForm'
import { CountDown } from './components/CountDown'
import { useForm, FormProvider } from 'react-hook-form'
import { useContext } from 'react'
import { CyclesContext } from '../../context/CyclesContext'

interface NewCycleFormData {
  task: string
  minutesAmount: number
}

export function Home() {
  const { CreateNewCycle, InterruptCycle, activeCycle } =
    useContext(CyclesContext)

  const newCycleForm = useForm<NewCycleFormData>({
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  })

  const { handleSubmit, watch, reset } = newCycleForm

  function handleCreateNewCycle(data: NewCycleFormData) {
    CreateNewCycle(data)
    reset()
  }

  const task = watch('task')
  const isSubmitDisable = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <CountDown />

        {activeCycle ? (
          <StopButtonContainer type="button" onClick={InterruptCycle}>
            <HandPalm size={24} />
            Interromper
          </StopButtonContainer>
        ) : (
          <ButtonContainer disabled={isSubmitDisable} type="submit">
            <Play size={24} />
            Comecar
          </ButtonContainer>
        )}
      </form>
    </HomeContainer>
  )
}
