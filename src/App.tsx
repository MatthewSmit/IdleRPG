import { Container, MantineProvider } from "@mantine/core";

import "@mantine/core/styles.css";
import "./App.css";
import "./internationalisation";
import { Game, GameContext } from "./game/Game";
import { CombatScreen } from "./screens/CombatScreen";

import { theme } from "./theme";

import { data, DataContext } from "./Data.tsx";
import { buildCharacter, CharacterBuilder } from "./game/CharacterBuilder";

const game = new Game();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).game = game;

game.addCharacter(
    buildCharacter(
        CharacterBuilder.new()
            .withName("Test")
            .withClass("fighter")
            .withRace("human")
    )
);

game.addCharacterCombatant(game.characters[0]);

function App() {
    return (
        <MantineProvider theme={theme}>
            <DataContext.Provider value={data}>
                <GameContext.Provider value={game}>
                    <Container fluid>
                        <CombatScreen />
                    </Container>
                </GameContext.Provider>
            </DataContext.Provider>
        </MantineProvider>
    );
}

export default App;
