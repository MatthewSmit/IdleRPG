import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "./App.css";
import "./internationalisation";

import { theme } from "./theme";

import { data, DataContext } from "./Data.tsx";
import { Character } from "./game/Character.ts";
import { CharacterChip } from "./components/CharacterChip.tsx";

function App() {
    const character = new Character();

    return (
        <MantineProvider theme={theme}>
            <DataContext.Provider value={data}>
                <CharacterChip character={character} />
            </DataContext.Provider>
        </MantineProvider>
    );
}

export default App;
