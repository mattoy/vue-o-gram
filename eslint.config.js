import tseslint from "typescript-eslint"
import fp from "eslint-plugin-fp;"
import esvue from "eslint-plugin-vue"

export default [
    {
        plugins: {
            fp: fp,
            tslint: tseslint,
            esvue: esvue
        },
        rules: {
            "jsdoc/require-description": "error",
            "jsdoc/check-values": "error"
        },
        env: {
            browser: true,
            es: 2021
        },
        overrides: [
            {
                files: ["src/**/*"],
                rulse: {
                    "no-mixed-spaces-and-tabs": "off",
                    "fp/no-class": "off"
                }
            }
        ],
        languageOptions: {
            ecmaVersion: 2021
        }
    }
];