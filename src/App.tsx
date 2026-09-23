import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  Command,
  Crosshair,
  FileText,
  Folder,
  Github,
  LayoutTemplate,
  MessageCircle,
  MousePointer2,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  RotateCcw,
  SlidersHorizontal,
  Sparkles,
  X,
} from 'lucide-react';
import { Canvas, regions } from './components/Canvas';
import { Composer, type Message } from './components/Composer';
import { FloatMark, IconButton } from './components/Controls';

type Focus = 'off' | 'chat' | 'area';

export default function App() {
  const [expanded, setExpanded] = useState(false);
  const [active, setActive] = useState(false);
  const [focus, setFocus] = useState<Focus>('chat');
  const [selected, setSelected] = useState<number | null>(null);
  const [picking, setPicking] = useState(false);
  const [blur, setBlur] = useState(6);
  const [outlines, setOutlines] = useState(true);
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
    setOutlines(true);
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
    const context =
      selected !== null
        ? `the ${regions[selected].toLowerCase()} area`
        : 'your canvas';
    let reply = `Your thought is here, alongside ${context}. Try moving this conversation somewhere that feels right.\n\nThis is a local interaction demo. Responses are predefined; no message is sent to an AI service.`;
    if (content === 'Summarise')
      reply = `A movable conversation. A quieter canvas. Your context stays close.\n\nIn a connected version, this would summarise ${context}. These outlines contain no actual content.`;
    if (content === 'Explore')
      reply =
        'Try selecting an area behind this conversation. It will stay sharp as everything around it softens.\n\nThen drag this window alongside it. The conversation follows your attention.';
    if (content === 'Rewrite')
      reply =
        'A place for a thought, wherever you need it.\n\nThis is a sample response for the interaction. Connect an AI provider to rewrite real content.';
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
        <a
          className="brand"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            reset();
          }}
          aria-label="Float home"
        >
          <FloatMark />
          <span>
            float<span className="brand-period">.</span>
          </span>
        </a>
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
            <span>Untitled canvas</span>
            <span className="tab-dot" />
          </div>
        </div>
        <div className="topbar-right">
          <span className="experiment-label">An interface experiment</span>
          <a
            className="source-link"
            aria-label="View source on GitHub"
            href="https://github.com/CarlHolland93/float"
            target="_blank"
            rel="noreferrer"
          >
            <Github size={15} />
            <span>Source</span>
            <ArrowUpRight size={12} />
          </a>
          <IconButton
            label={
              inspector
                ? 'Hide playground controls'
                : 'Show playground controls'
            }
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
        <div className="workspace-switcher">
          <span className="workspace-avatar">F</span>
          <div>
            <strong>Personal space</strong>
            <span>Make room for a thought</span>
          </div>
          <ChevronDown size={13} aria-hidden="true" />
        </div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          <button
            type="button"
            className={`nav-item ${!expanded ? 'selected' : ''}`}
            onClick={() => {
              setExpanded(false);
              setActive(false);
            }}
          >
            <LayoutTemplate size={17} />
            <span>Canvas</span>
            <span className="nav-indicator" />
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
        <div className="nav-label spaces-label">
          SPACES
          <IconButton label="New canvas" onClick={reset}>
            <Plus size={14} />
          </IconButton>
        </div>
        <button
          type="button"
          className="nav-item space-item"
          onClick={() => {
            setExpanded(false);
            setPicking(false);
          }}
        >
          <Folder size={16} />
          <span>Untitled</span>
          <span className="count">1</span>
        </button>
        <div className="sidebar-bottom">
          <div className="experiment-card">
            <div className="experiment-card-top">
              <span className="live-dot" />
              <span>EXPERIMENT 001</span>
            </div>
            <strong>AI, with room to move.</strong>
            <p>
              A small exploration of
              <br />
              conversation and focus.
            </p>
          </div>
          <button
            type="button"
            ref={helpButtonRef}
            className="nav-item help-button"
            onClick={() => setHelp(!help)}
            aria-expanded={help}
          >
            <CircleHelp size={17} />
            <span>How it works</span>
            <ArrowUpRight size={13} />
          </button>
          <div className="sidebar-footer">
            <span>Float playground</span>
            <span>v0.1</span>
          </div>
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
            <span>Workspace</span>
            <span className="breadcrumb-slash">/</span>
            <strong>Untitled</strong>
          </div>
          <div className="canvas-tools">
            <span className="outline-label">Content-free canvas</span>
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
            showOutlines={outlines}
            onSelect={select}
          />
        </div>
        <div className="canvas-status">
          <span>
            <span className={`status-dot ${focusEngaged ? 'engaged' : ''}`} />
            {picking
              ? 'Choosing a focus area'
              : focusEngaged
                ? selected !== null
                  ? `${regions[selected]} in focus`
                  : 'Conversation in focus'
                : 'A clear canvas'}
          </span>
          <span>
            <Command size={11} /> K{' '}
            <span className="status-separator">to start a thought</span>
          </span>
        </div>
      </main>

      <aside className="inspector" aria-label="Playground controls">
        <div className="inspector-title">
          <SlidersHorizontal size={15} />
          <h1>Playground</h1>
          <span>LIVE</span>
        </div>
        <section className="control-section">
          <div className="section-eyebrow">
            01 <span>ATTENTION</span>
          </div>
          <h2>A softer background.</h2>
          <p>Keep your next thought in focus.</p>
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
            <label htmlFor="blur">Blur strength</label>
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
            style={
              { '--range-value': `${(blur / 12) * 100}%` } as CSSProperties
            }
          />
          <div className="range-captions">
            <span>Subtle</span>
            <span>Immersive</span>
          </div>
        </section>
        <section className="control-section">
          <div className="section-eyebrow">
            02 <span>CONTEXT</span>
          </div>
          <div className="context-preview">
            <div
              className={`preview-sheet ${selected !== null ? 'has-selection' : ''}`}
              aria-hidden="true"
            >
              <i />
              <i />
              <i />
              <i />
            </div>
            <div>
              <strong>
                {selected !== null ? regions[selected] : 'The whole canvas'}
              </strong>
              <span>
                {selected !== null
                  ? 'One area. Full attention.'
                  : 'Or focus on just one area.'}
              </span>
            </div>
          </div>
          <button
            type="button"
            className={`select-area-button ${picking ? 'is-picking' : ''}`}
            onClick={pick}
          >
            <Crosshair size={15} />
            {picking ? 'Select on the canvas…' : 'Select an area'}
            <ArrowUpRight size={13} />
          </button>
          {selected !== null && (
            <button
              type="button"
              className="clear-context"
              onClick={() => {
                setSelected(null);
                setFocus('off');
                setPicking(false);
              }}
            >
              Clear selection <X size={12} />
            </button>
          )}
        </section>
        <section className="control-section canvas-controls">
          <div className="section-eyebrow">
            03 <span>CANVAS</span>
          </div>
          <label className="toggle-label" htmlFor="outlines">
            <span>Content outlines</span>
            <input
              id="outlines"
              className="toggle"
              role="switch"
              type="checkbox"
              checked={outlines}
              onChange={(event) => setOutlines(event.target.checked)}
            />
          </label>
          <p>Just enough shape to feel the focus.</p>
        </section>
        <div className="inspector-bottom">
          <div className="drag-note">
            <MousePointer2 size={17} />
            <p>
              Move the chat.
              <br />
              <span>The space is yours.</span>
            </p>
            <ArrowDownLeft size={21} />
          </div>
          <button type="button" className="reset-button" onClick={reset}>
            <RotateCcw size={13} />
            Reset playground
          </button>
        </div>
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
        <section className="help-popover" aria-label="How Float works">
          <div className="help-title">
            <FloatMark small />
            <h2>A little room to think.</h2>
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
          <p>This is a playground for how AI could feel in a workspace.</p>
          <ul>
            <li>
              <MousePointer2 size={15} />
              <span>
                <strong>Move it.</strong> Drag the dotted handle anywhere.
              </span>
            </li>
            <li>
              <Crosshair size={15} />
              <span>
                <strong>Focus it.</strong> Select an outline to quiet the rest.
              </span>
            </li>
            <li>
              <Sparkles size={15} />
              <span>
                <strong>Try it.</strong> Send a thought to open a demo reply.
              </span>
            </li>
            <li>
              <Check size={15} />
              <span>
                <strong>Your keyboard works too.</strong> Use ⌘/Ctrl K to type,
                arrow keys on the handle to move, Home to dock, and Esc to clear
                focus.
              </span>
            </li>
          </ul>
          <div className="help-disclaimer">
            No AI service is connected. Messages stay in this tab and disappear
            on reload.
          </div>
        </section>
      )}
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>
    </div>
  );
}
