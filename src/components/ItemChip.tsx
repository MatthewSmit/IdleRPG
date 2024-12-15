import { Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

import type { Character } from "../game/Character";
import { type Item, Weapon } from "../game/Item";
import { Equation } from "../scripting/Equation";

interface ItemChipProps {
    item: Item;
    character?: Character;
}

export function ItemChip(props: ItemChipProps) {
    const { item } = props;

    const { t } = useTranslation();
    const { t: itemT } = useTranslation("item");

    if (item instanceof Weapon) {
        const toHit =
            item.data.attackBonus >= 0
                ? `+${item.data.attackBonus}`
                : item.data.attackBonus;
        const hitChance = "TODO%";
        const damage = new Equation(item.data.damage);

        return (
            <>
                <Text>{itemT(item.data.id)}</Text>
                <Text>
                    TO HIT: {toHit}; HIT CHANCE: {hitChance}; DAMAGE:{" "}
                    {damage.toString()}
                </Text>
            </>
        );
    }

    return <Text>{itemT(item.data.id)}</Text>;
}
