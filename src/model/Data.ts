import { ClassData } from "./ClassData";
import type { DungeonData } from "./DungeonData";
import { ItemData } from "./ItemData";
import { MonsterData } from "./MonsterData";
import { RaceData } from "./RaceData";
import { SkillData } from "./SkillData";
import { StartConditions } from "./StartConditions";

export type Data = {
    ["class"]: { [key: string]: ClassData };
    dungeons: { [key: string]: DungeonData };
    item: { [key: string]: ItemData };
    monster: { [key: string]: MonsterData };
    race: { [key: string]: RaceData };
    skill: { [key: string]: SkillData };
    start: StartConditions[];
};
