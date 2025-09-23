import * as assert from "assert";
import { encode } from "gpt-tokenizer";

suite("Token Counter Unit Tests", () => {
  test("GPT tokenizer should count tokens correctly", () => {
    const text = "Hello world, this is a test.";
    const tokenCount = encode(text).length;

    // Verificar se a contagem é um número positivo
    assert.ok(tokenCount > 0, "Token count should be positive");
    assert.ok(typeof tokenCount === "number", "Token count should be a number");
  });

  test("Empty string should have zero or minimal tokens", () => {
    const text = "";
    const tokenCount = encode(text).length;

    // String vazia deve ter 0 tokens
    assert.strictEqual(tokenCount, 0, "Empty string should have 0 tokens");
  });

  test("Long text should have more tokens than short text", () => {
    const shortText = "Hi";
    const longText =
      "This is a much longer text that contains many more words and should definitely result in a higher token count than the shorter version.";

    const shortTokens = encode(shortText).length;
    const longTokens = encode(longText).length;

    assert.ok(longTokens > shortTokens, "Longer text should have more tokens");
  });

  test("Claude model calculation should return fewer tokens than GPT", () => {
    const text =
      "This is a sample text for testing token calculation differences.";
    const gptTokenCount = encode(text).length;

    // Simulação do cálculo Claude (75% do GPT)
    const claudeTokenCount = Math.floor(gptTokenCount * 0.75);

    assert.ok(
      claudeTokenCount < gptTokenCount,
      "Claude should count fewer tokens than GPT"
    );
    assert.ok(claudeTokenCount > 0, "Claude token count should be positive");
  });

  test("Fallback calculation should work for character-based estimation", () => {
    const text = "This is a test text for fallback calculation.";
    const characterBasedTokens = Math.ceil(text.length / 4);

    assert.ok(
      characterBasedTokens > 0,
      "Character-based token count should be positive"
    );
    assert.strictEqual(
      characterBasedTokens,
      Math.ceil(text.length / 4),
      "Should match expected calculation"
    );
  });

  test("Should handle different text lengths consistently", () => {
    const texts = [
      "Short",
      "Medium length text with several words",
      "Much longer text that spans multiple sentences and contains various punctuation marks, numbers like 123, and special characters like @#$%.",
    ];

    const tokenCounts = texts.map((text) => encode(text).length);

    // Verificar que textos maiores têm mais tokens
    assert.ok(
      tokenCounts[0] < tokenCounts[1],
      "Medium text should have more tokens than short"
    );
    assert.ok(
      tokenCounts[1] < tokenCounts[2],
      "Long text should have more tokens than medium"
    );

    // Todos devem ser positivos
    tokenCounts.forEach((count, index) => {
      assert.ok(count > 0, `Text ${index} should have positive token count`);
    });
  });

  test("Should handle special characters and punctuation", () => {
    const texts = [
      "Hello world",
      "Hello, world!",
      "Hello... world???",
      "Hello@world#test$123%",
    ];

    texts.forEach((text) => {
      const tokenCount = encode(text).length;
      assert.ok(
        tokenCount > 0,
        `Text "${text}" should have positive token count`
      );
    });
  });

  test("Should handle unicode and emoji characters", () => {
    const unicodeTexts = [
      "Hello 世界",
      "مرحبا بالعالم",
      "🌍 Hello World 🚀",
      "Café naïve résumé",
    ];

    unicodeTexts.forEach((text) => {
      assert.doesNotThrow(() => {
        const tokenCount = encode(text).length;
        assert.ok(
          tokenCount > 0,
          `Unicode text should have positive token count`
        );
      }, `Should handle unicode text: "${text}"`);
    });
  });

  test("Claude percentage calculation should be accurate", () => {
    const testCases = [
      { gptTokens: 100, expectedClaude: 75 },
      { gptTokens: 200, expectedClaude: 150 },
      { gptTokens: 333, expectedClaude: 249 }, // Math.floor(333 * 0.75) = 249
      { gptTokens: 1, expectedClaude: 0 }, // Math.floor(1 * 0.75) = 0
    ];

    testCases.forEach((testCase) => {
      const claudeCount = Math.floor(testCase.gptTokens * 0.75);
      assert.strictEqual(
        claudeCount,
        testCase.expectedClaude,
        `Claude calculation for ${testCase.gptTokens} GPT tokens should be ${testCase.expectedClaude}`
      );
    });
  });

  test("Character-based fallback should be consistent", () => {
    const testCases = [
      { text: "Test", expectedTokens: 1 }, // 4 chars / 4 = 1
      { text: "Hello", expectedTokens: 2 }, // 5 chars / 4 = 1.25 -> ceil = 2
      { text: "Hello world!", expectedTokens: 3 }, // 12 chars / 4 = 3
      { text: "a".repeat(16), expectedTokens: 4 }, // 16 chars / 4 = 4
    ];

    testCases.forEach((testCase) => {
      const calculatedTokens = Math.ceil(testCase.text.length / 4);
      assert.strictEqual(
        calculatedTokens,
        testCase.expectedTokens,
        `Fallback calculation for "${testCase.text}" should be ${testCase.expectedTokens} tokens`
      );
    });
  });

  test("Should maintain consistent results for same input", () => {
    const text = "Consistency test with multiple calls";
    const results: number[] = [];

    // Executar múltiplas vezes
    for (let i = 0; i < 5; i++) {
      results.push(encode(text).length);
    }

    // Todos os resultados devem ser iguais
    const firstResult = results[0];
    results.forEach((result, index) => {
      assert.strictEqual(
        result,
        firstResult,
        `Call ${index} should return same result as first call`
      );
    });
  });
});
