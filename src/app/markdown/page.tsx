'use client';

import React, { useState, useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, placeholder } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import html from 'remark-html';
import { IconDownload, IconColumns, IconColumns1 } from '@tabler/icons-react';
import VerticalSidebar from '../../ui/VerticalSidebar';
import Copyright from '../../ui/Copyright';
import styles from '../../styles/Markdown.module.css';

const STORAGE_KEY = 'markdown-writer-content';
const SAVE_DELAY = 500;
const PADDING = 200;

const DEFAULT_CONTENT = `I made this for me but you are welcome to use this too. Nothing stored on server, just localstorage. Minimal web based markdown editor.

# Header 1
## Header 2
### Header 3

---

This is inline \`code\`, **bold**, *italics*, and ~~strikethrough~~.

This is a [link to my homepage](https://defnf.com).

> This is a block quote

- Unordered
- List
  - Nested item

1. Ordered
2. List

\`\`\`
// Code block
const greeting = "Hello, world!";
console.log(greeting);
\`\`\`
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
    padding: `${PADDING}px 0`,
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
  const [preview, setPreview] = useState(false);
  const [sideBySide, setSideBySide] = useState(false);
  const [htmlContent, setHtmlContent] = useState('');

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorViewRef = useRef<EditorView | null>(null);
  const contentRef = useRef<string>('');

  // Prevent iOS Chrome overscroll on non-scrollable areas
  useEffect(() => {
    const isIOSChrome = /CriOS/.test(navigator.userAgent);
    if (!isIOSChrome) return;

    const prevent = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      // Allow scrolling inside CodeMirror scroller
      if (target.closest('.cm-scroller')) return;
      e.preventDefault();
    };

    document.addEventListener('touchmove', prevent, { passive: false });
    return () => document.removeEventListener('touchmove', prevent);
  }, []);

  // Initialize CodeMirror
  useEffect(() => {
    if (!editorContainerRef.current || preview) return;
    if (editorViewRef.current) return;

    const saved = localStorage.getItem(STORAGE_KEY);
    const initialContent = saved ?? DEFAULT_CONTENT;
    contentRef.current = initialContent;

    let saveTimeout: NodeJS.Timeout | null = null;

    const centerCursor = (view: EditorView) => {
      const pos = view.state.selection.main.head;
      const coords = view.coordsAtPos(pos);
      if (!coords) return;

      const scroller = view.scrollDOM;
      const rect = scroller.getBoundingClientRect();
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const visibleHeight = Math.min(rect.height, viewportHeight - rect.top);

      const cursorY = coords.top - rect.top + scroller.scrollTop;
      const targetScroll = cursorY - visibleHeight * 0.4;

      scroller.scrollTo({
        top: Math.max(0, targetScroll),
        behavior: 'smooth',
      });
    };

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const newContent = update.state.doc.toString();
        contentRef.current = newContent;
        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
          localStorage.setItem(STORAGE_KEY, newContent);
        }, SAVE_DELAY);

        requestAnimationFrame(() => centerCursor(update.view));

        // Update preview if in side-by-side mode
        if (sideBySide) {
          remark()
            .use(remarkGfm)
            .use(html)
            .process(newContent)
            .then((result) => setHtmlContent(result.toString()));
        }
      }
    });

    const state = EditorState.create({
      doc: initialContent,
      extensions: [
        darkMinimalTheme,
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        markdown(),
        placeholder('Start writing...'),
        updateListener,
        EditorView.lineWrapping,
        // Disable default scroll-into-view behavior
        EditorView.scrollHandler.of(() => true),
      ],
    });

    const view = new EditorView({
      state,
      parent: editorContainerRef.current,
    });

    editorViewRef.current = view;

    return () => {
      if (saveTimeout) clearTimeout(saveTimeout);
      view.destroy();
      editorViewRef.current = null;
    };
  }, [preview, sideBySide]);

  const handleDownload = () => {
    const content = editorViewRef.current?.state.doc.toString() ?? contentRef.current;
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

  const togglePreview = () => {
    if (!preview) {
      // Entering preview - parse markdown
      const content = editorViewRef.current?.state.doc.toString() ?? contentRef.current;
      remark()
        .use(remarkGfm)
        .use(html)
        .process(content)
        .then((result) => setHtmlContent(result.toString()));
    }
    setPreview(!preview);
  };

  const toggleSideBySide = () => {
    if (!sideBySide) {
      // Entering side-by-side - parse markdown
      const content = editorViewRef.current?.state.doc.toString() ?? contentRef.current;
      remark()
        .use(remarkGfm)
        .use(html)
        .process(content)
        .then((result) => setHtmlContent(result.toString()));
      setPreview(false);
    }
    setSideBySide(!sideBySide);
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
              <div className={styles.preview}>
                <div
                  className={styles.markdown}
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              </div>
            ) : (
              <div className={styles.editorWrapper}>
                <div ref={editorContainerRef} className={styles.codemirror} />
              </div>
            )}
          </div>
          <div className={styles.mobileFooter}>
            <Copyright />
          </div>
        </div>
      </div>
      <Copyright fixed />
    </div>
  );
}
