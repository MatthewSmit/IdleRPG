import { Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

import { type Item, Weapon } from "../game/Item";

interface ItemChipProps {
    item: Item;
}

export function ItemChip(props: ItemChipProps) {
    const { item } = props;

    const { t } = useTranslation();
    const { t: itemT } = useTranslation("item");

    if (item instanceof Weapon) {
        const attackModifier = item.data.attackBonus;

        return (
            <>
                <Text>{itemT(item.data.id)}</Text>
                <Text>
                    {t("ui.item.chip", {
                        attackModifier:
                            attackModifier >= 0
                                ? `+${attackModifier}`
                                : attackModifier,
                        damage: item.damage,
                    })}
                </Text>
            </>
        );
    }

    return <Text>{itemT(item.data.id)}</Text>;
}
