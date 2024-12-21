import { MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "./App.css";
import "./internationalisation";

import { theme } from "./theme";

import { data, DataContext } from "./Data.tsx";
import { CharacterChip } from "./components/CharacterChip.tsx";
import { MonsterChip } from "./components/MonsterChip";
import { buildCharacter, CharacterBuilder } from "./game/CharacterBuilder";
import { buildMonster, MonsterBuilder } from "./game/MonsterBuilder.ts";

function App() {
    const character = buildCharacter(
        CharacterBuilder.new()
            .withName("Test")
            .withClass("fighter")
            .withRace("human")
    );

    const monster = buildMonster(MonsterBuilder.new("goblin"));

    return (
        <MantineProvider theme={theme}>
            <DataContext.Provider value={data}>
                <CharacterChip character={character} />
                <MonsterChip monster={monster} />
            </DataContext.Provider>
        </MantineProvider>
    );
}

export default App;
