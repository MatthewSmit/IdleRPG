import { Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

import { Character } from "../game/Character";
import { RankDisplayType } from "../model/Skill";

export interface ICharacterChipProps {
    character: Character;
}

const rankDisplayType: RankDisplayType = "NUMBER";

export function CharacterChip(props: ICharacterChipProps) {
    const { character } = props;

    const { t } = useTranslation();
    const { t: classT } = useTranslation("class");
    const { t: raceT } = useTranslation("race");
    const { t: skillT } = useTranslation("skill");

    function rankText(rank: number): string {
        switch (rankDisplayType) {
            case "NUMBER":
                return t("ui.character.skill.rankNumber", {
                    rank,
                });

            case "LETTER": {
                let rankLetter;
                switch (rank) {
                    case 1:
                        rankLetter = "F";
                        break;
                    case 2:
                        rankLetter = "E";
                        break;
                    case 3:
                        rankLetter = "D";
                        break;
                    case 4:
                        rankLetter = "C";
                        break;
                    case 5:
                        rankLetter = "B";
                        break;
                    case 6:
                        rankLetter = "A";
                        break;
                    case 7:
                        rankLetter = "S";
                        break;
                    default:
                        return `UNKNOWN RANK ${rank}`;
                }
                return t("ui.character.skill.rankLetter", {
                    rank: rankLetter,
                });
            }

            case "WORD":
                switch (rank) {
                    case 1:
                        return t("ui.character.skill.rankWord1");
                    case 2:
                        return t("ui.character.skill.rankWord2");
                    case 3:
                        return t("ui.character.skill.rankWord3");
                    case 4:
                        return t("ui.character.skill.rankWord4");
                    case 5:
                        return t("ui.character.skill.rankWord5");
                    case 6:
                        return t("ui.character.skill.rankWord6");
                    case 7:
                        return t("ui.character.skill.rankWord7");
                    default:
                        return `UNKNOWN RANK ${rank}`;
                }
        }
    }

    return (
        <>
            <Text>
                {t("ui.character.description", {
                    name: character.name,
                    level: character.level,
                    class: classT(character.class.id),
                    race: raceT(character.race.id),
                })}
            </Text>
            <Text>
                {t("ui.character.xp", {
                    xp: character.xp,
                    requiredXp: character.requiredXp,
                })}
            </Text>
            <Text>
                {t("ui.character.strength", {
                    stat: character.stats.strength,
                })}
            </Text>
            <Text>
                {t("ui.character.speed", {
                    stat: character.stats.speed,
                })}
            </Text>
            <Text>
                {t("ui.character.agility", {
                    stat: character.stats.agility,
                })}
            </Text>
            <Text>
                {t("ui.character.dexterity", {
                    stat: character.stats.dexterity,
                })}
            </Text>
            <Text>
                {t("ui.character.stamina", {
                    stat: character.stats.stamina,
                })}
            </Text>
            <Text>
                {t("ui.character.wisdom", {
                    stat: character.stats.wisdom,
                })}
            </Text>
            <Text>
                {t("ui.character.intelligence", {
                    stat: character.stats.intelligence,
                })}
            </Text>
            <Text>
                {t("ui.character.charisma", {
                    stat: character.stats.charisma,
                })}
            </Text>
            {...character.allSkills
                .filter((skill) => skill.maxRank)
                .map((skill) => {
                    if (!skill.rank && !skill.maxRank) {
                        return (
                            <Text>
                                {t("ui.character.skill.unlearned", {
                                    skill: skillT(skill.id),
                                })}
                            </Text>
                        );
                    }

                    if (!skill.rank) {
                        return (
                            <Text>
                                {t("ui.character.skill.unlearned", {
                                    skill: skillT(skill.id),
                                })}
                                {" / "}
                                {t("ui.character.skill.maxRank", {
                                    rank: rankText(skill.maxRank),
                                })}
                            </Text>
                        );
                    }

                    return (
                        <Text>
                            {t("ui.character.skill.learned", {
                                skill: skillT(skill.id),
                                rank: rankText(skill.rank),
                                level: skill.level,
                            })}
                            {" / "}
                            {t("ui.character.skill.maxRank", {
                                rank: rankText(
                                    Math.max(skill.rank, skill.maxRank)
                                ),
                            })}
                        </Text>
                    );
                })}
        </>
    );
}
