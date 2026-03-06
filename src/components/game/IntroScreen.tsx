import { useI18n, useText } from "@/game/i18n";
interface IntroScreenProps {
  jobTitle: string;
  onStart: () => void;
}

const IntroScreen = ({ jobTitle, onStart }: IntroScreenProps) => {
  const { lang, setLang } = useI18n();
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
          <p>{T.INTRO.line1}</p>
          <p>{T.INTRO.line2}</p>
          <p>
            {T.INTRO.line3Prefix} <span className="text-primary">{jobTitle}</span>.
          </p>
          <p>{T.INTRO.line4}</p>
        </div>

        <button
          onClick={onStart}
          className="px-8 py-3 rounded-md border border-primary/50 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-sm tracking-wider uppercase"
        >
          Begin
        </button>

        <p className="text-xs text-muted-foreground">
          {T.INTRO.tip}
        </p>
      </div>
    </div>
  );
};

export default IntroScreen;
