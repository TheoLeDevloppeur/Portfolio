import { Terminal } from "@/components/terminal/Terminal";
import { TerminalProvider } from "@/components/terminal/TerminalProvider";
import { isCvAvailable } from "@/lib/site";

/** Le site entier est un terminal. */
export default function Home() {
  return (
    <main className="backdrop relative h-dvh overflow-clip sm:p-5 lg:p-10">
      <div className="relative z-10 mx-auto h-full max-w-6xl">
        <TerminalProvider cvAvailable={isCvAvailable()}>
          <Terminal />
        </TerminalProvider>
      </div>
    </main>
  );
}
