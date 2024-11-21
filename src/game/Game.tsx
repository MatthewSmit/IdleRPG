import { createContext } from "react";

export class Game {}

export const GameContext = createContext<Game | null>(null);
