import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';
import {
  ArrowUp,
  Check,
  Copy,
  Crosshair,
  GripVertical,
  Maximize2,
  Minus,
  PanelBottom,
  Plus,
  X,
} from 'lucide-react';
import { useFloating } from '../hooks/useFloating';
import { IconButton } from './Controls';

export type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
};

export function Composer({
  expanded,
  setExpanded,
  active,
  setActive,
  selectedName,
  onPick,
  onClearContext,
  messages,
  onSend,
  onNew,
  inputRef,
  resetVersion,
}: {
  expanded: boolean;
  setExpanded: (value: boolean) => void;
  active: boolean;
  setActive: (value: boolean) => void;
  selectedName: string | null;
  onPick: () => void;
  onClearContext: () => void;
  messages: Message[];
  onSend: (message: string) => void;
  onNew: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
  resetVersion: number;
}) {
  const {
    panelRef,
    position,
    dragging,
    ready,
    viewportHeight,
    dock,
    handleProps,
  } = useFloating();
  const [draft, setDraft] = useState('');
  const [menu, setMenu] = useState(false);
  const [menuBelow, setMenuBelow] = useState(false);
  const [copied, setCopied] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    dock('center');
    setDraft('');
    setMenu(false);
  }, [resetVersion, dock]);
  useEffect(() => {
    setMenu(false);
  }, [position.x, position.y]);
  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, expanded]);
  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );
  useEffect(() => {
    if (!menu) return;
    const close = (event: globalThis.PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenu(false);
    };
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setMenu(false);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', escape);
    };
  }, [menu]);

  const submit = (text = draft) => {
    if (!text.trim()) return;
    onSend(text.trim());
    setDraft('');
    setMenu(false);
    inputRef.current?.focus();
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        messages
          .map(
            (message) =>
              `${message.role === 'user' ? 'You' : 'Assistant'}: ${message.content}`,
          )
          .join('\n\n'),
      );
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section
      ref={panelRef}
      className={`composer ${expanded ? 'is-expanded' : ''} ${dragging ? 'is-dragging' : ''} ${active ? 'is-active' : ''}`}
      aria-label="Floating chat"
      style={
        {
          left: position.x,
          top: position.y,
          visibility: ready ? 'visible' : 'hidden',
          '--chat-viewport-height': `${viewportHeight}px`,
        } as CSSProperties
      }
    >
      {expanded && (
        <>
          <div className="conversation-header">
            <button
              type="button"
              className="conversation-drag drag-handle"
              aria-label="Move chat"
              title="Drag to move · Arrow keys to reposition"
              {...handleProps}
            >
              <span>Conversation</span>
              <GripVertical size={15} />
            </button>
            <span className="demo-badge">Demo</span>
            <IconButton
              label="New conversation"
              onClick={() => {
                onNew();
                inputRef.current?.focus();
              }}
            >
              <Plus size={16} />
            </IconButton>
            <IconButton
              label="Minimise conversation"
              onClick={() => setExpanded(false)}
            >
              <Minus size={17} />
            </IconButton>
          </div>
          <div
            ref={messagesRef}
            className="conversation-body"
            role="log"
            aria-label="Conversation"
            aria-live="polite"
          >
            {messages.length === 0 ? (
              <span className="sr-only">
                No messages yet. No AI provider is connected.
              </span>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`message message-${message.role}`}
                >
                  {message.role === 'assistant' && (
                    <span className="message-label">Demo response</span>
                  )}
                  <p>{message.content}</p>
                </div>
              ))
            )}
          </div>
          {messages.length > 0 && (
            <div className="conversation-actions">
              <button type="button" onClick={copy}>
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy conversation'}
              </button>
            </div>
          )}
        </>
      )}
      {selectedName && (
        <div className="composer-context">
          <Crosshair size={12} />
          <span>{selectedName} in focus</span>
          <IconButton label="Clear focused area" onClick={onClearContext}>
            <X size={12} />
          </IconButton>
        </div>
      )}
      <form
        className="composer-input-row"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        {!expanded && (
          <button
            type="button"
            className="drag-handle collapsed-drag"
            aria-label="Move chat"
            title="Drag to move · Arrow keys to reposition"
            {...handleProps}
          >
            <GripVertical size={18} />
          </button>
        )}
        <div ref={menuRef} className="composer-menu-anchor">
          <IconButton
            label="Chat options"
            aria-expanded={menu}
            onClick={() => {
              setMenuBelow(
                (menuRef.current?.getBoundingClientRect().top ?? 0) < 260,
              );
              setMenu(!menu);
            }}
          >
            <Plus size={19} />
          </IconButton>
          {menu && (
            <div className={`composer-menu ${menuBelow ? 'menu-below' : ''}`}>
              <button
                type="button"
                onClick={() => {
                  onPick();
                  setMenu(false);
                }}
              >
                <Crosshair size={15} /> Select an area
              </button>
              <div className="menu-divider" />
              <span className="menu-heading">MOVE CHAT</span>
              {(['left', 'center', 'right'] as const).map((side) => (
                <button
                  type="button"
                  key={side}
                  onClick={() => {
                    dock(side);
                    setMenu(false);
                  }}
                >
                  <PanelBottom size={15} />
                  {side === 'center' ? 'Bottom centre' : `Bottom ${side}`}
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          ref={inputRef}
          aria-label="Message"
          placeholder={expanded ? 'Reply…' : 'Ask anything…'}
          value={draft}
          maxLength={2000}
          autoComplete="off"
          onChange={(event) => setDraft(event.target.value)}
          onFocus={() => setActive(true)}
        />
        {!expanded && (
          <IconButton
            label="Expand conversation"
            className="expand-chat"
            onClick={() => {
              setExpanded(true);
              setActive(true);
              inputRef.current?.focus();
            }}
          >
            <Maximize2 size={15} />
          </IconButton>
        )}
        <button
          type="submit"
          className="send-button"
          aria-label="Send message"
          disabled={!draft.trim()}
        >
          <ArrowUp size={18} />
        </button>
      </form>
    </section>
  );
}
