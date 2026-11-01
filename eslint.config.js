module.exports = (async function config() {
    const { default: love } = await import('eslint-config-love');

    return [
        {
            ignores: [
                '**/*.d.ts',
                'build/',
                'coverage/',
                'dist/',
                'eslint.config.js',
                'examples/',
                'jest.config.js',
                'node_modules/',
            ],
        },
        {
            ...love,
        },
        {
            files: ['src/**/*.{js,ts}', 'test/**/*.{js,ts}'],
            languageOptions: {
                ecmaVersion: 'latest',
                parserOptions: {
                    // Switch from traditional project arrays to the fast project service
                    projectService: {
                        allowDefaultProject: ['test/utils/data/test.js']
                    },
                    tsconfigRootDir: __dirname,
                },
                sourceType: 'module',
            },
            rules: {
                '@typescript-eslint/class-methods-use-this': 'off',
                '@typescript-eslint/init-declarations': 'off',
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-extraneous-class': 'off',
                '@typescript-eslint/no-magic-numbers': 'off',
                '@typescript-eslint/no-non-null-assertion': 'off',
                '@typescript-eslint/no-unsafe-argument': 'off',
                '@typescript-eslint/no-unsafe-assignment': 'off',
                '@typescript-eslint/no-unsafe-call': 'off',
                '@typescript-eslint/no-unnecessary-condition': 'off',
                '@typescript-eslint/no-unsafe-member-access': 'off',
                '@typescript-eslint/no-unsafe-return': 'off',
                '@typescript-eslint/prefer-nullish-coalescing': 'off',
                //'@typescript-eslint/semi': ['error', 'always'],
                complexity: ['error', 10],
                'max-lines-per-function': ['error', 50],
                'no-extraneous-class': 'off',
                'semi': [2, 'always'],
                // Rules introduced between eslint-config-love 83 and 158 which are not yet adopted
                '@typescript-eslint/no-unsafe-type-assertion': 'off',
                '@typescript-eslint/prefer-destructuring': 'off',
                'guard-for-in': 'off',
                'no-multi-assign': 'off',
                'no-param-reassign': 'off',
                radix: 'off',
                'require-unicode-regexp': 'off',
            },
        },
        {
            files: ['test/**/*.{js,ts}', 'test/**/*.spec.ts', 'test/**/*Spec.ts'],
            rules: {
                '@typescript-eslint/class-methods-use-this': 'off',
                '@typescript-eslint/explicit-function-return-type': 'off',
                '@typescript-eslint/no-empty-function': 'off',
                '@typescript-eslint/no-explicit-any': 'off',
                '@typescript-eslint/no-unnecessary-template-expression': 'off',
                '@typescript-eslint/no-unnecessary-type-assertion': 'off',
                '@typescript-eslint/no-unsafe-argument': 'off',
                '@typescript-eslint/no-unsafe-call': 'off',
                complexity: 'off',
                'max-lines-per-function': 'off',
                'no-new': 'off',
                // Rules introduced between eslint-config-love 83 and 158 which are not yet adopted
                '@typescript-eslint/require-await': 'off',
                '@typescript-eslint/strict-void-return': 'off',
                'arrow-body-style': 'off',
                'max-lines': 'off',
                'max-nested-callbacks': 'off',
                'no-await-in-loop': 'off',
                'no-console': 'off',
                'no-promise-executor-return': 'off',
                'promise/avoid-new': 'off',
            }
        },
    ];
})();
