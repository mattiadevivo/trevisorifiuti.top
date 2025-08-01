import { ErrorBoundary, ParentProps, type Component } from "solid-js";

import { Navbar } from "@ui/navbar";
import { ThemeProvider } from "./context/theme";

interface Props extends ParentProps {}

const App: Component<Props> = (props) => {
  return (
    <ThemeProvider>
      <ErrorBoundary
        fallback={(error, reset) => (
          <div>
            <p>Something went wrong: {error.message}</p>
            <button onClick={reset}>Try Again</button>
          </div>
        )}
      >
        <Navbar />
        {props.children}
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
