import "i18next";
import { resources } from "../internationalisation";

declare module "i18next" {
    interface CustomTypeOptions {
        resources: {
            translation: (typeof resources)["en"]["translation"];
            class: { [key: string]: string };
            race: { [key: string]: string };
            skill: { [key: string]: string };
        };
    }
}
