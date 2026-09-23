import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';
import {
  ArrowUp,
  Check,
  ChevronDown,
  Copy,
  Crosshair,
  MessageCircle,
  PanelBottom,
  Plus,
  SquarePen,
  ThumbsDown,
  ThumbsUp,
  X,
} from 'lucide-react';
import { useFloating } from '../hooks/useFloating';
import { demoResponse } from '../lib/demo-response';
import { IconButton } from './Controls';

export type Message = {
  id: number;
  role: 'user' | 'assistant';
  content: string;
};
type Vote = 'up' | 'down';

function Response({
  content,
  copied,
  vote,
  onCopy,
  onVote,
}: {
  content: string;
  copied: boolean;
  vote?: Vote;
  onCopy: () => void;
  onVote: (vote: Vote) => void;
}) {
  return (
    <div className="message message-assistant">
      <pre className="response-code" aria-label="Sample response">
        <code>
          {content.split('\n').map((line, index) => (
            <span
              key={index}
              className={line.startsWith('#') ? 'code-heading' : ''}
            >
              {line.startsWith('- ') ? (
                <>
                  <span className="code-bullet">- </span>
                  {line.slice(2)}
                </>
              ) : (
                line || '\u00a0'
              )}
            </span>
          ))}
        </code>
      </pre>
      <div className="response-actions">
        <IconButton
          label={copied ? 'Response copied' : 'Copy response'}
          onClick={onCopy}
        >
          {copied ? <Check size={15} /> : <Copy size={15} />}
        </IconButton>
        <IconButton
          label="Helpful response"
          aria-pressed={vote === 'up'}
          onClick={() => onVote('up')}
        >
          <ThumbsUp size={15} />
        </IconButton>
        <IconButton
          label="Unhelpful response"
          aria-pressed={vote === 'down'}
          onClick={() => onVote('down')}
        >
          <ThumbsDown size={15} />
        </IconButton>
      </div>
    </div>
  );
}

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
  const [menu, setMenu] = useState<'context' | 'model' | null>(null);
  const [menuBelow, setMenuBelow] = useState(false);
  const [model, setModel] = useState('Pro');
  const [copied, setCopied] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Record<string, Vote | undefined>>(
    {},
  );
  const [status, setStatus] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const modelRef = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    dock('center');
    setDraft('');
    setMenu(null);
    setModel('Pro');
    setFeedback({});
    setCopied(null);
    setStatus('');
  }, [resetVersion, dock]);
  useEffect(() => {
    setMenu(null);
  }, [position.x, position.y]);
  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messages.length ? messagesRef.current.scrollHeight : 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'instant'
        : 'smooth',
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
      if (
        !menuRef.current?.contains(event.target as Node) &&
        !modelRef.current?.contains(event.target as Node)
      )
        setMenu(null);
    };
    const escape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setMenu(null);
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', escape);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', escape);
    };
  }, [menu]);

  const toggleMenu = (type: 'context' | 'model') => {
    const anchor = type === 'context' ? menuRef : modelRef;
    const top =
      (anchor.current?.getBoundingClientRect().top ?? 0) -
      (window.visualViewport?.offsetTop ?? 0);
    setMenuBelow(top < (type === 'context' ? 270 : 155));
    setMenu(menu === type ? null : type);
  };
  const submit = () => {
    if (!draft.trim()) return;
    onSend(draft.trim());
    setDraft('');
    setMenu(null);
    inputRef.current?.focus();
  };
  const copy = async (id: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(id);
      setStatus('Response copied.');
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(null), 1800);
    } catch {
      setStatus('Could not copy. Select the response text to copy it.');
    }
  };
  const vote = (id: string, value: Vote) => {
    setFeedback((current) => ({
      ...current,
      [id]: current[id] === value ? undefined : value,
    }));
    setStatus('Feedback updated in this local demo.');
  };
  const context = selectedName && (
    <div className="composer-context">
      <Crosshair size={12} />
      <span>{selectedName} in focus</span>
      <IconButton label="Clear focused area" onClick={onClearContext}>
        <X size={12} />
      </IconButton>
    </div>
  );
  const sample = demoResponse(selectedName);

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
      {!expanded && context}
      <div className="composer-surface">
        {expanded ? (
          <>
            <div className="conversation-header">
              <button
                type="button"
                className="conversation-drag drag-handle"
                aria-label="Move chat"
                title="Drag to move · Arrow keys to reposition"
                {...handleProps}
              >
                Ask Pocket
              </button>
              <button
                type="button"
                className="new-chat-button"
                onClick={() => {
                  onNew();
                  setDraft('');
                  setFeedback({});
                  setCopied(null);
                  inputRef.current?.focus();
                }}
              >
                <SquarePen size={15} />
                New Chat
              </button>
              <IconButton
                label="Close conversation"
                className="close-chat"
                onClick={() => {
                  setExpanded(false);
                  setActive(false);
                }}
              >
                <X size={13} />
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
                <Response
                  content={sample}
                  copied={copied === 'preview'}
                  vote={feedback.preview}
                  onCopy={() => void copy('preview', sample)}
                  onVote={(value) => vote('preview', value)}
                />
              ) : (
                messages.map((message) =>
                  message.role === 'user' ? (
                    <div key={message.id} className="message message-user">
                      <p>{message.content}</p>
                    </div>
                  ) : (
                    <Response
                      key={message.id}
                      content={message.content}
                      copied={copied === String(message.id)}
                      vote={feedback[message.id]}
                      onCopy={() =>
                        void copy(String(message.id), message.content)
                      }
                      onVote={(value) => vote(String(message.id), value)}
                    />
                  ),
                )
              )}
            </div>
            {context}
          </>
        ) : (
          <button
            type="button"
            className="composer-drag-surface drag-handle"
            aria-label="Move chat"
            title="Drag the edge to move · Arrow keys to reposition"
            {...handleProps}
          />
        )}
        <form
          className="composer-input-row"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <div ref={menuRef} className="composer-menu-anchor">
            <IconButton
              label="Chat options"
              aria-expanded={menu === 'context'}
              onClick={() => toggleMenu('context')}
            >
              <Plus size={17} />
            </IconButton>
            {menu === 'context' && (
              <div className={`composer-menu ${menuBelow ? 'menu-below' : ''}`}>
                {!expanded && (
                  <button
                    type="button"
                    onClick={() => {
                      setExpanded(true);
                      setActive(true);
                      setMenu(null);
                    }}
                  >
                    <MessageCircle size={15} />
                    Open conversation
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    onPick();
                    setMenu(null);
                  }}
                >
                  <Crosshair size={15} />
                  Select an area
                </button>
                <div className="menu-divider" />
                <span className="menu-heading">MOVE CHAT</span>
                {(['left', 'center', 'right'] as const).map((side) => (
                  <button
                    type="button"
                    key={side}
                    onClick={() => {
                      dock(side);
                      setMenu(null);
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
            placeholder={expanded ? 'Reply to Pocket' : ''}
            value={draft}
            maxLength={2000}
            autoComplete="off"
            onChange={(event) => setDraft(event.target.value)}
            onFocus={() => setActive(true)}
          />
          <div ref={modelRef} className="composer-menu-anchor model-anchor">
            <button
              type="button"
              className="model-button"
              aria-label={`Demo model: ${model}`}
              aria-expanded={menu === 'model'}
              onClick={() => toggleMenu('model')}
            >
              {model}
              <ChevronDown size={12} />
            </button>
            {menu === 'model' && (
              <div
                className={`composer-menu model-menu ${menuBelow ? 'menu-below' : ''}`}
                role="group"
                aria-label="Demo model"
              >
                {['Pro', 'Standard'].map((value) => (
                  <button
                    type="button"
                    key={value}
                    aria-pressed={model === value}
                    onClick={() => {
                      setModel(value);
                      setMenu(null);
                    }}
                  >
                    {value}
                    {model === value && <Check size={13} />}
                  </button>
                ))}
                <span className="model-note">Demo only · no AI connected</span>
              </div>
            )}
          </div>
          <button
            type="submit"
            className="send-button"
            aria-label="Send message"
            disabled={!draft.trim()}
          >
            <ArrowUp size={17} />
          </button>
        </form>
      </div>
      <span className="sr-only" role="status">
        {status}
      </span>
    </section>
  );
}
