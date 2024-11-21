import { Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

import { Character } from "../game/Character.ts";

export interface ICharacterChipProps {
    character: Character;
}

export function CharacterChip(props: ICharacterChipProps) {
    const { character } = props;

    const { t } = useTranslation();
    const { t: classT } = useTranslation("class");

    return (
        <>
            <Text>
                {t("ui.characterChip.description", {
                    name: character.name,
                    level: character.level,
                    class: classT(character.class.id),
                })}
            </Text>
            <Text>
                {t("ui.characterChip.xp", {
                    xp: character.xp,
                    requiredXp: character.requiredXp,
                })}
            </Text>
            <Text>
                {t("ui.characterChip.strength", {
                    stat: character.stats.strength,
                })}
            </Text>
            <Text>
                {t("ui.characterChip.speed", {
                    stat: character.stats.speed,
                })}
            </Text>
            <Text>
                {t("ui.characterChip.agility", {
                    stat: character.stats.agility,
                })}
            </Text>
            <Text>
                {t("ui.characterChip.dexterity", {
                    stat: character.stats.dexterity,
                })}
            </Text>
            <Text>
                {t("ui.characterChip.stamina", {
                    stat: character.stats.stamina,
                })}
            </Text>
            <Text>
                {t("ui.characterChip.wisdom", {
                    stat: character.stats.wisdom,
                })}
            </Text>
            <Text>
                {t("ui.characterChip.intelligence", {
                    stat: character.stats.intelligence,
                })}
            </Text>
            <Text>
                {t("ui.characterChip.charisma", {
                    stat: character.stats.charisma,
                })}
            </Text>
        </>
    );
}
