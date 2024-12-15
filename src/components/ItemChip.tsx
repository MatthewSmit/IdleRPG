import { Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

import type { Character } from "../game/Character";
import { type Item, Weapon } from "../game/Item";

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

        return (
            <>
                <Text>{itemT(item.data.id)}</Text>
                <Text>
                    {t("ui.item.chip", {
                        toHit,
                        hitChance,
                        damage: item.damage,
                    })}
                </Text>
            </>
        );
    }

    return <Text>{itemT(item.data.id)}</Text>;
}
