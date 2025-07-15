import { ParserPlugin } from "@babel/parser";
import { Config } from "prettier";

export type ImportOrderParserPlugin = Extract<ParserPlugin, string>;

export interface PluginConfig {}

export type PrettierConfig = PluginConfig & Config;

declare module "prettier" {
  interface Options extends PluginConfig {}
}
