import { render } from 'solid-js/web';
import { getPanel, showToast } from '@violentmonkey/ui';
// global CSS
import globalCss from './style.css';
// CSS modules
import styles, { stylesheet } from './style.module.css';
import { bindKey, bindKeyCombo, BrowserKeyComboEvent } from '@rwh/keystrokes';
import { getProject, getToDo } from './leantime';

let panelShown = false;

const shortcuts = [
  {
    title: 'Global',
    shortcuts: [
      {
        keys: '?',
        description: 'Toggle keyboard navigation help overlay.',
        callable: () => {
          if (panelShown) {
            panel.hide();
          } else {
            panel.show();
          }
          panelShown = !panelShown;
        },
      },

      // This conflicts with Leantime keyboard shortcut.
      // {
      //   keys: 'Escape',
      //   description: 'Close this overlay',
      //   callable: () => {
      //     panel.hide();
      //   },
      // },

      {
        keys: 'g, h',
        description: 'Go home',
        path: '/',
        toast: 'Going home …',
      },
      {
        keys: 'g, p',
        description: 'Show projects',
        path: '/projects/showMy',
        toast: 'Going to projects …',
      },
      {
        keys: 'g, c',
        description: 'Show calendar',
        path: '/calendar/showMyCalendar',
        toast: 'Going to calendar …',
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
    title: 'Project',
    shortcuts: [
      {
        keys: 'c',
        description: 'Create new To-Do in current project',
        context: getProject,
        callable: (project) => {
          if (project) {
            const url = new URL(location.href);
            url.hash = '#/tickets/newTicket';
            navigate(url.toString());
          }
        },
      },
    ],
  },

  {
    title: 'To-do',
    shortcuts: [
      {
        keys: 't',
        description: 'Track time on current To-Do',
        context: getToDo,
        callable: (todo) => {
          if (todo.url) {
            const url = new URL(todo.url);
            url.searchParams.set('tab', 'timesheet');
            navigate(url.toString());
          }
        },
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

const inContext = (event: BrowserKeyComboEvent, context) => {
  // @see https://github.com/RobertWHurst/Keystrokes/issues/29#issuecomment-1802877351
  const browserEvent = event.originalEvent;
  const target = browserEvent?.target as HTMLElement;

  // Never run if context is an editable control.
  if (
    target &&
    (target.isContentEditable ||
      ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName))
  ) {
    return false;
  }

  if ('function' === typeof context) {
    return context(event);
  }

  // @todo (How) should we handle this case (where context is not a function)?
  return true;
};

const allShortcuts = [].concat(
  ...shortcuts.map((section) => section.shortcuts),
);

const navigate = (destination) => {
  const url = new URL(destination, location.href).toString();
  if (location.href !== url) {
    location.href = url;
  }
};

for (const shortcut of allShortcuts) {
  (1 === shortcut.keys.length ? bindKey : bindKeyCombo)(
    shortcut.keys,
    (event) => {
      const context = inContext(event, shortcut.context);
      if (context) {
        if (shortcut.path) {
          if (shortcut.toast) {
            showToast(shortcut.toast, {
              theme: 'dark',
            });
          }
          navigate(shortcut.path);
        } else if (
          shortcut.callable &&
          'function' === typeof shortcut.callable
        ) {
          shortcut.callable(context, event);
        }
      }
    },
  );
}
