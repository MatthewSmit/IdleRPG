export type RankDisplayType = "NUMBER" | "LETTER" | "WORD";

export enum EffectModifier {
    AttackBonus = "attack-bonus",
    DamageBonus = "damage-bonus",
    DualWield = "dual-wield",
    SkillBonus = "skill-bonus",
}

export interface Effect {
    modifier: EffectModifier;
    skill?: string;
    value?: string | number;
}

export interface Skill {
    id: string;
    effects: {
        1?: Effect[];
        2?: Effect[];
        3?: Effect[];
        4?: Effect[];
        5?: Effect[];
        6?: Effect[];
        7?: Effect[];
    };
}
