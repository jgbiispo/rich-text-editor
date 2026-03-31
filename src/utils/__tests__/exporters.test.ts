import { exportAsHTML, exportAsMarkdown, exportAsText } from "../exporters";

describe("exporters", () => {
  describe("exportAsHTML", () => {
    it("should return content as-is", () => {
      const input = "<p>Hello <strong>world</strong></p>";
      const result = exportAsHTML(input);
      expect(result).toBe(input);
    });

    it("should handle empty content", () => {
      const result = exportAsHTML("");
      expect(result).toBe("");
    });

    it("should handle complex HTML", () => {
      const input = `
        <h1>Title</h1>
        <p>Paragraph with <a href="https://example.com">link</a></p>
        <ul><li>Item 1</li><li>Item 2</li></ul>
      `;
      const result = exportAsHTML(input);
      expect(result).toContain("<h1>");
      expect(result).toContain("<ul>");
    });
  });

  describe("exportAsMarkdown", () => {
    it("should convert headings to markdown", () => {
      const input = "<h1>Title</h1>";
      const result = exportAsMarkdown(input);
      expect(result).toContain("# Title");
    });

    it("should convert paragraphs to markdown", () => {
      const input = "<p>Hello world</p>";
      const result = exportAsMarkdown(input);
      expect(result).toContain("Hello world");
    });

    it("should convert bold text", () => {
      const input = "<strong>bold</strong>";
      const result = exportAsMarkdown(input);
      expect(result).toContain("**bold**");
    });

    it("should convert italic text", () => {
      const input = "<em>italic</em>";
      const result = exportAsMarkdown(input);
      expect(result).toContain("*italic*");
    });

    it("should convert links", () => {
      const input = '<a href="https://example.com">Link</a>';
      const result = exportAsMarkdown(input);
      expect(result).toContain("[Link](https://example.com)");
    });

    it("should convert lists", () => {
      const input = "<ul><li>Item 1</li><li>Item 2</li></ul>";
      const result = exportAsMarkdown(input);
      expect(result).toContain("- Item 1");
      expect(result).toContain("- Item 2");
    });

    it("should handle empty content", () => {
      const result = exportAsMarkdown("");
      expect(result).toBe("");
    });

    it("should handle complex HTML structure", () => {
      const input = `
        <h1>Main Title</h1>
        <p>Introduction paragraph with <strong>bold</strong> text.</p>
        <ul>
          <li>First item</li>
          <li>Second item</li>
        </ul>
      `;
      const result = exportAsMarkdown(input);
      expect(result).toContain("# Main Title");
      expect(result).toContain("Introduction paragraph");
      expect(result).toContain("**bold**");
    });
  });

  describe("exportAsText", () => {
    it("should extract plain text from HTML", () => {
      const input = "<p>Hello <strong>world</strong></p>";
      const result = exportAsText(input);
      expect(result).toBe("Hello world");
    });

    it("should handle multiple paragraphs", () => {
      const input = "<p>First paragraph</p><p>Second paragraph</p>";
      const result = exportAsText(input);
      expect(result).toContain("First paragraph");
      expect(result).toContain("Second paragraph");
    });

    it("should handle links", () => {
      const input = '<a href="https://example.com">Link text</a>';
      const result = exportAsText(input);
      expect(result).toBe("Link text");
    });

    it("should handle lists", () => {
      const input = "<ul><li>Item 1</li><li>Item 2</li></ul>";
      const result = exportAsText(input);
      expect(result).toContain("Item 1");
      expect(result).toContain("Item 2");
    });

    it("should handle headings", () => {
      const input = "<h1>Title</h1><h2>Subtitle</h2>";
      const result = exportAsText(input);
      expect(result).toContain("Title");
      expect(result).toContain("Subtitle");
    });

    it("should return empty string for empty input", () => {
      const result = exportAsText("");
      expect(result).toBe("");
    });

    it("should handle nested elements", () => {
      const input = "<div><p>Nested <strong>content</strong> here</p></div>";
      const result = exportAsText(input);
      expect(result).toContain("Nested content here");
    });

    it("should handle br tags", () => {
      const input = "Line 1<br />Line 2";
      const result = exportAsText(input);
      expect(result).toContain("Line 1");
      expect(result).toContain("Line 2");
    });
  });
});
