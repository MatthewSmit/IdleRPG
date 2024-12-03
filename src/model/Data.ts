import { Class } from "./Class.ts";
import { Race } from "./Race.ts";
import { Skill } from "./Skill.ts";

export interface StartConditions {
    race: string;
    class: string;
    skills: string[];
}

export type Data = {
    ["class"]: { [key: string]: Class };
    race: { [key: string]: Race };
    skill: { [key: string]: Skill };
    start: StartConditions[];
};
