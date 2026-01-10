'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import html from 'remark-html';
import { IconDownload, IconColumns, IconColumns1 } from '@tabler/icons-react';
import VerticalSidebar from '../../ui/VerticalSidebar';
import styles from '../../styles/Markdown.module.css';

const STORAGE_KEY = 'markdown-writer-content';
const SAVE_DELAY = 500;

const DEFAULT_CONTENT = `Think of this like a typewriter. The current line stays centered as you write.

I made this for me but you are welcome to use this too. Nothing stored on server, just localstorage. Minimal web based markdown editor.

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
|:---------|:--------:|---------:|
| Left     | Center   | Right    |
| Aligned  | Aligned  | Aligned  |

\`\`\`
// Code block
const greeting = "Hello, world!";
console.log(greeting);
\`\`\`

Footnote reference[^1].

[^1]: This is the footnote.
`;

export default function MarkdownPage() {
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(false);
  const [sideBySide, setSideBySide] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [paddingTop, setPaddingTop] = useState(0);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate padding based on visible viewport height
  useEffect(() => {
    const updatePadding = () => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Use visualViewport height when available (accounts for keyboard)
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const fullHeight = window.innerHeight;
      const headerHeight = 80;
      const visibleEditorHeight = Math.max(200, viewportHeight - headerHeight);
      const fullEditorHeight = Math.max(200, fullHeight - headerHeight);

      // Top padding: centers first line in visible area
      setPaddingTop(visibleEditorHeight / 2);
      // Bottom padding: must allow scrolling to center last line in visible area
      // When keyboard is open, need extra padding to scroll content higher
      const keyboardHeight = fullHeight - viewportHeight;
      setPaddingBottom((fullEditorHeight / 2) + keyboardHeight);

      // Adjust fade height based on visible area
      const fadePercent = Math.min(40, (visibleEditorHeight / window.innerHeight) * 40);
      document.documentElement.style.setProperty('--fade-height', `${fadePercent}%`);
    };

    updatePadding();
    window.addEventListener('resize', updatePadding);

    // Handle iOS virtual keyboard - reset page scroll when viewport changes
    const resetPageScroll = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (window.visualViewport) {
        window.scrollTo(0, window.visualViewport.offsetTop * -1);
      }
    };

    let scrollResetInterval: NodeJS.Timeout | null = null;

    const handleViewportChange = () => {
      updatePadding();
      resetPageScroll();

      // Keep resetting for 500ms to fight browser behavior
      if (scrollResetInterval) clearInterval(scrollResetInterval);
      scrollResetInterval = setInterval(resetPageScroll, 16);
      setTimeout(() => {
        if (scrollResetInterval) clearInterval(scrollResetInterval);
      }, 500);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    }

    return () => {
      window.removeEventListener('resize', updatePadding);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
    };
  }, [preview, sideBySide]);

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
    if (preview || sideBySide) {
      remark()
        .use(remarkGfm)
        .use(html)
        .process(content)
        .then((result) => {
          setHtmlContent(result.toString());
        });
    }
  }, [content, preview, sideBySide]);

  // Center cursor line in viewport
  const centerCursor = useCallback((smooth = true) => {
    const textarea = textareaRef.current;
    if (!textarea || paddingTop === 0) return;

    const cursorPos = textarea.selectionStart;
    // Read directly from textarea to get current value (not stale state)
    const textBeforeCursor = textarea.value.substring(0, cursorPos);
    const lineNumber = textBeforeCursor.split('\n').length - 1;

    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight);

    // Calculate scroll position: line position + padding offset
    const cursorY = lineNumber * lineHeight + paddingTop;
    const targetScroll = cursorY - paddingTop + (lineHeight / 2);

    textarea.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: smooth ? 'smooth' : 'instant'
    });
  }, [paddingTop]);

  // Center cursor when padding changes (initial load, keyboard show/hide, resize)
  useEffect(() => {
    if (isLoaded && paddingTop > 0) {
      // Small delay to ensure textarea is fully rendered
      requestAnimationFrame(() => centerCursor(false));
    }
  }, [isLoaded, paddingTop, centerCursor]);

  // Handle text changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Use instant scroll for typing to avoid cursor/content mismatch
    // Multiple calls to ensure we catch the final cursor position
    requestAnimationFrame(() => centerCursor(false));
    setTimeout(() => centerCursor(false), 0);
    setTimeout(() => centerCursor(false), 16);
  };

  // Handle cursor movement
  const handleSelect = () => {
    centerCursor(true);
  };

  // Handle keyboard navigation (not content changes - those use onChange)
  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) {
      centerCursor(false);
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

  // Toggle side-by-side mode
  const toggleSideBySide = () => {
    setSideBySide(!sideBySide);
    if (!sideBySide) {
      setPreview(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.sidebar}>
        <VerticalSidebar />
      </div>
      <div className={styles.container}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <div>
              <h1 className={styles.title}>Markdown</h1>
              <p className={styles.subtitle}>Local Editor</p>
            </div>
            <div className={styles.controls}>
              <button
                className={styles.controlButton}
                onClick={handleDownload}
                title="Download"
              >
                <IconDownload size={14} stroke={1.5} />
              </button>
              <button
                className={`${styles.controlButton} ${styles.sideBySideButton} ${sideBySide ? styles.active : ''}`}
                onClick={toggleSideBySide}
                title={sideBySide ? 'Single Pane' : 'Side by Side'}
              >
                {sideBySide ? <IconColumns1 size={14} stroke={1.5} /> : <IconColumns size={14} stroke={1.5} />}
              </button>
              {!sideBySide && (
                <button
                  className={`${styles.controlButton} ${preview ? styles.active : ''}`}
                  onClick={togglePreview}
                >
                  {preview ? 'Edit' : 'Preview'}
                </button>
              )}
            </div>
          </header>
          <div className={`${styles.editorContainer} ${sideBySide ? styles.splitContainer : ''}`}>
            {sideBySide ? (
              <>
                <div className={styles.editorPane}>
                  <div className={styles.editorWrapper}>
                    <textarea
                      ref={textareaRef}
                      className={styles.textarea}
                      style={{ paddingTop, paddingBottom }}
                      value={content}
                      onChange={handleChange}
                      onSelect={handleSelect}
                      onKeyUp={handleKeyUp}
                      onClick={handleSelect}
                      placeholder="Start writing..."
                      spellCheck={false}
                    />
                  </div>
                </div>
                <div className={styles.previewPane}>
                  <div className={styles.preview}>
                    <div
                      className={styles.markdown}
                      dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                  </div>
                </div>
              </>
            ) : preview ? (
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
                  style={{ paddingTop, paddingBottom }}
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
    </div>
  );
}
