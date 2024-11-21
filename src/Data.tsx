import { createContext } from "react";
import { Data } from "./model/Data.ts";

import type { Class } from "./model/Class.ts";

export const DataContext = createContext<Data>(undefined as unknown as Data);

export const data: Data = {
    class: {},
};

interface IUnknownData {
    id: string;
    category: "class";
}

function parseData(allData: IUnknownData[]) {
    for (const datum of allData) {
        if (datum.category === "class") {
            data.class[datum.id] = datum as Class;
        } else {
            throw new Error(`Unknown data for ${datum.id}`);
        }
    }
}

import classData from "./assets/classes.json5";

parseData(classData);

console.log(data);
