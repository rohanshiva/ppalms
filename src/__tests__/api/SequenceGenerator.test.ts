import {
  SequenceGenerator,
  PermutationSequencePolicy,
  CombinationSequencePolicy,
} from 'api/SequenceGenerator';

describe('SequenceGenerator', () => {
  test("negative 'itemCount' input to SequenceGenerator", () => {
    expect(() => {
      const generator = new SequenceGenerator(
        -1,
        -1,
        PermutationSequencePolicy
      );
    }).toThrow("'itemCount' cannot be negative");
  });

  test("'size' > 'itemCount'", () => {
    expect(() => {
      const generator = new SequenceGenerator(5, 11, PermutationSequencePolicy);
    }).toThrow("'size' cannot be larger than 'itemCount'");
  });
  test('generate all unique permutations', () => {
    const generator = new SequenceGenerator(3, 3, PermutationSequencePolicy);
    expect(generator.canGenerate()).toBe(true);

    const permutations = new Set<string>();
    while (generator.canGenerate()) {
      permutations.add(generator.getRandomSequence().join(','));
    }

    expect(permutations.size).toBe(6);
    expect(generator.canGenerate()).toBe(false);
  });

  test('generate all unique combinations', () => {
    const generator = new SequenceGenerator(3, 2, CombinationSequencePolicy);
    expect(generator.canGenerate()).toBe(true);

    const combinations = new Set<string>();
    while (generator.canGenerate()) {
      combinations.add(generator.getRandomSequence().join(','));
    }

    expect(combinations.size).toBe(3);
    expect(generator.canGenerate()).toBe(false);
  });
});
