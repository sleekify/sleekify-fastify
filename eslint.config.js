module.exports = (async function config() {
    const { default: love } = await import('eslint-config-love');

    return [
        {
            ignores: [
                '**/*.d.ts',
                '**/*.js',
                'coverage/',
                'dist/',
                'examples/',
                'node_modules/',
            ],
        },
        {
            ...love,
            files: ['**/*.ts'],
        },
        {
            files: ['**/*.ts'],
            languageOptions: {
                ecmaVersion: 'latest',
                parserOptions: {
                    tsconfigRootDir: __dirname,
                },
                sourceType: 'module',
            },
            rules: {
                '@typescript-eslint/no-extraneous-class': 'off',
                '@typescript-eslint/no-non-null-assertion': 'off',
                complexity: ['error', 10],
                'max-lines-per-function': ['error', 50],
                'no-extraneous-class': 'off',
                semi: [2, 'always'],
                // Rules introduced by eslint-config-love which are not yet adopted
                '@typescript-eslint/class-methods-use-this': 'off',
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-import-type-side-effects': 'off',
                '@typescript-eslint/no-magic-numbers': 'off',
                '@typescript-eslint/no-unnecessary-condition': 'off',
                '@typescript-eslint/no-unsafe-argument': 'off',
                '@typescript-eslint/no-unsafe-assignment': 'off',
                '@typescript-eslint/no-unsafe-call': 'off',
                '@typescript-eslint/no-unsafe-member-access': 'off',
                '@typescript-eslint/no-unsafe-return': 'off',
                '@typescript-eslint/no-unsafe-type-assertion': 'off',
                '@typescript-eslint/prefer-destructuring': 'off',
                '@typescript-eslint/prefer-nullish-coalescing': 'off',
                'guard-for-in': 'off',
                'no-multi-assign': 'off',
                'no-param-reassign': 'off',
                radix: 'off',
                'require-unicode-regexp': 'off',
            },
        },
        {
            files: ['**/*.spec.ts', '**/*Spec.ts', 'test/**/*.ts'],
            rules: {
                '@typescript-eslint/explicit-function-return-type': 'off',
                complexity: 'off',
                'max-lines-per-function': 'off',
                'no-new': 'off',
                // Rules introduced by eslint-config-love which are not yet adopted
                '@typescript-eslint/init-declarations': 'off',
                '@typescript-eslint/no-empty-function': 'off',
                '@typescript-eslint/no-unnecessary-type-assertion': 'off',
                '@typescript-eslint/require-await': 'off',
                '@typescript-eslint/strict-void-return': 'off',
                'arrow-body-style': 'off',
                'max-lines': 'off',
                'max-nested-callbacks': 'off',
                'no-await-in-loop': 'off',
                'no-console': 'off',
                'no-promise-executor-return': 'off',
                'promise/avoid-new': 'off',
            },
        },
    ];
})();
