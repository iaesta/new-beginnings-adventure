import { useText } from "@/game/i18n";
interface IntroScreenProps {
  jobTitle: string;
  onStart: () => void;
}

const IntroScreen = ({ jobTitle, onStart }: IntroScreenProps) => {
  const T = useText();
  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <div className="max-w-md w-full text-center space-y-8 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif text-primary text-glow-primary">
            Fresh Start
          </h1>
          <p className="text-sm text-muted-foreground tracking-widest uppercase">
            A game about beginning again
          </p>
        </div>

        <div className="space-y-4 text-sm text-secondary-foreground leading-relaxed font-serif italic">
          <p>You quit your old life.</p>
          <p>New city. New apartment. New job.</p>
          <p>
            You start Monday as a <span className="text-primary">{jobTitle}</span>.
          </p>
          <p>You have $20, a suitcase, and something to prove.</p>
        </div>

        <button
          onClick={onStart}
          className="px-8 py-3 rounded-md border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-sm tracking-wider uppercase"
        >
          Begin
        </button>

        <p className="text-xs text-muted-foreground">
          Manage your energy. Build your skills. Find your footing.
        </p>
      </div>
    </div>
  );
};

export default IntroScreen;
