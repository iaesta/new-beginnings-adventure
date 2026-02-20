import { useGameState } from '@/game/useGameState';
import IntroScreen from '@/components/game/IntroScreen';
import GameScreen from '@/components/game/GameScreen';
import EndingScreen from '@/components/game/EndingScreen';

const Index = () => {
  const { state, startGame, performAction, skipDay, resetGame, availableActions } = useGameState();

  if (state.phase === 'intro') {
    return <IntroScreen jobTitle={state.jobTitle} onStart={startGame} />;
  }

  if (state.phase === 'ending') {
    return <EndingScreen state={state} onRestart={resetGame} />;
  }

  return (
    <GameScreen
      state={state}
      availableActions={availableActions}
      onAction={performAction}
      onSkipDay={skipDay}
    />
  );
};

export default Index;
