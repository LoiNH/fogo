import { createStore } from 'unistore';
import * as rawActions from './actions';
import environment from '../environment';

let startingState = {
  currentUser: null,
  environment,
  images: [],
  image: null,
  imagesAllLoaded: false,
  imagesObserver: null,
  laggedPath: null,
  laggedCurrentUser: null,
  listState: null,
  isAdmin: false,
  path: null,
  search: '',
  searching: false,
  searchResults: null,
  selecting: false,
  selection: new Set(),
  showMenu: false,
  tags: new Set(),
  timestamp: Date.now(),
  token: null,
};
const serialized = localStorage.getItem('fogo-state');
if (serialized) {
  startingState = deserialize(serialized);
  const { images } = startingState;
  startingState.images = truncateImages(images);
}

const store = createStore(startingState);

const actions = store => rawActions;

const mappedActions = {};
for (let i in rawActions) {
  mappedActions[i] = store.action(rawActions[i]);
}

store.subscribe(state => {
  const { laggedCurrentUser, currentUser } = state;

  if (currentUser) {
    const serialized = serialize(state);
    localStorage.setItem('fogo-state', serialized);
  } else if (laggedCurrentUser) {
    localStorage.removeItem('fogo-state');
  }

  window.state = state;
});

function serialize(state) {
  const { images, selection, selecting, tags } = state;
  const serialized = {
    images,
    selection: Array.from(selection),
    selecting,
    tags: Array.from(tags),
  };
  return JSON.stringify(serialized);
}

function deserialize(serialized) {
  const { images, selection: selectionArray, selecting, tags } = JSON.parse(
    serialized
  );
  return {
    ...startingState,
    images,
    selection: new Set(selectionArray),
    selecting,
    tags: new Set(tags),
  };
}

function truncateImages(images) {
  return images.slice(0, 25);
}

export { actions, mappedActions, store };
