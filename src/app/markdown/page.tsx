'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import html from 'remark-html';
import { IconDownload } from '@tabler/icons-react';
import VerticalSidebar from '../../ui/VerticalSidebar';
import styles from '../../styles/Markdown.module.css';

const STORAGE_KEY = 'markdown-writer-content';
const SAVE_DELAY = 500;

const DEFAULT_CONTENT = `I made this for me but you are welcome to use this too. Nothing stored on server, just localstorage. Minimal web based markdown editor.

# Header 1
## Header 2
### Header 3
#### Header 4
##### Header 5
###### Header 6

---

This is inline \`code\`, **bold**, *italics*, and ~~strikethrough~~.

This is a [link to my homepage](https://defnf.com).

> This is a block quote

- Unordered
- List
  - Nested item

1. Ordered
2. List

- [ ] Task list
- [x] Completed task

| Column 1 | Column 2 | Column 3 |
|----------|:--------:|---------:|
| Left     | Center   | Right    |
| Aligned  | Aligned  | Aligned  |

\`\`\`javascript
// Code block with syntax
const greeting = "Hello, world!";
console.log(greeting);
\`\`\`

Footnote reference[^1].

[^1]: This is the footnote.
`;

export default function MarkdownPage() {
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [paddingSize, setPaddingSize] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate padding based on container height
  useEffect(() => {
    const updatePadding = () => {
      const textarea = textareaRef.current;
      if (textarea) {
        const height = textarea.clientHeight;
        setPaddingSize(height / 2);
      }
    };

    updatePadding();
    window.addEventListener('resize', updatePadding);
    return () => window.removeEventListener('resize', updatePadding);
  }, [preview]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    setContent(saved ?? DEFAULT_CONTENT);
    setIsLoaded(true);
  }, []);

  // Debounced save to localStorage
  useEffect(() => {
    if (!isLoaded) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, content);
    }, SAVE_DELAY);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, isLoaded]);

  // Parse markdown for preview
  useEffect(() => {
    if (preview) {
      remark()
        .use(remarkGfm)
        .use(html)
        .process(content)
        .then((result) => {
          setHtmlContent(result.toString());
        });
    }
  }, [content, preview]);

  // Center cursor line in viewport
  const centerCursor = useCallback((smooth = true) => {
    const textarea = textareaRef.current;
    if (!textarea || paddingSize === 0) return;

    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = content.substring(0, cursorPos);
    const lineNumber = textBeforeCursor.split('\n').length - 1;

    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);

    // Calculate scroll position: line position + padding offset
    const cursorY = lineNumber * lineHeight + paddingSize;
    const targetScroll = cursorY - paddingSize + (lineHeight / 2);

    textarea.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: smooth ? 'smooth' : 'instant'
    });
  }, [content, paddingSize]);

  // Center on initial load
  useEffect(() => {
    if (isLoaded && paddingSize > 0) {
      // Small delay to ensure textarea is fully rendered
      requestAnimationFrame(() => centerCursor(false));
    }
  }, [isLoaded, paddingSize, centerCursor]);

  // Handle text changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Defer centering to next frame to get updated cursor position
    requestAnimationFrame(() => centerCursor(true));
  };

  // Handle cursor movement
  const handleSelect = () => {
    centerCursor(true);
  };

  // Handle keyboard navigation
  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) {
      centerCursor(true);
    }
  };

  // Download as markdown file
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Toggle preview mode
  const togglePreview = () => {
    setPreview(!preview);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <VerticalSidebar />
      </div>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Markdown</h1>
          <div className={styles.controls}>
            <button
              className={styles.controlButton}
              onClick={handleDownload}
              title="Download"
            >
              <IconDownload size={14} stroke={1.5} />
            </button>
            <button
              className={`${styles.controlButton} ${preview ? styles.active : ''}`}
              onClick={togglePreview}
            >
              {preview ? 'Edit' : 'Preview'}
            </button>
          </div>
        </header>
        <div className={styles.editorContainer}>
          {preview ? (
            <div className={styles.preview}>
              <div
                className={styles.markdown}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
          ) : (
            <div className={styles.editorWrapper}>
              <textarea
                ref={textareaRef}
                className={styles.textarea}
                style={{ paddingTop: paddingSize, paddingBottom: paddingSize }}
                value={content}
                onChange={handleChange}
                onSelect={handleSelect}
                onKeyUp={handleKeyUp}
                onClick={handleSelect}
                placeholder="Start writing..."
                spellCheck={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
