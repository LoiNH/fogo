import style from './search.scss';
import { connect } from 'unistore';
import { actions, mappedActions, store } from '../../datastore';
import linkState from 'linkstate';
import { searchObserver } from '../../observers';

// svg
import searchSvg from '../../assets/svg/search.svg';
import clear from '../../assets/svg/clear.svg';

const { environment } = store.getState();
const { setSearchResults } = mappedActions;
searchObserver({ environment }).subscribe(setSearchResults);

export default connect('search,searching', actions)(
  ({ search, searching, setSearch, setSearching }) => {
    let input;
    function handleKeyup({ key }) {
      if (key == 'Escape') {
        if (input.value) {
          input.value = ''; 
        } else {
          setSearching(false);
          input.blur();
        }
      }
    }

    function clearInput() {
      input.value = '';
      input.focus();
    }

    return (
      <div class={style.searchBar} searching={searching}>
        <div class={style.searchInput}>
          <input
            ref={ref => (input = ref)}
            type="text"
            placeholder="Search"
            onFocus={() => setSearching(true)}
            onBlur={() => !search && setSearching(false)}
            onInput={linkState(store, 'search')}
            onKeyup={handleKeyup}
          />
          <img class={style.clear} src={clear} alt="clear search" onClick={() => clearInput()} />
        </div>

        <img class={style.icon} src={searchSvg} alt="search" onClick={() => input.focus()} />
      </div>
    );
  }
);
