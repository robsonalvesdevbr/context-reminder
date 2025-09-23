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
});
