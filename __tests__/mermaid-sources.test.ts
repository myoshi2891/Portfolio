import { expect, it } from 'vitest';
import { extractMermaidSources } from '../lib/mermaid-sources';

it('collects mermaid code nodes the way the CommonMark renderer parses them', () => {
  // Arrange
  const markdown = [
    '~~~mermaid',
    'graph TD; A-->B',
    '~~~',
    '',
    '````mermaid title',
    'graph LR; C-->D',
    '```',
    'still inside',
    '````',
    '',
    '- item',
    '',
    '  ```mermaid',
    '  sequenceDiagram',
    '  ```',
    '',
    '```ts',
    'const mermaid = 1;',
    '```',
  ].join('\r\n');

  // Act
  const sources = extractMermaidSources(markdown);

  // Assert
  expect(sources).toEqual([
    'graph TD; A-->B',
    'graph LR; C-->D\r\n```\r\nstill inside',
    'sequenceDiagram',
  ]);
});

it('ignores mermaid-looking text that is not a fenced code block', () => {
  // Arrange
  const markdown = 'Inline `mermaid` text and an unclosed fence:\n\n    ```mermaid\n    graph TD\n    ```\n';

  // Act
  const sources = extractMermaidSources(markdown);

  // Assert
  expect(sources).toEqual([]);
});
