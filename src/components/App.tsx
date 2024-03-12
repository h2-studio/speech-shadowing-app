import { JSXElement, Match, Switch } from 'solid-js';

import { useService } from '@/service';

import PracticePanel from './StartPanel';
import Header from './Header';
import PlayerPanel from './PracticePanel';

export default function App(): JSXElement {
  let service = useService();

  return (
    <>
      <Header />
      <Switch fallback={<PracticePanel />}>
        <Match when={service.store.isReady}>
          <PlayerPanel />
        </Match>
      </Switch>

    </>
  );
}
