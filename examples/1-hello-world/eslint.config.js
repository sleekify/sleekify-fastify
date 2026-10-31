module.exports = (async function config() {
    const { default: love } = await import('eslint-config-love');

    return [
        {
            ignores: [
                '**/*.d.ts',
                '**/*.js',
                'dist/',
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
                '@typescript-eslint/explicit-function-return-type': 'off',
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
                '@typescript-eslint/no-unsafe-member-access': 'off',
                '@typescript-eslint/no-unsafe-return': 'off',
                '@typescript-eslint/require-await': 'off',
                'arrow-body-style': 'off',
                eqeqeq: 'off',
                'prefer-arrow-callback': 'off',
            },
        },
    ];
})();
