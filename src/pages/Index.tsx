import GameScreen from "@/components/game/GameScreen";
import IntroScreen from "@/components/game/IntroScreen";
import EndingScreen from "@/components/game/EndingScreen";
import useGameState from "@/game/useGameState";

export default function Index() {
  const { state, availableActions, onAction, onSkipDay, onStart, onRestart } = useGameState();

  if (state.phase === "intro") {
    return <IntroScreen onStart={onStart} jobTitle={state.jobTitle} />;
  }

  if (state.phase === "ending") {
    return <EndingScreen state={state} onRestart={onRestart} />;
  }

  return (
    <GameScreen
      state={state}
      availableActions={availableActions}
      onAction={onAction}
      onSkipDay={onSkipDay}
    />
  );
}

