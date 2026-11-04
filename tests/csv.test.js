import {
  parseExpensesCsv,
  serializeExpensesToCsv,
} from '../modules/csv.js';

const expense = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  name: 'Lunch, with friends',
  category: 'Outside Food',
  date: '2026-11-04',
  amount: 125.75,
  createdAt: '2026-11-04T10:00:00.000Z',
};

describe('expense CSV serialization', () => {
  test('writes the canonical header and escapes commas, quotes, and line breaks', () => {
    const expenses = [
      expense,
      {
        ...expense,
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'A "quoted"\nexpense',
        amount: 0.015,
      },
    ];

    expect(serializeExpensesToCsv(expenses)).toBe(
      [
        'id,name,category,date,amount,createdAt',
        '550e8400-e29b-41d4-a716-446655440000,"Lunch, with friends",Outside Food,2026-11-04,125.75,2026-11-04T10:00:00.000Z',
        '550e8400-e29b-41d4-a716-446655440001,"A ""quoted""\nexpense",Outside Food,2026-11-04,0.015,2026-11-04T10:00:00.000Z',
      ].join('\r\n'),
    );
  });

  test('serializes an empty collection as a header-only CSV', () => {
    expect(serializeExpensesToCsv([])).toBe(
      'id,name,category,date,amount,createdAt',
    );
  });

  test('rejects a non-array input', () => {
    expect(() => serializeExpensesToCsv(null)).toThrow(
      'Expenses must be provided as an array.',
    );
  });
});

describe('expense CSV parsing', () => {
  test('parses a serialized expense preserving values and numeric precision', () => {
    const csv = serializeExpensesToCsv([{ ...expense, amount: 1.239 }]);

    expect(parseExpensesCsv(csv)).toEqual([{ ...expense, amount: 1.239 }]);
  });

  test('accepts BOM, CRLF, quoted commas, escaped quotes, multiline values, and blank lines', () => {
    const csv = [
      '\uFEFFid,name,category,date,amount,createdAt',
      '550e8400-e29b-41d4-a716-446655440000,"Lunch, ""special""\r\nmeal",Outside Food,2026-11-04,10.5,2026-11-04T10:00:00.000Z',
      '',
    ].join('\r\n');

    expect(parseExpensesCsv(csv)).toEqual([
      {
        ...expense,
        name: 'Lunch, "special"\r\nmeal',
        amount: 10.5,
      },
    ]);
  });

  test('returns an empty collection for empty or header-only content', () => {
    expect(parseExpensesCsv('')).toEqual([]);
    expect(parseExpensesCsv('id,name,category,date,amount,createdAt')).toEqual(
      [],
    );
  });

  test.each([
    ['name,id,category,date,amount,createdAt', /header/],
    [
      'id,name,category,date,amount,createdAt\n550e8400-e29b-41d4-a716-446655440000,Name',
      /row 2.*6 fields/,
    ],
    [
      'id,name,category,date,amount,createdAt\n550e8400-e29b-41d4-a716-446655440000,"unfinished,Outside Food,2026-11-04,1,2026-11-04T10:00:00.000Z',
      /unterminated quoted field/,
    ],
    [
      'id,name,category,date,amount,createdAt\n550e8400-e29b-41d4-a716-446655440000,"Name"x,Outside Food,2026-11-04,1,2026-11-04T10:00:00.000Z',
      /unexpected character after a quoted field/,
    ],
    [
      'id,name,category,date,amount,createdAt\nnot-a-uuid,Name,Outside Food,2026-11-04,1,2026-11-04T10:00:00.000Z',
      /row 2.*valid UUID/,
    ],
    [
      'id,name,category,date,amount,createdAt\n550e8400-e29b-41d4-a716-446655440000,Name,Unknown,2026-11-04,1,2026-11-04T10:00:00.000Z',
      /row 2.*category/,
    ],
    [
      'id,name,category,date,amount,createdAt\n550e8400-e29b-41d4-a716-446655440000,Name,Outside Food,2026-02-30,1,2026-11-04T10:00:00.000Z',
      /row 2.*date must be a valid YYYY-MM-DD date/,
    ],
    [
      'id,name,category,date,amount,createdAt\n550e8400-e29b-41d4-a716-446655440000,Name,Outside Food,2026-11-04,0,2026-11-04T10:00:00.000Z',
      /row 2.*at least 0.01/,
    ],
    [
      'id,name,category,date,amount,createdAt\n550e8400-e29b-41d4-a716-446655440000,Name,Outside Food,2026-11-04,1,not-a-timestamp',
      /row 2.*ISO 8601/,
    ],
  ])('rejects malformed or invalid CSV (%s)', (csv, expectedError) => {
    expect(() => parseExpensesCsv(csv)).toThrow(expectedError);
  });

  test('rejects non-string input', () => {
    expect(() => parseExpensesCsv(null)).toThrow(
      'CSV content must be provided as a string.',
    );
  });
});
