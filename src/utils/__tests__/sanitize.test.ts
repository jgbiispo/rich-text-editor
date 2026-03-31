import { sanitizeHTML } from "../sanitize";

describe("sanitizeHTML", () => {
  it("should allow safe HTML tags", () => {
    const input = "<p>Hello <strong>world</strong></p>";
    const result = sanitizeHTML(input);
    expect(result).toContain("<p>");
    expect(result).toContain("<strong>world</strong>");
  });

  it("should remove script tags", () => {
    const input = '<p>Safe</p><script>alert("XSS")</script>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain("<script>");
    expect(result).toContain("Safe");
  });

  it("should remove event handlers", () => {
    const input = '<img src="test.jpg" onerror="alert(1)" />';
    const result = sanitizeHTML(input);
    expect(result).not.toContain("onerror");
    expect(result).toContain("src=");
  });

  it("should remove javascript: URLs", () => {
    const input = '<a href="javascript:alert(1)">Click</a>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain("javascript:");
  });

  it("should allow allowed attributes", () => {
    const input = '<a href="https://example.com" alt="test">Link</a>';
    const result = sanitizeHTML(input);
    expect(result).toContain('href="https://example.com"');
  });

  it("should remove disallowed attributes", () => {
    const input = '<div data-custom="value">Content</div>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain("data-custom");
  });

  it("should handle table elements", () => {
    const input = `
      <table>
        <thead><tr><th>Header</th></tr></thead>
        <tbody><tr><td>Cell</td></tr></tbody>
      </table>
    `;
    const result = sanitizeHTML(input);
    expect(result).toContain("<table>");
    expect(result).toContain("<thead>");
    expect(result).toContain("<tbody>");
    expect(result).toContain("<th>");
    expect(result).toContain("<td>");
  });

  it("should handle headings", () => {
    const input = "<h1>Title</h1><h2>Subtitle</h2><h3>Section</h3>";
    const result = sanitizeHTML(input);
    expect(result).toContain("<h1>");
    expect(result).toContain("<h2>");
    expect(result).toContain("<h3>");
  });

  it("should handle lists", () => {
    const input = "<ul><li>Item 1</li><li>Item 2</li></ul><ol><li>Ordered</li></ol>";
    const result = sanitizeHTML(input);
    expect(result).toContain("<ul>");
    expect(result).toContain("<ol>");
    expect(result).toContain("<li>");
  });

  it("should handle inline formatting", () => {
    const input = "<p><em>italic</em> <u>underline</u> <br /></p>";
    const result = sanitizeHTML(input);
    expect(result).toContain("<em>");
    expect(result).toContain("<u>");
    expect(result).toContain("<br>");
  });

  it("should handle images with allowed attributes", () => {
    const input = '<img src="test.jpg" alt="Test image" width="100" height="100" />';
    const result = sanitizeHTML(input);
    expect(result).toContain('src="test.jpg"');
    expect(result).toContain('alt="Test image"');
  });

  it("should handle empty input", () => {
    const result = sanitizeHTML("");
    expect(result).toBe("");
  });

  it("should handle plain text without tags", () => {
    const input = "Just plain text";
    const result = sanitizeHTML(input);
    expect(result).toBe("Just plain text");
  });

  it("should handle nested dangerous content", () => {
    const input = '<div><p>Safe</p><script>alert("XSS")</script><p>Also safe</p></div>';
    const result = sanitizeHTML(input);
    expect(result).not.toContain("<script>");
    expect(result).toContain("Safe");
    expect(result).toContain("Also safe");
  });

  it("should handle data attributes in allowed elements", () => {
    const input = '<td data-cell="A1">Content</td>';
    const result = sanitizeHTML(input);
    // data-cell should be allowed on td elements
    expect(result).toContain("data-cell");
  });
});
