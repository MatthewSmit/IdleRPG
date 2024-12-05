import { Class } from "./Class";
import { Item } from "./Item";
import { Monster } from "./Monster";
import { Race } from "./Race";
import { Skill } from "./Skill";
import { StartConditions } from "./StartConditions";

export type Data = {
    ["class"]: { [key: string]: Class };
    item: { [key: string]: Item };
    monster: { [key: string]: Monster };
    race: { [key: string]: Race };
    skill: { [key: string]: Skill };
    start: StartConditions[];
};
