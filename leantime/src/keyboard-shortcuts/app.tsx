import { render } from 'solid-js/web';
import { getPanel, showToast } from '@violentmonkey/ui';
// global CSS
import globalCss from './style.css';
// CSS modules
import styles, { stylesheet } from './style.module.css';
import { bindKey, bindKeyCombo, BrowserKeyComboEvent } from '@rwh/keystrokes';
import { getProject, getToDo } from './lib/leantime';
import { translate as t } from './lib/translation';

let panelShown = false;

const shortcuts = [
  {
    title: t('Global'),
    shortcuts: [
      {
        keys: '?',
        description: t('Toggle keyboard navigation help overlay.'),
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
      //   description: t('Close this overlay'),
      //   callable: () => {
      //     panel.hide();
      //   },
      // },

      {
        keys: 'g, h',
        path: '/',
        description: t('Go home'),
        toast: t('Going home …'),
      },
      {
        keys: 'g, p',
        path: '/projects/showMy',
        description: t('Show projects'),
        toast: t('Going to projects …'),
      },
      {
        keys: 'g, c',
        path: '/calendar/showMyCalendar',
        description: t('Show calendar'),
        toast: t('Going to calendar …'),
      },
      {
        keys: 'g, m',
        path: '/users/editOwn/',
        description: t('Show profile'),
      },
      {
        keys: 'g, t, w',
        path: '/timesheets/showMy',
        description: t('Show week timesheets'),
      },
      {
        keys: 'g, t, l',
        path: '/timesheets/showMyList',
        description: t('Show list timesheets'),
      },
    ],
  },

  {
    title: t('Project'),
    shortcuts: [
      {
        keys: 'c',
        context: getProject,
        callable: (project) => {
          if (project) {
            const url = new URL(location.href);
            url.hash = '#/tickets/newTicket';
            navigate(url.toString());
          }
        },
        description: t('Create new To-Do in current project'),
      },
    ],
  },

  {
    title: t('To-do'),
    shortcuts: [
      {
        keys: 't',
        context: getToDo,
        callable: (todo) => {
          if (todo.url) {
            const url = new URL(todo.url);
            url.searchParams.set('tab', 'timesheet');
            navigate(url.toString());
          }
        },
        description: t('Track time on current To-Do'),
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
              <span class="then">{t('then')}</span>{' '}
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
      <h1>{t('Keyboard shortcuts')}</h1>

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
