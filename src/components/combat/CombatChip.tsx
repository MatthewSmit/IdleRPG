import { Card, Progress, Stack, Text } from "@mantine/core";

import type { Combatant } from "../../game/combat/Combatant";
import { ACTION_RESULT_TIME, TICK_INTERVAL } from "../../game/Constants";

interface ICombatChipProps {
    combatant: Combatant;
}

export function CombatChip(props: ICombatChipProps) {
    const { combatant } = props;

    return (
        <Card shadow="md" padding="md" radius="md" withBorder>
            <Stack gap="sm">
                {combatant.name}
                {/*TODO: more information when a larger size*/}
                <Progress
                    value={(combatant.health / combatant.maxHealth) * 100}
                    size="lg"
                    transitionDuration={200}
                    color="red"
                />
                <Progress
                    value={(combatant.energy / combatant.maxEnergy) * 100}
                    size="lg"
                    transitionDuration={200}
                    color="yellow"
                />
                <Progress
                    value={(combatant.mana / combatant.maxMana) * 100}
                    size="lg"
                    transitionDuration={200}
                    color="blue"
                />
                {combatant.currentActions.map((action) => {
                    return (
                        <Progress
                            value={
                                (action.timeLeft / action.timeRequired) * 100
                            }
                            size="lg"
                            transitionDuration={TICK_INTERVAL}
                            color="green"
                        />
                    );
                })}
                {...combatant.actionResults.toReversed().map((result, i) => {
                    return (
                        <Text key={i}>
                            {result.text}{" "}
                            {Math.round(
                                (ACTION_RESULT_TIME - result.timeLeft) / 1000
                            )}{" "}
                            seconds ago
                        </Text>
                    );
                })}
            </Stack>
        </Card>
    );
}
