import { Grid } from "@mantine/core";
import { useContext, useEffect, useState } from "react";

import { CharacterChip } from "../components/CharacterChip";
import { CombatChip } from "../components/combat/CombatChip";
import { TICK_INTERVAL, TICK_MULTIPLIER } from "../game/Constants";
import { GameContext } from "../game/Game";

export function CombatScreen() {
    const game = useContext(GameContext);

    const [lastTime, setLastTime] = useState<number>(performance.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const now = performance.now();
            const interval = now - lastTime;
            setLastTime(now);

            if (game) {
                game.tick(interval * TICK_MULTIPLIER);
            }
        }, TICK_INTERVAL);

        return () => clearInterval(interval);
    });

    if (!game) {
        return <></>;
    }

    return (
        <Grid>
            <Grid.Col span={12}>Timer: {game.interval}</Grid.Col>
            <Grid.Col span={6}>
                <Grid>
                    {...game.characterCombatants.map((value) => (
                        <Grid.Col span={12} key={value.id}>
                            <CombatChip combatant={value} />
                        </Grid.Col>
                    ))}
                </Grid>
            </Grid.Col>
            <Grid.Col span={6}>
                <Grid>
                    {...game.monsterCombatants.map((value) => (
                        <Grid.Col span={12} key={value.id}>
                            <CombatChip combatant={value} />
                        </Grid.Col>
                    ))}
                </Grid>
            </Grid.Col>

            <Grid.Col span={6}>
                <CharacterChip character={game.characters[0]} />
            </Grid.Col>
        </Grid>
    );
}
