import { PluginConfig } from "../types";
import { RequiredOptions } from "prettier";

export interface PrettierOptions extends Required<PluginConfig>, RequiredOptions {}
