'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, placeholder } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
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

// Dark minimal theme for CodeMirror
const darkMinimalTheme = EditorView.theme({
  '&': {
    backgroundColor: 'transparent',
    color: '#737373',
    height: '100%',
  },
  '.cm-content': {
    fontFamily: 'var(--font-mono), "Courier New", monospace',
    fontSize: '0.9rem',
    lineHeight: '1.8',
    caretColor: '#737373',
  },
  '.cm-line': {
    padding: '0',
  },
  '.cm-cursor': {
    borderLeftColor: '#737373',
    borderLeftWidth: '1px',
  },
  '.cm-selectionBackground': {
    backgroundColor: '#333 !important',
  },
  '&.cm-focused .cm-selectionBackground': {
    backgroundColor: '#333 !important',
  },
  '.cm-activeLine': {
    backgroundColor: 'transparent',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'transparent',
  },
  '.cm-gutters': {
    display: 'none',
  },
  '.cm-scroller': {
    overflow: 'auto',
    scrollbarWidth: 'none',
  },
  '.cm-scroller::-webkit-scrollbar': {
    display: 'none',
  },
  '.cm-placeholder': {
    color: '#404040',
  },
}, { dark: true });

export default function MarkdownPage() {
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState(false);
  const [sideBySide, setSideBySide] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [centerOffset, setCenterOffset] = useState(0);

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const contentRef = useRef<string>('');

  // Calculate center offset based on viewport
  const updateCenterOffset = useCallback(() => {
    const fullHeight = window.innerHeight;
    const headerHeight = 80;
    const visibleHeight = Math.max(200, fullHeight - headerHeight);
    setCenterOffset(Math.floor(visibleHeight * 0.5));

    // Update fade height CSS variable
    const fadePercent = Math.min(40, (visibleHeight / fullHeight) * 40);
    document.documentElement.style.setProperty('--fade-height', `${fadePercent}%`);
  }, []);

  // Center the cursor in the viewport
  const centerCursor = useCallback(() => {
    const view = editorViewRef.current;
    if (!view || centerOffset === 0) return;

    const cursorPos = view.state.selection.main.head;
    const coords = view.coordsAtPos(cursorPos);
    if (!coords) return;

    const scroller = view.scrollDOM;
    const scrollerRect = scroller.getBoundingClientRect();
    const cursorY = coords.top - scrollerRect.top + scroller.scrollTop;
    const targetScroll = cursorY - centerOffset;

    scroller.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: 'smooth',
    });
  }, [centerOffset]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initialContent = saved ?? DEFAULT_CONTENT;
    setContent(initialContent);
    contentRef.current = initialContent;
    setIsLoaded(true);
  }, []);

  // Initialize center offset
  useEffect(() => {
    updateCenterOffset();
    window.addEventListener('resize', updateCenterOffset);
    return () => window.removeEventListener('resize', updateCenterOffset);
  }, [updateCenterOffset]);

  // Initialize CodeMirror
  useEffect(() => {
    if (!isLoaded || !editorContainerRef.current || preview) return;
    if (editorViewRef.current) return;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const newContent = update.state.doc.toString();
        contentRef.current = newContent;
        setContent(newContent);
      }
      if (update.selectionSet || update.docChanged) {
        requestAnimationFrame(() => centerCursor());
      }
    });

    const state = EditorState.create({
      doc: contentRef.current,
      extensions: [
        darkMinimalTheme,
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        markdown(),
        placeholder('Start writing...'),
        updateListener,
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({
      state,
      parent: editorContainerRef.current,
    });

    editorViewRef.current = view;

    // Apply padding
    if (centerOffset > 0) {
      view.contentDOM.style.paddingTop = `${centerOffset}px`;
      view.contentDOM.style.paddingBottom = `${centerOffset}px`;
    }

    // Initial centering
    requestAnimationFrame(() => centerCursor());

    return () => {
      view.destroy();
      editorViewRef.current = null;
    };
  }, [isLoaded, preview, sideBySide, centerCursor, centerOffset]);

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
                    <div ref={editorContainerRef} className={styles.codemirror} />
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
              <div key="preview" className={styles.preview}>
                <div
                  className={styles.markdown}
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>
            ) : (
              <div key="editor" className={styles.editorWrapper}>
                <div ref={editorContainerRef} className={styles.codemirror} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
