import { Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

import type { Monster } from "../game/Monster";

export interface IMonsterChipProps {
    monster: Monster;
}

export function MonsterChip(props: IMonsterChipProps) {
    const { monster } = props;

    const { t } = useTranslation();
    const { t: monsterT } = useTranslation("monster");

    return (
        <>
            <Text>{monsterT(monster.id)}</Text>
            <Text>
                {t("ui.character.health", {
                    value: monster.health,
                    max: monster.maxHealth,
                })}
            </Text>
            <Text>
                {t("ui.character.energy", {
                    value: monster.energy,
                    max: monster.maxEnergy,
                })}
            </Text>
            <Text>
                {t("ui.character.mana", {
                    value: monster.mana,
                    max: monster.maxMana,
                })}
            </Text>
            {/*TODO: attacks*/}
        </>
    );
}
