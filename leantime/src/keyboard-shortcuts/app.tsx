import { render } from 'solid-js/web';
import { getPanel } from '@violentmonkey/ui';
// global CSS
import globalCss from './style.css';
// CSS modules
import styles, { stylesheet } from './style.module.css';

const shortcuts = [
  {
    title: 'Global',
    shortcuts: [
      {
        keys: '?',
        description:
          'Open keyboard navigation help. You already knew that, right?!',
        callable: () => panel.show(),
      },
      {
        keys: 'Escape',
        description: 'Close this overlay',
        callable: () => {
          panel.hide();
        },
      },

      {
        keys: 'g, h',
        description: 'Go home',
        path: '/',
      },
      {
        keys: 'g, p',
        description: 'Show projects',
        path: '/projects/showMy',
      },
      {
        keys: 'g, c',
        description: 'Show calendar',
        path: '/calendar/showMyCalendar',
      },
      {
        keys: 'g, m',
        description: 'Show profile',
        path: '/users/editOwn/',
      },
      {
        keys: 'g, t, w',
        description: 'Show week timesheets',
        path: '/timesheets/showMy',
      },
      {
        keys: 'g, t, l',
        description: 'Show list timesheets',
        path: '/timesheets/showMyList',
      },
    ],
  },

  {
    title: 'Project (@todo)',
    shortcuts: [
      {
        keys: 'c',
        description: 'Create new to-do',
      },
    ],
  },

  {
    title: 'To-do (@todo)',
    shortcuts: [
      {
        keys: 't',
        description: 'Track time on current to-do',
      },
    ],
  },
];

function Help() {
  const renderKeys = (keys) => {
    const items = keys.split(/\s*(,)\s*/g);
    return (
      <span>
        {items.map((key) =>
          ',' === key ? (
            <>
              {' '}
              <span class="then">then</span>{' '}
            </>
          ) : (
            <kbd>{key}</kbd>
          ),
        )}
      </span>
    );
  };

  return (
    <div class={styles.keyboardShortcuts}>
      <h1>Keyboard shortcuts</h1>

      {shortcuts.map((section) => (
        <section>
          <h2>{section.title}</h2>

          <table class={styles.table}>
            {section.shortcuts.map((shortcut) => (
              <tr>
                <td>{renderKeys(shortcut.keys)}</td>
                <td>{shortcut.description}</td>
              </tr>
            ))}
          </table>
        </section>
      ))}
    </div>
  );
}

// Let's create a movable panel using @violentmonkey/ui
// @see https://violentmonkey.github.io/vm-ui/functions/getPanel.html
const panel = getPanel({
  theme: 'dark',
  style: [globalCss, stylesheet].join('\n'),
});
Object.assign(panel.wrapper.style, {
  top: '10vh',
  left: '10vw',
});
render(Help, panel.body);

import { bindKey, bindKeyCombo } from '@rwh/keystrokes';

const allShortcuts = [].concat(
  ...shortcuts.map((section) => section.shortcuts),
);

const navigate = (path) => {
  if (window.location.pathname !== path) {
    window.location.pathname = path;
  }
};

// Build navigate shortcuts
for (const shortcut of allShortcuts.filter((shortcut) => shortcut.path)) {
  (1 === shortcut.keys.length ? bindKey : bindKeyCombo)(shortcut.keys, () =>
    navigate(shortcut.path),
  );
}

// Build callback shortcuts
for (const shortcut of allShortcuts.filter((shortcut) => shortcut.callable)) {
  (1 === shortcut.keys.length ? bindKey : bindKeyCombo)(shortcut.keys, () => {
    shortcut.callable();
  });
}
