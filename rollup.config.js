import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import terser from "@rollup/plugin-terser";

const isProduction = process.env.NODE_ENV === "production";

const plugins = [];
if (isProduction) {
  plugins.push(terser());
}

export default {
  input: "src/main.ts",
  output: {
    dir: ".",
    sourcemap: !isProduction,
    format: "cjs",
    exports: "default",
    inlineDynamicImports: true,
  },
  external: ["obsidian", "electron"],
  plugins: [typescript(), nodeResolve({ browser: false, preferBuiltins: true }), commonjs(), json(), ...plugins],
};
