import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  ArrowLeft,
  CircleHelp,
  Crosshair,
  FileText,
  Github,
  Home,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  RotateCcw,
  X,
} from 'lucide-react';
import { Canvas, regions } from './components/Canvas';
import { Composer, type Message } from './components/Composer';
import { IconButton } from './components/Controls';
import { demoResponse } from './lib/demo-response';

type Focus = 'off' | 'chat' | 'area';

export default function App() {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(false);
  const [focus, setFocus] = useState<Focus>('chat');
  const [selected, setSelected] = useState<number | null>(null);
  const [picking, setPicking] = useState(false);
  const [blur, setBlur] = useState(6);
  const [sidebar, setSidebar] = useState(() => window.innerWidth > 900);
  const [inspector, setInspector] = useState(() => window.innerWidth > 700);
  const [help, setHelp] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [resetVersion, setResetVersion] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const helpCloseRef = useRef<HTMLButtonElement>(null);
  const messageId = useRef(0);
  const focusEngaged =
    !picking &&
    ((focus === 'chat' && (active || expanded)) ||
      (focus === 'area' && selected !== null));

  useEffect(() => {
    const navQuery = window.matchMedia('(min-width: 901px)');
    const controlsQuery = window.matchMedia('(min-width: 701px)');
    const syncNav = () => setSidebar(navQuery.matches);
    const syncControls = () => setInspector(controlsQuery.matches);
    navQuery.addEventListener('change', syncNav);
    controlsQuery.addEventListener('change', syncControls);
    return () => {
      navQuery.removeEventListener('change', syncNav);
      controlsQuery.removeEventListener('change', syncControls);
    };
  }, []);

  const closeHelp = () => {
    setHelp(false);
    helpButtonRef.current?.focus();
  };
  useEffect(() => {
    if (help) helpCloseRef.current?.focus();
  }, [help]);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setActive(true);
      }
      if (event.key === 'Escape') {
        if (help) {
          closeHelp();
          return;
        }
        setPicking(false);
        setExpanded(false);
        setActive(false);
        setFocus('off');
        setSelected(null);
        inputRef.current?.blur();
        setAnnouncement('Focus cleared. Back to your canvas.');
      }
    };
    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [help]);

  const reset = () => {
    setExpanded(false);
    setActive(false);
    setFocus('chat');
    setSelected(null);
    setPicking(false);
    setBlur(6);
    setMessages([]);
    setHelp(false);
    setResetVersion((value) => value + 1);
    setAnnouncement('Playground reset.');
  };
  const pick = () => {
    setPicking(true);
    setFocus('area');
    setSelected(null);
    setExpanded(false);
    if (window.innerWidth <= 700) setInspector(false);
    setAnnouncement('Choose an outlined area on the canvas.');
  };
  const select = (index: number) => {
    setSelected(index);
    setFocus('area');
    setPicking(false);
    setAnnouncement(`${regions[index]} is in focus.`);
  };
  const changeFocus = (value: Focus) => {
    setFocus(value);
    if (value === 'area' && selected === null) pick();
    else setPicking(false);
    if (value !== 'area') setSelected(null);
    if (value === 'chat') {
      setActive(true);
      inputRef.current?.focus();
    }
  };
  const send = (content: string) => {
    const reply = demoResponse(selected !== null ? regions[selected] : null);
    setMessages((current) => [
      ...current,
      { id: ++messageId.current, role: 'user', content },
      { id: ++messageId.current, role: 'assistant', content: reply },
    ]);
    setExpanded(true);
    setActive(true);
  };

  return (
    <div
      className={`app ${sidebar ? '' : 'sidebar-collapsed'} ${inspector ? '' : 'inspector-collapsed'}`}
      style={{ '--focus-blur': `${blur}px` } as CSSProperties}
    >
      <header className="topbar">
        <div className="topbar-gutter" aria-hidden="true" />
        <div className="topbar-left">
          <IconButton
            label={sidebar ? 'Hide navigation' : 'Show navigation'}
            onClick={() => setSidebar(!sidebar)}
          >
            {sidebar ? (
              <PanelLeftClose size={16} />
            ) : (
              <PanelLeftOpen size={16} />
            )}
          </IconButton>
          <div className="document-tab">
            <FileText size={14} />
            <span>Untitled</span>
          </div>
        </div>
        <div className="topbar-right">
          <IconButton
            label={inspector ? 'Hide focus controls' : 'Show focus controls'}
            onClick={() => setInspector(!inspector)}
          >
            {inspector ? (
              <PanelRightClose size={16} />
            ) : (
              <PanelRightOpen size={16} />
            )}
          </IconButton>
        </div>
      </header>

      <aside className="sidebar" aria-label="Main navigation">
        <nav>
          <button
            type="button"
            className={`nav-item ${!expanded ? 'selected' : ''}`}
            onClick={() => {
              setExpanded(false);
              setActive(false);
            }}
          >
            <Home size={17} />
            <span>Home</span>
          </button>
          <button
            type="button"
            className={`nav-item ${expanded ? 'selected' : ''}`}
            onClick={() => {
              setExpanded(true);
              inputRef.current?.focus();
            }}
          >
            <MessageCircle size={17} />
            <span>Conversation</span>
            {messages.length > 0 && (
              <span className="count">{messages.length / 2}</span>
            )}
          </button>
        </nav>
        <div className="sidebar-bottom">
          <button
            type="button"
            ref={helpButtonRef}
            className="icon-button"
            aria-label="Keyboard shortcuts"
            title="Keyboard shortcuts"
            onClick={() => setHelp(!help)}
            aria-expanded={help}
          >
            <CircleHelp size={16} />
          </button>
          <a
            className="icon-button"
            aria-label="View source on GitHub"
            title="View source on GitHub"
            href="https://github.com/CarlHolland93/float"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={16} />
          </a>
        </div>
      </aside>

      <main className="canvas-shell" aria-label="Canvas">
        <div className="canvas-toolbar">
          <div className="breadcrumb">
            <button
              type="button"
              aria-label="Return to canvas"
              onClick={() => {
                setFocus('off');
                setSelected(null);
                setExpanded(false);
                setPicking(false);
              }}
            >
              <ArrowLeft size={15} />
            </button>
            <span>Back</span>
          </div>
          <div className="canvas-tools">
            <IconButton label="Reset playground" onClick={reset}>
              <RotateCcw size={15} />
            </IconButton>
          </div>
        </div>
        {picking && (
          <div className="selection-banner" role="status">
            <Crosshair size={14} />
            <span>Choose an area to keep in focus</span>
            <button
              type="button"
              onClick={() => {
                setPicking(false);
                setFocus('off');
              }}
              aria-label="Cancel area selection"
            >
              <X size={14} />
            </button>
          </div>
        )}
        <div className="canvas-scroll">
          <Canvas
            selected={focus === 'area' ? selected : null}
            picking={picking}
            blurred={focusEngaged}
            onSelect={select}
          />
        </div>
      </main>

      <aside className="inspector" aria-label="Focus controls">
        <h1 className="focus-heading">Focus</h1>
        <div className="segmented" aria-label="Focus mode" role="group">
          {(['off', 'chat', 'area'] as const).map((value) => (
            <button
              type="button"
              key={value}
              aria-pressed={focus === value}
              className={focus === value ? 'is-selected' : ''}
              onClick={() => changeFocus(value)}
            >
              {value === 'off' ? 'Off' : value === 'chat' ? 'Chat' : 'Area'}
            </button>
          ))}
        </div>
        <div className="range-label">
          <label htmlFor="blur">Blur</label>
          <output htmlFor="blur">
            {blur}
            <span>px</span>
          </output>
        </div>
        <input
          id="blur"
          className="blur-range"
          type="range"
          min="0"
          max="12"
          step="1"
          value={blur}
          onChange={(event) => setBlur(Number(event.target.value))}
          style={{ '--range-value': `${(blur / 12) * 100}%` } as CSSProperties}
        />
      </aside>

      <Composer
        expanded={expanded}
        setExpanded={setExpanded}
        active={active || expanded}
        setActive={setActive}
        selectedName={selected !== null ? regions[selected] : null}
        onPick={pick}
        onClearContext={() => {
          setSelected(null);
          setFocus('off');
        }}
        messages={messages}
        onSend={send}
        onNew={() => setMessages([])}
        inputRef={inputRef}
        resetVersion={resetVersion}
      />

      {help && (
        <section className="help-popover" aria-label="Keyboard shortcuts">
          <div className="help-title">
            <h2>Keyboard shortcuts</h2>
            <button
              ref={helpCloseRef}
              type="button"
              className="icon-button"
              aria-label="Close instructions"
              onClick={closeHelp}
            >
              <X size={15} />
            </button>
          </div>
          <dl className="shortcuts">
            <div>
              <dt>Message</dt>
              <dd>⌘ / Ctrl K</dd>
            </div>
            <div>
              <dt>Move focused handle</dt>
              <dd>Arrow keys</dd>
            </div>
            <div>
              <dt>Dock focused handle</dt>
              <dd>Home</dd>
            </div>
            <div>
              <dt>Clear focus</dt>
              <dd>Esc</dd>
            </div>
          </dl>
        </section>
      )}
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>
    </div>
  );
}
