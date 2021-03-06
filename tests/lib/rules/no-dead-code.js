/**
 * @fileoverview Disallow code past its marked @removeby.
 * @author
 * See LICENSE file in root directory for full license.
 */
'use strict';

//------------------------------------------------------------------------------
// Requires
//------------------------------------------------------------------------------
const rule = require('../../../lib').rules['no-dead-code'];
const RuleTester = require('eslint').RuleTester;

const parserOptions = {
    ecmaVersion: 6
};

//------------------------------------------------------------------------------
// Tests
// Big old note: RuleTester doesn't expose any before/after/etc. so mocking out
// date wasn't possible. As a result, we have to go with extreme test cases and
// hope that no testing system has its clock in a bad state :(
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions });

const lineComment = `// @removeby 1/1/2018 developer@example.com This should die soon.
console.log('something');`;

const blockComment = `/*
 *  @removeby 1/1/2018 developer@example.com This should die soon.
 */
console.log('something else');`;

const malformed = [
    '// @removeby not-a-date developer@example.com',
    '// @removeby 1/2/3018 @twitter'
];

const alternateAnnotation = `// @somethingElse 1/1/2018 dev@example.com
console.log('something');`;

// A Default set of options so we're not relying on Date.now in tests.
const successOptions = [
    {
        currentEpochTimeMS: new Date('12/31/2017').getTime()
    }
];
const failureOptions = [
    {
        currentEpochTimeMS: new Date('1/2/2018').getTime()
    }
];

ruleTester.run('no-dead-code', rule, {
    valid: [
        {
            code: lineComment,
            options: successOptions
        },
        {
            code: blockComment,
            options: successOptions
        },
        {
            // Test if alternative annotations work.
            code: alternateAnnotation,
            options: [Object.assign({}, successOptions[0], { annotation: '@somethingElse' })]
        }
    ],

    invalid: [
        {
            code: malformed[0],
            options: failureOptions,
            errors: [{ messageId: 'malformedAnnotation' }]
        },
        {
            code: malformed[1],
            options: failureOptions,
            errors: [{ messageId: 'malformedAnnotation' }]
        },
        {
            code: lineComment,
            options: failureOptions,
            errors: [{ messageId: 'deadCode' }]
        },
        {
            code: blockComment,
            options: failureOptions,
            errors: [{ messageId: 'deadCode' }]
        },
        {
            // Failure case for moving current epoch time and daysBeforeDeath around.
            code: lineComment,
            options: [
                {
                    currentEpochTimeMS: new Date('12/20/2017').getTime(),
                    daysBeforeToReport: 13
                }
            ],
            errors: [{ messageId: 'deadCode' }]
        },
        {
            // Check failure case on alt annotations.
            code: alternateAnnotation,
            options: [Object.assign({}, failureOptions[0], { annotation: '@somethingElse' })],
            errors: [{ messageId: 'deadCode' }]
        }
    ]
});
